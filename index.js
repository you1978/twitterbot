require('dotenv').config();
const { Client, GatewayIntentBits, Events, Partials } = require('discord.js');
const OpenAI = require('openai');
const { TwitterApi } = require('twitter-api-v2');

// Create OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create Twitter client
const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Get the read/write client
const rwClient = twitterClient.readWrite;

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

// When the client is ready, run this code
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for messages
client.on(Events.MessageCreate, async message => {
    // Ignore messages from bots
    if (message.author.bot) return;
    
    // Check if the message is in a channel named "x-rewrite"
    if (message.channel.name === 'x-rewrite') {
        try {
            // Show typing indicator
            await message.channel.sendTyping();
            
            // Call OpenAI API to rewrite for X (Twitter)
            const completion = await openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "あなたはX(Twitter)用の投稿をリライトする専門家です。元のメッセージを500文字以内で、X(Twitter)に適した形式にリライトしてください。改行も適度に入れてください。"
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
            
            // Send the rewritten text as a new message (not a reply)
            await message.channel.send(`${rewrittenText}`);
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

    // Check if it's a thumbs up reaction in x-rewrite channel
    if (reaction.emoji.name === '👍' && reaction.message.channel.name === 'x-rewrite') {
        // Check if the message was sent by the bot (to avoid posting the original message)
        if (reaction.message.author.id === client.user.id) {
            try {
                // Post to Twitter
                const tweet = await rwClient.v2.tweet(reaction.message.content);
                
                // React with checkmark to indicate success
                await reaction.message.react('✅');
                
                // Send a confirmation message
                await reaction.message.channel.send(`✅ Xに投稿しました！\nhttps://twitter.com/i/web/status/${tweet.data.id}`);
            } catch (error) {
                console.error('Twitter API error:', error);
                await reaction.message.react('❌');
                await reaction.message.channel.send('❌ X投稿エラー: ' + error.message);
            }
        }
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_BOT_TOKEN);