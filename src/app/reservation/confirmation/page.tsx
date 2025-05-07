"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getReservation } from "../../../services/reservationService";
import type { ReservationData } from "../../../services/reservationService";
import styles from "./Confirmation.module.css";
import { auth } from "@/libs/firebase";

const ReservationConfirmation: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reservationId = searchParams.get("id");
  
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 認証チェック
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) {
        setError("予約IDが見つかりません");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getReservation(reservationId);
        setReservation(data);
      } catch (err) {
        console.error("予約データの取得に失敗しました:", err);
        setError("予約情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>予約情報を読み込んでいます...</p>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className={styles.errorContainer}>
        <h2>エラーが発生しました</h2>
        <p>{error || "予約情報が見つかりませんでした"}</p>
        <button className={styles.backButton} onClick={handleBackToHome}>
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className={styles.confirmationPage}>
      <div className={styles.confirmationHeader}>
        <div className={styles.checkIcon}>✓</div>
        <h1>予約が完了しました</h1>
        <p>予約内容は以下の通りです</p>
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
          <span className={styles.detailLabel}>日付:</span>
          <span className={styles.detailValue}>{formatDate(reservation.date)}</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>時間:</span>
          <span className={styles.detailValue}>{reservation.time} ～ 30分</span>
        </div>
        
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>サービス:</span>
          <span className={styles.detailValue}>{reservation.service}</span>
        </div>
        
        <div className={styles.statusBadge} data-status={reservation.status}>
          {reservation.status === 'pending' && '予約受付中'}
          {reservation.status === 'confirmed' && '予約確定'}
          {reservation.status === 'canceled' && 'キャンセル済み'}
        </div>
      </div>

      <div className={styles.confirmationMessage}>
        <p>
          ご予約いただきありがとうございます。<br />
          予約確認メールを {reservation.email} 宛に送信しました。<br />
          当日はお気をつけてお越しください。
        </p>
      </div>

      <div className={styles.actionButtons}>
        <button className={styles.backButton} onClick={handleBackToHome}>
          ホームに戻る
        </button>
      </div>
    </div>
  );
};

export default ReservationConfirmation; 