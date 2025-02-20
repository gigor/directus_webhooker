import express from 'express';
import dotenv from 'dotenv';
import webhookRouter from './routes/webhook';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for raw bodies (used by webhooks)
app.use('/webhooks/mux', express.raw({ type: '*/*' }));

// Middleware for parsing JSON bodies (for other routes)
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Register webhook routes at the root level
app.use('/', webhookRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
