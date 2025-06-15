# 【完全自動化】ChatGPTに毎回Xポストを修正してもらっている私が、ついにDiscordボットを作った話

こんにちは！テック系インフルエンサーの〇〇です。

今日は、私の「ちょっと恥ずかしい秘密」を公開します。実は私、Xに投稿する前に**毎回ChatGPTに文章を修正してもらっています**。

でも毎回ChatGPTのページを開いて、コピペして、修正してもらって...という作業が面倒になってきました。そこで、**Discord上で自動的にリライトしてくれるボット**を作ったので、格安で使える方法を詳しく解説します！

## なぜDiscordボットなのか？

1. **Discordは常に開いている** - 仕事でもプライベートでも使用
2. **スマホからも簡単** - 外出先でもサクッとリライト
3. **履歴が残る** - 過去のリライト結果を見返せる
4. **チーム共有も可能** - 複数人で使える

## こんな感じで動きます

1. Discordの`x-rewrite`チャンネルに投稿したい内容を書く
2. 数秒でGPT-4oがX用にリライトしてくれる
3. 気に入ったら👍リアクションを付ける
4. **自動的にXに投稿される！**

## 完全ガイド：ゼロから30分でセットアップ

### ステップ1: GitHubでリポジトリをフォーク

1. 元のリポジトリにアクセス: https://github.com/original-author/discord-x-bot
2. 右上の「Fork」ボタンをクリック
3. 自分のGitHubアカウントにコピーされます

もしGitHubアカウントを持っていない場合：
- https://github.com にアクセス
- 「Sign up」から無料アカウントを作成

### ステップ2: 必要なAPIキーを取得

#### 2-1. Discord Bot Tokenの取得

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセス
2. 「New Application」をクリック
3. アプリケーション名を入力（例: X投稿Bot）
4. 左側メニューの「Bot」をクリック
5. 「Add Bot」をクリック
6. **TOKEN**の「Copy」ボタンでコピー（これが`DISCORD_BOT_TOKEN`）

**重要な設定：**
- Privileged Gateway Intentsセクションで以下をONに：
  - MESSAGE CONTENT INTENT
  - SERVER MEMBERS INTENT

7. 左側メニューの「OAuth2」→「General」から**CLIENT ID**をコピー

#### 2-2. OpenAI API Keyの取得

1. [OpenAI Platform](https://platform.openai.com/api-keys)にアクセス
2. アカウントを作成またはログイン
3. 「Create new secret key」をクリック
4. キーをコピー（これが`OPENAI_API_KEY`）

**料金について：**
- 初回は$5分の無料クレジット付き
- 月1,000投稿で約$2-3程度

#### 2-3. Twitter API v2の認証情報取得

1. [Twitter Developer Portal](https://developer.twitter.com)にアクセス
2. 「Sign up」から開発者アカウントを作成
3. 「Create App」をクリック
4. アプリ情報を入力

**必要な権限：**
- App permissions: Read and Write

5. 「Keys and tokens」タブから以下を取得：
   - API Key（`TWITTER_API_KEY`）
   - API Secret Key（`TWITTER_API_SECRET`）
   - Access Token（`TWITTER_ACCESS_TOKEN`）
   - Access Token Secret（`TWITTER_ACCESS_TOKEN_SECRET`）

### ステップ3: Railwayでデプロイ

1. [Railway](https://railway.app)にアクセス
2. GitHubアカウントでログイン
3. 「New Project」→「Deploy from GitHub repo」
4. フォークしたリポジトリを選択
5. 「Add variables」で環境変数を設定：

```
DISCORD_BOT_TOKEN=（取得したDiscord Bot Token）
CLIENT_ID=（取得したClient ID）
OPENAI_API_KEY=（取得したOpenAI API Key）
OPENAI_MODEL=gpt-4o
TWITTER_API_KEY=（取得したTwitter API Key）
TWITTER_API_SECRET=（取得したTwitter API Secret）
TWITTER_ACCESS_TOKEN=（取得したTwitter Access Token）
TWITTER_ACCESS_TOKEN_SECRET=（取得したTwitter Access Token Secret）
```

6. 「Deploy」をクリック

**Railwayの料金：**
- 月$5の無料枠あり（このボットなら余裕で収まる）

### ステップ4: DiscordサーバーにBotを招待

1. Discord Developer Portalに戻る
2. 「OAuth2」→「URL Generator」
3. Scopesで以下を選択：
   - bot
   - applications.commands
4. Bot Permissionsで以下を選択：
   - Send Messages
   - Read Message History
   - Add Reactions
5. 生成されたURLをコピーしてブラウザで開く
6. 招待したいサーバーを選択

### ステップ5: 使い方

1. Discordで`x-rewrite`という名前のチャンネルを作成
2. そのチャンネルに投稿したい内容を書く
3. Botが自動的にリライト
4. 気に入ったら👍リアクションを付ける
5. Xに自動投稿される！

## コスト面

- OpenAI API: 月1,000投稿で約$2-3（GPT-4o使用時）
- Twitter API: 無料枠で十分
- Discord Bot: 無料

つまり、**月300円程度で専属のSNSライティングアシスタント**が手に入ります。

### コスト削減のヒント

OPENAI_MODELを変更することで、さらにコストを抑えることができます：

- `gpt-4o`（デフォルト）: 最高品質、約$0.03/投稿
- `gpt-4-turbo-preview`: 高品質、約$0.02/投稿  
- `gpt-3.5-turbo`: 低コスト、約$0.002/投稿（10分の1！）

予算に応じて.envファイルでモデルを変更できるのも、このボットの魅力です。

## カスタマイズのアイデア

- 絵文字の量を調整
- ハッシュタグを自動追加
- 投稿時間を予約
- 複数のリライトパターンを提案
- 画像も一緒に投稿

## まとめ

正直、「ChatGPTに頼ってる」って言うのは恥ずかしかったです。でも、考えてみれば**ツールを使って効率化するのはエンジニアの本質**ですよね。

このボットのおかげで：
- 投稿頻度が3倍に増えた
- エンゲージメント率が2倍に
- 投稿にかかる時間が1/5に

もしあなたも「実はChatGPT使ってる...」という方がいたら、ぜひこのボットを試してみてください！

## トラブルシューティング

### よくある質問

**Q: Botがオンラインにならない**
A: Railwayのログを確認してください。環境変数が正しく設定されているか確認を。

**Q: リライトされない**
A: OpenAI APIの残高を確認してください。無料クレジットが切れている可能性があります。

**Q: Xに投稿されない**
A: Twitter APIの権限が「Read and Write」になっているか確認してください。

**Q: 👍リアクションしても反応しない**
A: Botがリライトしたメッセージにのみ反応します。自分の元メッセージには反応しません。

## コミュニティ

質問や改善案があれば、GitHubのIssuesでお気軽に！
一緒により良いボットにしていきましょう。

---

### 追記

この記事もClaude Codeでライティングしてもらいました。元の文章は...まあ、察してください😅

#Discord #ChatGPT #自動化 #X #Twitter #GPT4 #OpenAI #テック系 #エンジニア #効率化 #Railway