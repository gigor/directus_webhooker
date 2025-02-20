import express from 'express';
import dotenv from 'dotenv';
import webhookRouter from './routes/webhook';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for raw bodies (used by webhooks)
app.use('/webhook', express.raw({ type: '*/*' }));

// Basic health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Register webhook routes
app.use('/webhook', webhookRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
