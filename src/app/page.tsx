"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/libs/firebase";
import { getAllReservations, cancelReservation, ReservationData } from "@/services/reservationService";
import styles from "./page.module.css";
import Header from "./calendar/Header";

const MyPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const all = await getAllReservations();
        const myReservations = all.filter(
          (r: any) => r.email === user.email // または r.uid === user.uid
        );
        setReservations(myReservations);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("この予約をキャンセルしますか？")) return;
    try {
      await cancelReservation(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "canceled" } : r))
      );
    } catch (error) {
      alert("キャンセルに失敗しました");
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <Header />
      <main className={styles.myPageContainer}>
        <h1 className={styles.myPageTitle}>メンズ脱毛サロン<br />Salon Calendar App</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <img src="/salon2.png" alt="サロンイメージ2" style={{ width: '100%', maxWidth: 400, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
        </div>
        <p style={{ fontSize: '1.2rem', margin: '2rem 0', textAlign: 'center' }}>
          最新の脱毛機器と丁寧なカウンセリングで<br />
          あなたの美肌をサポートします。
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <button
            className={styles.cancelButton}
            style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}
            onClick={() => {
              if (user) {
                router.push('/calendar');
              } else {
                router.push('/login');
              }
            }}
          >
            {user ? '予約カレンダーへ' : 'ログインして予約する'}
          </button>
        </div>
      </main>
      <div className={styles.myPageContainer}>
        <h1 className={styles.myPageTitle}>マイページ（予約一覧）</h1>
        {reservations.length === 0 ? (
          <p>予約はありません。</p>
        ) : (
          <ul className={styles.reservationList}>
            {reservations.map((r) => (
              <li key={r.id} className={styles.reservationItem}>
                <span className={styles.reservationInfo}>
                  {r.date} {r.time} / {r.service} / {r.status === "canceled" ? "キャンセル済み" : "予約中"}
                </span>
                {r.status !== "canceled" && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel(r.id!)}
                  >
                    キャンセル
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyPage;


