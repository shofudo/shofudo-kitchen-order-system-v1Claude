# GitHub Pages 設定ガイド

## ファイル構成

以下のファイルを GitHub リポジトリにアップロードしてください:

```
your-repo/
├── index.html          # ホール用画面
├── kitchen.html        # キッチン用画面
├── manifest.json       # ホール用PWA設定
├── manifest-kitchen.json  # キッチン用PWA設定
├── sw.js              # Service Worker
├── icons/             # アイコンフォルダ(作成してください)
│   ├── icon-192.png   # 192x192のアイコン
│   └── icon-512.png   # 512x512のアイコン
├── ICON_README.md     # アイコン作成の説明
└── PWA_INSTALL.md     # PWAインストール手順
```

---

## 重要: パス設定について

**✅ すべてのファイルは相対パスで設定済みです**

このシステムは、どのような GitHub Pages 構成でも動作するように、**すべてのパスを相対パス(`./`)で設定**しています。

そのため、以下のどちらの構成でも**パスの修正は不要**です:

### ケース 1: ユーザー名.github.io リポジトリ

- **リポジトリ URL**: `https://github.com/ユーザー名/ユーザー名.github.io`
- **公開 URL**: `https://ユーザー名.github.io/`
- **修正**: 不要 ✅

### ケース 2: プロジェクトリポジトリ

- **リポジトリ URL**: `https://github.com/ユーザー名/リポジトリ名`
- **公開 URL**: `https://ユーザー名.github.io/リポジトリ名/`
- **修正**: 不要 ✅

---

## アイコンの配置

1. リポジトリのルートに `icons` フォルダを作成
2. `ICON_README.md` の手順に従ってアイコンを作成
3. `icon-192.png` と `icon-512.png` を `icons` フォルダに配置

---

## GitHub Pages の有効化手順

1. **GitHub リポジトリにアクセス**

   - https://github.com/ユーザー名/リポジトリ名

2. **Settings タブをクリック**

3. **左メニューの「Pages」をクリック**

4. **Source を設定**

   - Branch: `main` (または `master`)
   - Folder: `/ (root)`
   - 「Save」をクリック

5. **数分待つ**

   - GitHub Pages のビルドが完了するまで待つ
   - 完了すると、公開 URL が表示されます

6. **アクセステスト**
   - 表示された URL(例: `https://ユーザー名.github.io/`)にアクセス
   - index.html が表示されれば OK

---

## PWA として動作しているか確認する方法

### Chrome デベロッパーツールで確認

1. **PC 版 Chrome でアクセス**

   - 公開 URL にアクセス

2. **デベロッパーツールを開く**

   - F12 キーまたは右クリック →「検証」

3. **Application タブをクリック**

4. **Manifest を確認**

   - 左メニューの「Manifest」をクリック
   - manifest.json の内容が表示されれば OK

5. **Service Worker を確認**
   - 左メニューの「Service Workers」をクリック
   - sw.js が「activated and is running」と表示されれば OK

---

## トラブルシューティング

### Service Worker が登録されない

**原因**: HTTPS でアクセスしていない
**対処**: GitHub Pages は自動的に HTTPS になりますが、URL が `https://` で始まっていることを確認

### manifest.json が読み込まれない

**原因**: パスが間違っている
**対処**: ブラウザのデベロッパーツール →Network タブで 404 エラーを確認し、パスを修正

### アイコンが表示されない

**原因**: アイコンファイルが配置されていない、またはパスが間違っている
**対処**:

- `icons/icon-192.png` と `icons/icon-512.png` が存在するか確認
- manifest.json の `icons` セクションのパスを確認

---

## 本番運用前のチェックリスト

- [ ] すべてのファイルが GitHub にアップロードされている
- [ ] GitHub Pages が有効化されている
- [ ] HTTPS でアクセスできる
- [ ] manifest.json のパスが正しい
- [ ] アイコンが配置されている
- [ ] Service Worker が登録されている
- [ ] Android タブレットで「ホーム画面に追加」が表示される
- [ ] インストール後、URL バーなしで起動できる
- [ ] キッチン画面で「通知音テスト」ボタンが動作する

---

## サポート

何か問題があれば、以下を確認してください:

1. ブラウザのコンソールログ(F12→Console)
2. Network タブで 404 エラーがないか
3. Application タブで manifest.json と Service Worker の状態
