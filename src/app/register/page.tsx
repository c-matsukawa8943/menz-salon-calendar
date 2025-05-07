'use client'

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/libs/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from './Register.module.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Firestoreにユーザー情報（名前）を保存
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });
      
      // IDトークンを取得
      const idToken = await user.getIdToken();
      
      // ログインAPIにトークンを送信してクッキーをセット
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      
      if (res.ok) {
        // 登録・ログイン成功時にカレンダー画面へ遷移
        window.location.href = '/calendar';
      } else {
        setError('ログイン処理に失敗しました');
      }
    } catch (err: any) {
      setError('登録に失敗しました: ' + (err.message || err));
    }
    setLoading(false);
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerTitle}>新規ユーザー登録</h2>
      <form onSubmit={handleRegister} className={styles.registerForm}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>名前</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type="submit" disabled={loading} className={styles.registerButton}>
          {loading ? '登録中...' : '登録'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage; 