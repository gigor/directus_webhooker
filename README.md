# Webhook Handler Service

A TypeScript-based service for receiving webhooks, verifying their signatures, and processing them to call third-party APIs.

## Features

- Webhook endpoint with signature verification
- TypeScript support
- Environment-based configuration
- Express.js server
- Modular route structure

## Setup

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Copy the environment example file and configure your variables:
    ```bash
    cp .env.example .env
    ```
4. Edit `.env` and set your webhook secret and other configuration options

## Development

To run the service in development mode with hot reloading:

```bash
npm run dev
```

## Production

To build and run the service in production:

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- `GET /health`
    - Returns server status

### Webhook Endpoint

- `POST /webhook`
    - Accepts webhook payloads
    - Requires `x-webhook-signature` header for verification
    - Payload format:
        ```typescript
        {
          "event_type": string,
          "data": any,
          "timestamp": number
        }
        ```

## Security

Webhooks are verified using HMAC SHA-256 signatures. Each request must include an `x-webhook-signature` header with the HMAC signature of the request body, using the configured webhook secret.
