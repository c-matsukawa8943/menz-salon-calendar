'use client'

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/libs/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // ログイン成功時の処理（例：リダイレクトなど）
        } catch (err) {
            setError('ログインに失敗しました: ' + err);
        }
        setLoading(false);
    };

    const handleRegister = () => {
        // 新規登録画面への遷移やモーダル表示など（必要に応じて実装）
        alert('新規登録機能は未実装です');
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