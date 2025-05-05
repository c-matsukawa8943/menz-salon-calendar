'use client'
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";

const CalendarPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div>
      <h1>カレンダー画面</h1>
      <p>ここにカレンダーを表示します。</p>
      <button onClick={handleLogout} style={{ marginTop: 24, padding: 10 }}>
        ログアウト
      </button>
    </div>
  );
};

export default CalendarPage; 