"use client";
import React, { useState, useEffect } from "react";
import { getAllReservations, updateReservationStatus, cancelReservation, ReservationData } from "../../services/reservationService";
import styles from "./Admin.module.css";
import { useRouter } from "next/navigation";
import { auth } from "@/libs/firebase";

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login"); // 未ログインならログインページへ
      } else {
        setUser(user);
        // 予約データ取得
        const all = await getAllReservations();
        // 自分の予約だけフィルタ
        const myReservations = all.filter(
          (r: any) => r.email === user.email // または r.uid === user.uid
        );
        setReservations(myReservations);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleStatusChange = async (id: string, status: ReservationData['status']) => {
    try {
      await updateReservationStatus(id, status);
      
      // 予約リストを更新
      setReservations(prevReservations => 
        prevReservations.map(reservation => 
          reservation.id === id ? { ...reservation, status } : reservation
        )
      );
    } catch (error) {
      console.error("ステータス更新エラー:", error);
      alert("ステータスの更新に失敗しました");
    }
  };

  const handleCancelReservation = async (id: string) => {
    if (window.confirm("この予約をキャンセルしますか？")) {
      try {
        await cancelReservation(id);
        
        // 予約リストを更新
        setReservations(prevReservations => 
          prevReservations.map(reservation => 
            reservation.id === id ? { ...reservation, status: 'canceled' } : reservation
          )
        );
      } catch (error) {
        console.error("予約キャンセルエラー:", error);
        alert("予約のキャンセルに失敗しました");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '受付中';
      case 'confirmed': return '確定済';
      case 'canceled': return 'キャンセル';
      default: return status;
    }
  };

  const filteredReservations = filterStatus === "all" 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

  // 日付でソート（新しい順）
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    if (a.date === b.date) {
      return a.time.localeCompare(b.time);
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>予約情報を読み込んでいます...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.adminTitle}>予約管理画面</h1>
      
      <div className={styles.filterControls}>
        <div className={styles.filterLabel}>ステータスフィルター:</div>
        <div className={styles.filterOptions}>
          <button 
            className={`${styles.filterButton} ${filterStatus === "all" ? styles.active : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            すべて
          </button>
          <button 
            className={`${styles.filterButton} ${filterStatus === "pending" ? styles.active : ""}`}
            onClick={() => setFilterStatus("pending")}
          >
            受付中
          </button>
          <button 
            className={`${styles.filterButton} ${filterStatus === "confirmed" ? styles.active : ""}`}
            onClick={() => setFilterStatus("confirmed")}
          >
            確定済
          </button>
          <button 
            className={`${styles.filterButton} ${filterStatus === "canceled" ? styles.active : ""}`}
            onClick={() => setFilterStatus("canceled")}
          >
            キャンセル
          </button>
        </div>
      </div>
      
      <div className={styles.reservationsCount}>
        {sortedReservations.length}件の予約があります
      </div>
      
      <div className={styles.reservationsList}>
        {sortedReservations.length > 0 ? (
          sortedReservations.map(reservation => (
            <div key={reservation.id} className={styles.reservationCard}>
              <div className={styles.reservationHeader}>
                <div className={styles.reservationDate}>
                  {formatDate(reservation.date)} {reservation.time}～
                </div>
                <div 
                  className={`${styles.statusBadge} ${styles[reservation.status]}`}
                >
                  {getStatusLabel(reservation.status)}
                </div>
              </div>
              
              <div className={styles.reservationDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>予約番号:</span>
                  <span className={styles.detailValue}>{reservation.id}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>お名前:</span>
                  <span className={styles.detailValue}>{reservation.name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>電話番号:</span>
                  <span className={styles.detailValue}>{reservation.phone}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>メール:</span>
                  <span className={styles.detailValue}>{reservation.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>サービス:</span>
                  <span className={styles.detailValue}>{reservation.service}</span>
                </div>
                {reservation.notes && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>備考:</span>
                    <span className={styles.detailValue}>{reservation.notes}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.reservationActions}>
                {reservation.status === 'pending' && (
                  <>
                    <button 
                      className={styles.confirmButton}
                      onClick={() => handleStatusChange(reservation.id!, 'confirmed')}
                    >
                      予約確定
                    </button>
                    <button 
                      className={styles.cancelButton}
                      onClick={() => handleCancelReservation(reservation.id!)}
                    >
                      キャンセル
                    </button>
                  </>
                )}
                {reservation.status === 'confirmed' && (
                  <button 
                    className={styles.cancelButton}
                    onClick={() => handleCancelReservation(reservation.id!)}
                  >
                    キャンセル
                  </button>
                )}
                {reservation.status === 'canceled' && (
                  <button 
                    className={styles.restoreButton}
                    onClick={() => handleStatusChange(reservation.id!, 'pending')}
                  >
                    予約を復元
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noReservations}>
            予約はありません
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 