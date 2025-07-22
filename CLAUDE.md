# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm install` - Install dependencies
- `npm start` - Run the bot in production mode
- `npm run dev` - Run the bot in development mode with auto-restart (nodemon)
- `node deploy-commands.js` - Deploy slash commands to Discord (must be run after adding/modifying commands)

### Setup
1. Copy `.env.example` to `.env` and fill in the required values:
   - `DISCORD_BOT_TOKEN` - Discord bot token from Discord Developer Portal
   - `CLIENT_ID` - Application ID from Discord Developer Portal
   - `OPENAI_API_KEY` - OpenAI API key for the rewrite feature

## Architecture

This is a Discord bot built with discord.js v14 that provides three main features:

1. **Auto-reply in x-bot channel**: Listens for messages in channels named "x-bot" and responds with a greeting including the original message content.

2. **X (Twitter) rewrite in x-rewrite channel**: Uses OpenAI's GPT-4o model to rewrite messages posted in channels named "x-rewrite" into Twitter-appropriate format (max 500 characters).

3. **Slash command /hello**: A global slash command that responds with "こんにちは".

### Key Files
- `index.js` - Main bot logic handling message events and slash commands
- `deploy-commands.js` - Script to register slash commands with Discord
- `.env` - Environment variables (bot token, client ID, OpenAI API key)

### Important Notes
- The bot requires MESSAGE CONTENT INTENT to be enabled in Discord Developer Portal
- Uses OpenAI's `gpt-4o` model for the rewrite feature
- Bot permissions needed: Send Messages, Read Message History
- Slash commands must be deployed using `deploy-commands.js` before they can be used

## 🔨 最重要ルール - 新しいルールの追加プロセス

ユーザーから今回限りではなく常に対応が必要だと思われる指示を受けた場合：

1. 「これを標準のルールにしますか？」と質問する
2. YESの回答を得た場合、CLAUDE.mdに追加ルールとして記載する
3. 以降は標準ルールとして常に適用する

このプロセスにより、プロジェクトのルールを継続的に改善していきます。

## 📝 プロジェクト固有のルール

### X (Twitter) 投稿の丁寧さ
- X投稿のリライト機能では、常に丁寧で礼儀正しい表現を使用する
- 敬語を適切に使用し、攻撃的な表現は避ける
- 建設的で前向きなトーンを心がける

### システムプロンプトのカスタマイズ
- "setting"チャンネルに投稿された最後のメッセージがシステムプロンプトとして使用される
- このカスタムプロンプトは環境変数やデフォルトプロンプトよりも優先される
- システムプロンプトが更新されると、ボットは確認メッセージを返す