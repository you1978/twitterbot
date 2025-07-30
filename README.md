# Discord X投稿 Bot

DiscordでX(Twitter)投稿を支援するbotです：
- 「x-rewrite」チャンネル: メッセージをX(Twitter)用にリライト（OpenAI API使用）
  - 👍リアクションを付けるとX投稿画面が開き、テキストがコピー可能に

## セットアップ

1. 依存関係をインストール:
```bash
npm install
```

2. `.env`ファイルを作成:
```bash
cp .env.example .env
```

3. Discord Developer Portalでボットを作成:
   - https://discord.com/developers/applications にアクセス
   - 新しいアプリケーションを作成
   - General Information から Application ID (Client ID) をコピー
   - Bot セクションでボットを作成
   - トークンをコピー
   - **重要**: Bot セクションで以下のIntentsを有効化:
     - MESSAGE CONTENT INTENT
     - SERVER MEMBERS INTENT (リアクション機能用)

4. `.env`ファイルに設定を追加:
```
DISCORD_BOT_TOKEN=your_actual_token_here
CLIENT_ID=your_application_id_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-nano-2025-04-14
SYSTEM_PROMPT=あなたはX(Twitter)用の投稿をリライトする専門家です。元のメッセージを、X(Twitter)に適した形式にリライトしてください。改行も適度に入れてください。
```

**OPENAI_MODELについて**:
- デフォルトは `gpt-4.1-nano-2025-04-14`（最新の超高速・低コストモデル）
- 他の利用可能なモデル: `gpt-4o`, `gpt-4-turbo-preview`, `gpt-3.5-turbo` など
- 高品質を求める場合は `gpt-4o` を使用

**SYSTEM_PROMPTについて**:
- AIがどのようにリライトするかを指定するプロンプト
- デフォルトはX(Twitter)用の汎用的なリライト
- カスタマイズ例:
  - エンジニア向け: `技術的な内容を分かりやすく、エンジニアの興味を引くようにリライトしてください。絵文字と専門用語を適切に使用してください。`
  - ビジネス向け: `ビジネスパーソン向けに、プロフェッショナルで説得力のある投稿にリライトしてください。`


5. ボットをサーバーに招待:
   - OAuth2 > URL Generator で以下を選択:
     - Scopes: bot, applications.commands
     - Bot Permissions: Send Messages, Read Message History, Add Reactions

## 実行

```bash
npm start
```

開発モード（自動再起動）:
```bash
npm run dev
```

## 使い方

**x-rewriteチャンネルでのリライト**: 「x-rewrite」という名前のチャンネルでメッセージを送信すると、X(Twitter)用にリライトします
- リライトされたメッセージに👍リアクションを付けると、X投稿画面へのリンクとコピー用テキストが表示されます
- 表示されたテキストをコピーして、リンクからX投稿画面を開いて貼り付けて投稿できます

## 注意事項

- MESSAGE CONTENT INTENTとSERVER MEMBERS INTENTを有効化する必要があります（Discord Developer Portalで設定）
- ボットが各チャンネルにアクセス権限を持っていることを確認してください
- OpenAI APIキーが必要です（https://platform.openai.com/api-keys で取得）
- Twitter APIは不要（ブラウザのX投稿画面を使用）
- 注: デフォルトでGPT-4.1 nanoモデルを使用（.envファイルで変更可能）

## デプロイについて

### 重要な注意点

このDiscord BotはWebSocketによる持続的な接続が必要なため、**Netlify Functionsなどのサーバーレス環境では正常に動作しません**。

### 推奨デプロイ方法

1. **Railway（推奨）**
   - コードをGitHubにアップロード
   - Railwayアカウントでリポジトリを接続
   - 環境変数を設定
   - 24時間稼働します

2. **Render**
   - Node.jsアプリケーションをサポート
   - 無料プランあり（制限あり）

3. **Heroku**
   - `Procfile`に`worker: node index.js`を記述
   - 従来のNode.jsアプリケーションホスティング

4. **VPS/クラウドサーバー**
   - DigitalOcean、AWS EC2など
   - PM2でプロセス管理

### 現在のNetlifyデプロイ

現在のNetlifyデプロイはステータス確認エンドポイントのみを提供しています。実際のDiscord Bot機能（`index.js`）は長時間実行プロセスをサポートするプラットフォームで実行する必要があります。