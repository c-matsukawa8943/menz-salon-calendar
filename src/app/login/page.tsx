'use client'

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/libs/firebase';
import { useRouter } from 'next/navigation';

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
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
            <h2>ログイン</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>メールアドレス</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, marginBottom: 12 }}
                    />
                </div>
                <div>
                    <label>パスワード</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: 8, marginBottom: 12 }}
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </form>
            <button onClick={handleRegister} style={{ width: '100%', marginTop: 16, padding: 10 }}>
                新規登録はこちら
            </button>
        </div>
    );
};