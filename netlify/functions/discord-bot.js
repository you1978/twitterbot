// Netlify function handler - simple status endpoint
exports.handler = async (event, context) => {
    try {
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Discord bot deployment successful',
                timestamp: new Date().toISOString(),
                status: 'healthy',
                note: 'Discord bot should be running as a separate service, not as a serverless function'
            })
        };

        return response;
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};