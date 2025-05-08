"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/libs/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ADMIN_EMAILS, ADMIN_UIDS } from "../../constants/admin";
import type { User } from "firebase/auth";
// import { adminApp } from "@/libs/firebase";

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(true);
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && snap.data().name) {
            setUserName(snap.data().name);
          } else {
            // Firestoreにデータがない場合はメールアドレスを表示
            setUserName(user.email || "ゲスト");
          }
          if (ADMIN_EMAILS.includes(user.email ?? "") && ADMIN_UIDS.includes(user.uid ?? "")) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました:", error);
          setUserName(user.email || "ゲスト");
        }
      } else {
        setUserName("");
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // コンポーネントのアンマウント時にリスナーを解除
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // 1. Firebaseからサインアウト
      await signOut(auth);

      // await adminApp.auth().revokeRefreshTokens(user?.uid ?? "");
      
      // 2. クッキー削除APIを呼び出し
      await fetch('/api/logout', { method: 'POST' });
      
      // 3. ログインページに遷移 (より確実なページ遷移のため)
      window.location.href = '/login';
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  // 未認証時はタイトルのみ表示
  if (!user && !loading) {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>Salon Calendar</div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Salon Calendar</div>
      {user && (
        <>
          <div className={styles.userArea}>
            <span className={styles.userName}>
              {loading 
                ? "読み込み中..." 
                : userName 
                  ? `${userName} さん` 
                  : ""}
            </span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              ログアウト
            </button>
          </div>
          <nav>
            <button
              onClick={() => router.push("/")}
              style={{
                marginRight: 16,
                padding: "8px 20px",
                borderRadius: 6,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              マイページ（予約状況）
            </button>
          </nav>
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              style={{
                marginLeft: "1rem",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.2rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              管理画面へ
            </button>
          )}
        </>
      )}
    </header>
  );
};

export default Header; 