require('dotenv').config();
const { Client, GatewayIntentBits, Events, Partials, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');
// Create OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Store custom system prompt
let customSystemPrompt = null;

// When the client is ready, run this code
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for messages
client.on(Events.MessageCreate, async message => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Check if the message is in a channel named "setting"
    if (message.channel.name === 'setting') {
        // Just acknowledge the message, wait for thumbs up reaction
        await message.react('👀');
        return;
    }
    
    // Check if the message is in a channel named "x-rewrite"
    if (message.channel.name === 'x-rewrite') {
        try {
            // Show typing indicator
            await message.channel.sendTyping();
            
            // Call OpenAI API to rewrite for X (Twitter)
            const completion = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-4.1-nano-2025-04-14",
                messages: [
                    {
                        role: "system",
                        content: customSystemPrompt || process.env.SYSTEM_PROMPT || "あなたはX(Twitter)用の投稿をリライトする専門家です。元のメッセージを、X(Twitter)に適した形式にリライトしてください。改行も適度に入れてください。丁寧で礼儀正しい表現を使い、敬語を適切に使用してください。攻撃的な表現は避け、建設的で前向きなトーンを心がけてください。"
                    },
                    {
                        role: "user",
                        content: message.content
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            });
            
            const rewrittenText = completion.choices[0].message.content;
            
            // Function to send long rewritten text using embed
            const sendRewrittenText = async (channel, text) => {
                if (text.length <= 2000) {
                    // Short text: send as regular message
                    await channel.send(`${text}`);
                } else {
                    // Long text: send as embed with fields
                    const embed = new EmbedBuilder()
                        .setTitle('🔄 X投稿用リライト結果')
                        .setColor(0x1DA1F2);

                    // Split content into fields (each field can hold up to 1024 characters)
                    const maxFieldLength = 1020;
                    const contentParts = [];
                    
                    // Split by lines first to preserve formatting
                    const lines = text.split('\n');
                    let currentPart = '';
                    
                    for (const line of lines) {
                        if (currentPart.length + line.length + 1 > maxFieldLength) {
                            if (currentPart.trim()) {
                                contentParts.push(currentPart);
                                currentPart = '';
                            }
                            
                            // If a single line is too long, split it
                            if (line.length > maxFieldLength) {
                                let remainingLine = line;
                                while (remainingLine.length > maxFieldLength) {
                                    contentParts.push(remainingLine.substring(0, maxFieldLength));
                                    remainingLine = remainingLine.substring(maxFieldLength);
                                }
                                currentPart = remainingLine;
                            } else {
                                currentPart = line;
                            }
                        } else {
                            currentPart += (currentPart ? '\n' : '') + line;
                        }
                    }
                    
                    if (currentPart.trim()) {
                        contentParts.push(currentPart);
                    }

                    // Add content as fields
                    contentParts.forEach((part, index) => {
                        const fieldName = contentParts.length > 1 ? `📝 リライト結果 (${index + 1}/${contentParts.length})` : '📝 リライト結果';
                        embed.addFields({
                            name: fieldName,
                            value: part,
                            inline: false
                        });
                    });

                    embed.setFooter({ text: `文字数: ${text.length}文字 | 👍を押すとX投稿画面を開きます` });

                    await channel.send({ embeds: [embed] });
                }
            };
            
            // Send the rewritten text
            await sendRewrittenText(message.channel, rewrittenText);
        } catch (error) {
            console.error('OpenAI API error:', error);
            await message.reply('❌ リライト中にエラーが発生しました。APIキーを確認してください。');
        }
    }
});


