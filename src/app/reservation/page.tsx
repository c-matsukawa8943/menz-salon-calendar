"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/libs/firebase";
import ReservationForm from "./ReservationForm";
import styles from "./Reservation.module.css";
import { testFirebaseConnection } from "../../services/reservationService";

const ReservationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean, message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testFirebaseConnection();
        setConnectionStatus(result);
      } catch (error) {
        console.error("接続テストエラー:", error);
        setConnectionStatus({
          success: false,
          message: error instanceof Error ? error.message : "不明なエラーが発生しました"
        });
      }
    };

    checkConnection();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  // 日付を日本語表示用にフォーマット
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className={styles.reservationPage}>
      <h1 className={styles.pageTitle}>予約フォーム</h1>
      
      {connectionStatus && !connectionStatus.success && (
        <div className={styles.connectionError}>
          <p>Firebaseへの接続に問題があります</p>
          <p>エラー: {connectionStatus.message}</p>
        </div>
      )}
      
      <div className={styles.selectedDateTimeInfo}>
        <h2>ご希望の日時</h2>
        <p>
          <span className={styles.label}>日付:</span> {formatDate(date)}
          <span className={styles.label}>時間:</span> {time} ～ 30分
        </p>
      </div>
      <ReservationForm date={date} time={time} user={user} />
    </div>
  );
};

export default ReservationPage; 