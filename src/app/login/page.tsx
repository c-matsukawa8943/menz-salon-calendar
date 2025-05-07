'use client'

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const idToken = await auth.currentUser?.getIdToken();
            if (idToken) {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken }),
                });
                if (res.ok) {
                    window.location.href = '/calendar';
                } else {
                    setError('API レスポンスエラー: ' + await res.text());
                }
            }
        } catch (err) {
            setError('ログインに失敗しました: ' + err);
        }
        setLoading(false);
    };

    const handleRegister = () => {
        router.push('/register'); // 新規登録画面へ遷移
    };

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.loginTitle}>ログイン</h2>
            <form onSubmit={handleLogin} className={styles.loginForm}>
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
                <button type="submit" disabled={loading} className={styles.loginButton}>
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </form>
            <button onClick={handleRegister} className={styles.registerButton}>
                新規登録はこちら
            </button>
        </div>
    );
};