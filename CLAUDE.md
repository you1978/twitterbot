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
   - `OPENAI_MODEL` - OpenAI model to use (defaults to gpt-4.1-nano-2025-04-14)
   - `SYSTEM_PROMPT` - Default system prompt for rewrites (overridden by custom prompts from setting channel)

## Architecture

This is a Discord bot built with discord.js v14 that provides multiple features:

### Core Features
1. **X (Twitter) rewrite in x-rewrite channel**: Messages posted in channels named "x-rewrite" are automatically rewritten using OpenAI's GPT model into Twitter-appropriate format. Users can react with 👍 to open X post compose window with the rewritten content pre-filled and get copy-paste instructions.

2. **Dynamic system prompt management**: Messages in channels named "setting" can be converted to custom system prompts by reacting with 👍. The bot will use OpenAI to transform the message into a proper system prompt and use it for future rewrites.

3. **Deployment support**: Includes configuration for both Render (background worker) and Netlify (serverless function) deployments with health check endpoints and keep-alive functionality.

### Key Files
- `index.js` - Main bot logic handling message events, reactions, and health checks
- `deploy-commands.js` - Script to register slash commands with Discord (currently empty)
- `netlify/functions/discord-bot.js` - Netlify serverless function endpoint
- `render.yaml` - Render deployment configuration for background worker
- `netlify.toml` - Netlify deployment configuration
- `.env` - Environment variables (tokens, API keys, configuration)

### Deployment Architecture
- **Render**: Configured as a background worker service with keep-alive functionality
- **Netlify**: Configured as serverless functions with health check endpoint
- **Health checks**: HTTP server on port 3000 with `/ping` endpoint for monitoring
- **Keep-alive**: Automatic pinging every 10 minutes to prevent service sleeping

### Important Notes
- Bot requires MESSAGE CONTENT INTENT enabled in Discord Developer Portal
- Bot permissions needed: Send Messages, Read Message History, Add Reactions
- No Twitter API credentials required (uses intent URLs for posting)
- Custom system prompts override environment variable defaults
- Keep-alive functionality prevents Render service from sleeping

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