"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { signOut } from "firebase/auth";
import { auth, db } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

const Header: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserName(snap.data().name || "");
        } else {
          setUserName(user.email || "");
        }
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      // 1. Firebaseからサインアウト
      await signOut(auth);
      
      // 2. クッキー削除APIを呼び出し
      await fetch('/api/logout', { method: 'POST' });
      
      // 3. ログインページに遷移
      router.push('/login');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Salon Calendar</div>
      <div className={styles.userArea}>
        <span className={styles.userName}>{userName ? `${userName} さん` : ""}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    </header>
  );
};

export default Header; 