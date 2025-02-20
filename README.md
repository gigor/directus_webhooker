# Webhook Handler Service

Why this exists? I could not figure out how to validate webhooks in directus extension (no access to raw request body). If you know how to do it, please let me know.

This service is used to handle webhooks from Mux and pass them to Directus.

Required for directus-extension-mux to work.

Deploy it wherever you want and point mux webhook to `https://your-service-url/webhooks/mux`

Check out the [directus-extension-mux](https://github.com/gigor/directus-extension-mux).

Also do not forget about environment variables. See `.env.example` for more information.