// Listen for reaction add events
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            return;
        }
    }

    // Ignore bot reactions
    if (user.bot) return;

    // Check if it's a thumbs up reaction in setting channel
    if (reaction.emoji.name === '👍' && reaction.message.channel.name === 'setting') {
        // Check if the message was sent by a user (not the bot)
        if (reaction.message.author.id !== client.user.id) {
            try {
                // Show typing indicator
                await reaction.message.channel.sendTyping();
                
                // Call OpenAI API to rewrite the message as a system prompt
                const completion = await openai.chat.completions.create({
                    model: process.env.OPENAI_MODEL || "gpt-4.1-nano-2025-04-14",
                    messages: [
                        {
                            role: "system",
                            content: "あなたはAIシステムプロンプトの専門家です。ユーザーの要望を理解し、それを効果的なシステムプロンプトに変換してください。明確で具体的な指示を含め、AIが期待通りに動作するようなプロンプトを作成してください。"
                        },
                        {
                            role: "user",
                            content: reaction.message.content
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                });
                
                const rewrittenPrompt = completion.choices[0].message.content;
                
                // Update the custom system prompt
                customSystemPrompt = rewrittenPrompt;
                
                // React with checkmark to indicate success
                await reaction.message.react('✅');
                
                // Send the rewritten prompt as a reply
                await reaction.message.reply(`システムプロンプトを更新しました:\n\`\`\`\n${customSystemPrompt}\n\`\`\``);
            } catch (error) {
                console.error('OpenAI API error:', error);
                await reaction.message.react('❌');
                await reaction.message.channel.send('❌ システムプロンプトの生成中にエラーが発生しました。');
            }
        }
        return;
    }

    // Check if it's a thumbs up reaction in x-rewrite channel
    if (reaction.emoji.name === '👍' && reaction.message.channel.name === 'x-rewrite') {
        // Check if the message was sent by the bot (to avoid processing the original message)
        if (reaction.message.author.id === client.user.id) {
            try {
                // Get the message content
                const messageContent = reaction.message.content;
                
                // Check if content is over 2000 characters for URL encoding
                let tweetUrl = '';
                if (messageContent.length > 2000) {
                    // For long content, just open X compose window without pre-filled text
                    tweetUrl = 'https://twitter.com/intent/tweet';
                } else {
                    // Create X post URL with pre-filled text for shorter content
                    tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(messageContent)}`;
                }
                
                // React with checkmark to indicate success
                await reaction.message.react('✅');
                
                // Function to create embed with long text using fields
                const createLongTextEmbed = (messageContent, tweetUrl) => {
                    const embed = new EmbedBuilder()
                        .setTitle('📋 X投稿用テキスト')
                        .setColor(0x1DA1F2) // Twitter blue color
                        .addFields({
                            name: '🔗 X投稿画面',
                            value: messageContent.length > 2000 
                                ? '[こちらをクリック](https://twitter.com/intent/tweet)'
                                : `[こちらをクリック](${tweetUrl})`,
                            inline: false
                        });

                    // Split content into fields (each field can hold up to 1024 characters)
                    const maxFieldLength = 1020; // Leave some buffer
                    const contentParts = [];
                    
                    if (messageContent.length <= maxFieldLength) {
                        contentParts.push(messageContent);
                    } else {
                        // Split by lines first to preserve formatting
                        const lines = messageContent.split('\n');
                        let currentPart = '';
                        
                        for (const line of lines) {
                            if (currentPart.length + line.length + 1 > maxFieldLength) {
                                if (currentPart.trim()) {
                                    contentParts.push(currentPart);
                                    currentPart = '';
                                }
                                
                                // If a single line is too long, split it
                                if (line.length > maxFieldLength) {
                                    let remainingLine = line;
                                    while (remainingLine.length > maxFieldLength) {
                                        contentParts.push(remainingLine.substring(0, maxFieldLength));
                                        remainingLine = remainingLine.substring(maxFieldLength);
                                    }
                                    currentPart = remainingLine;
                                } else {
                                    currentPart = line;
                                }
                            } else {
                                currentPart += (currentPart ? '\n' : '') + line;
                            }
                        }
                        
                        if (currentPart.trim()) {
                            contentParts.push(currentPart);
                        }
                    }

                    // Add content as fields
                    contentParts.forEach((part, index) => {
                        const fieldName = contentParts.length > 1 ? `📝 コピーされた内容 (${index + 1}/${contentParts.length})` : '📝 コピーされた内容';
                        const fieldValue = `\`\`\`\n${part}\`\`\``;
                        
                        // Check field value length (Discord limit is 1024 characters)
                        if (fieldValue.length > 1024) {
                            console.warn(`Field value too long: ${fieldValue.length} characters, truncating...`);
                            const truncatedValue = `\`\`\`\n${part.substring(0, 1014)}\`\`\``;
                            embed.addFields({
                                name: fieldName,
                                value: truncatedValue,
                                inline: false
                            });
                        } else {
                            embed.addFields({
                                name: fieldName,
                                value: fieldValue,
                                inline: false
                            });
                        }
                    });

                    // Add usage instructions
                    const instructions = messageContent.length > 2000 
                        ? '💡 **使い方:** 上記のテキストをコピーして、リンクをクリックしてX投稿画面に手動で貼り付けてください。\n⚠️ **注意:** 長いテキストのため、リンクからは自動入力されません。'
                        : '💡 **使い方:** 上記のテキストをコピーして、リンクをクリックしてX投稿画面に貼り付けてください。';
                    
                    embed.addFields({
                        name: '使い方',
                        value: instructions,
                        inline: false
                    });

                    if (messageContent.length > 2000) {
                        embed.setFooter({ text: `文字数: ${messageContent.length}文字` });
                    }

                    return embed;
                };

                // Send embed with X post link and copy instructions
                const embed = createLongTextEmbed(messageContent, tweetUrl);
                await reaction.message.channel.send({ embeds: [embed] });
                
            } catch (error) {
                console.error('URL generation error:', error);
                console.error('Message content length:', messageContent.length);
                console.error('Message content preview:', messageContent.substring(0, 100) + '...');
                await reaction.message.react('❌');
                await reaction.message.channel.send('❌ X投稿画面の生成でエラーが発生しました: ' + error.message);
            }
        }
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);

// Add HTTP server for Render health checks
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Handle ping endpoint for keep-alive
    if (req.url === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'pong',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // Default health check
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'healthy',
        bot: client.user ? `${client.user.tag} is online` : 'Bot is starting...',
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT, () => {
    console.log(`Health check server running on port ${PORT}`);
});

// Keep-alive function to prevent Render from sleeping
const RENDER_URL = 'https://twitterbot-544x.onrender.com/ping';
const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes

function keepAlive() {
    const https = require('https');
    const url = require('url');
    
    const options = url.parse(RENDER_URL);
    options.method = 'GET';
    
    const req = https.request(options, (res) => {
        console.log(`Keep-alive ping: ${res.statusCode}`);
    });
    
    req.on('error', (error) => {
        console.log('Keep-alive ping failed:', error.message);
    });
    
    req.end();
}

// Start keep-alive pings after bot is ready
client.once(Events.ClientReady, () => {
    console.log('Starting keep-alive pings...');
    setInterval(keepAlive, KEEP_ALIVE_INTERVAL);
});