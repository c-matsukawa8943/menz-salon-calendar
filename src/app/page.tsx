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
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        const all = await getAllReservations();
        // 自分の予約だけフィルタ
        const myReservations = all.filter(
          (r: any) => r.email === user.email // または r.uid === user.uid
        );
        setReservations(myReservations);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

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


