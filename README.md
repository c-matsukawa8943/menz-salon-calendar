# 脱毛サロン予約カレンダーアプリ

このアプリは、メンズ脱毛サロン向けの予約管理カレンダーWebアプリです。お客様の予約・管理・キャンセル、管理者による予約状況の確認・管理ができます。

## 主な機能
- ユーザー登録・ログイン（メールアドレス＋パスワード）
- ログアウト機能
- ユーザー情報管理（名前・電話番号など）
- カレンダーで空き時間の確認
- 日付・メニュー選択による予約登録
- 予約の閲覧・キャンセル
- 週・月切り替え
- 管理者用の予約管理画面（全ユーザーの予約状況を確認・編集可能）
- トップページはログイン状態と未ログイン状態で表示範囲を分別
- 自身の予約状況を確認でき、簡単にキャンセルも可能

## 詳細機能・実装ポイント
- 新規登録機能実装
- ルーティングはNext.jsを使用
- Firestoreでセキュリティルールを設定し、認証ユーザーのみデータアクセス可能
- 管理者画面を作成し、管理者が全ユーザーの予約状況を確認・編集できるように実装
- Next.jsとfirebase-authでクッキー情報を管理し、的確なページのリダイレクトを実装
- 各ページで認証チェックを行い、自身のデータのみアクセス可能に実装

## 技術構成
- フロントエンド: Next.js (React)
- バックエンド/BaaS: Firebase (Authentication, Firestore, Hosting, Functions)
- ライブラリ: react-router-dom, dayjs など
- スタイル: CSS Modules

## セットアップ手順
1. リポジトリをクローン
   ```bash
   git clone <このリポジトリのURL>
   cd salon_calendar_app
   ```
2. 依存パッケージをインストール
   ```bash
   npm install
   # または
   yarn install
   ```
3. Firebaseプロジェクトを作成し、`.env.local`に必要な環境変数を設定
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
4. 開発サーバーを起動
   ```bash
   npm run dev
   # または
   yarn dev
   ```
5. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## デプロイ方法
Firebase Hosting または Vercel でデプロイ可能です。

### Firebase Hosting 例
1. Firebase CLIをインストール
   ```bash
   npm install -g firebase-tools
   ```
2. Firebaseにログイン
   ```bash
   firebase login
   ```
3. デプロイ
   ```bash
   npm run build
   firebase deploy
   ```

## 補足
- コードの品質維持のため、`npm run lint` で静的解析が可能です。
- 型安全のためTypeScriptを使用しています。
- Firestoreのセキュリティルールを適切に設定し、ユーザーごとにデータアクセスを制限しています。
- 認証状態に応じたページ遷移・リダイレクトを実装しています。

---

ご質問・不具合報告はIssueまたはPull Requestでお願いします。
