"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/libs/firebase";
import { doc, getDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
        } catch (error) {
          console.error("ユーザー情報の取得に失敗しました:", error);
          setUserName(user.email || "ゲスト");
        }
      } else {
        setUserName("");
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
      
      // 2. クッキー削除APIを呼び出し
      await fetch('/api/logout', { method: 'POST' });
      
      // 3. ログインページに遷移 (より確実なページ遷移のため)
      window.location.href = '/login';
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Salon Calendar</div>
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
    </header>
  );
};

export default Header; 