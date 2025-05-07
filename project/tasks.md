# 脱毛サロン予約カレンダーアプリ開発タスク

## Day1：環境構築・準備
- [x] GitHubリポジトリ作成
- [x] Firebaseプロジェクト作成
- [x] Reactプロジェクト（create-react-app）初期化
- [x] 必要ライブラリ導入（react-router-dom, dayjs など）
- [x] Firebase Authentication, Firestore, Hosting, Functionsの初期設定

## Day2：認証・ユーザー管理
- [x] ログイン画面の作成
- [x] ユーザー登録（メール＋パスワード）機能実装
- [x] ログイン／ログアウト機能実装
- [x] ユーザー情報（名前・電話番号など）の保存・取得

## Day3：予約機能・カレンダーUI
- [x] カレンダー画面の作成（空き時間の確認）
- [x] 日付・メニュー選択UIの実装
- [x] 予約登録機能（Firestore連携）
- [x] 予約閲覧・キャンセル機能
- [x] 週・月切り替え機能

## Day4：仕上げ・追加対応
- [x] サロン営業日・空き状況管理（将来的な管理者用も考慮）
- [x] バグ修正・UI調整
- [ ] デプロイ（Firebase Hosting）
- [ ] README・利用マニュアル作成

---

### 必要な機能（参考）
- ユーザー登録／ログイン／ログアウト
- ユーザー情報管理
- カレンダーで空き時間確認
- 日付・メニュー選択
- 予約登録・閲覧・キャンセル
- 週・月切り替え

### 技術選定
- フロントエンド：React（create-react-app）
- バックエンド/BaaS：Firebase（Authentication / Firestore / Functions / Hosting）
- ライブラリ：react-router-dom, dayjs など 