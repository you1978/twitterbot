# Discord X投稿 Bot

DiscordからX(Twitter)に投稿するためのbotです：
- 「x-rewrite」チャンネル: メッセージをX(Twitter)用にリライト（OpenAI API使用）
  - 👍リアクションを付けると自動的にXに投稿

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

4. X (Twitter) APIキーを取得:
   - https://developer.twitter.com/ でアプリを作成
   - API Key、API Secret、Access Token、Access Token Secretを取得
   - **重要**: Read and Write権限が必要です

5. `.env`ファイルに設定を追加:
```
DISCORD_BOT_TOKEN=your_actual_token_here
CLIENT_ID=your_application_id_here
OPENAI_API_KEY=your_openai_api_key_here
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
```


6. ボットをサーバーに招待:
   - OAuth2 > URL Generator で以下を選択:
     - Scopes: bot, applications.commands
     - Bot Permissions: Send Messages, Read Message History, Add Reactions, Read Message History

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
- リライトされたメッセージに👍リアクションを付けると、自動的にXに投稿されます
- 投稿に成功すると✅リアクションが追加され、投稿へのリンクが表示されます

## 注意事項

- MESSAGE CONTENT INTENTとSERVER MEMBERS INTENTを有効化する必要があります（Discord Developer Portalで設定）
- ボットが各チャンネルにアクセス権限を持っていることを確認してください
- OpenAI APIキーが必要です（https://platform.openai.com/api-keys で取得）
- X (Twitter) APIのRead and Write権限が必要です
- 注: GPT-4oモデルを使用しています