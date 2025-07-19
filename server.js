const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

// Your Discord bot token and channel ID
const DISCORD_BOT_TOKEN = 'MTM5NTk4NjA4NDQzNjkwNjAxNQ.GwJHvq.jgcKuS9QgAFHRNHPjTPev-KSkEcGyZexEu9H3k';
const DISCORD_CHANNEL_ID = '1395980660908359820';

app.use(cors());
app.use(express.json());

// Get Discord messages
app.get('/api/discord-messages', async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        
        const response = await fetch(`https://discord.com/api/v10/channels/${DISCORD_CHANNEL_ID}/messages?limit=${limit}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Discord API error: ${response.status}`);
        }
        
        const messages = await response.json();
        
        // Format messages for website
        const formattedMessages = messages
            .filter(msg => !msg.author.bot) // Only human messages
            .map(msg => ({
                id: msg.id,
                content: msg.content,
                author: msg.author.username,
                timestamp: msg.timestamp,
                type: 'discord'
            }));
        
        res.json({
            success: true,
            messages: formattedMessages
        });
        
    } catch (error) {
        console.error('Error fetching Discord messages:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch messages' 
        });
    }
});

app.listen(port, () => {
    console.log(`Discord proxy running on port ${port}`);
});
