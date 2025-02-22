import { Router, RequestHandler } from 'express';
import Mux from '@mux/mux-node';
import { search_mux_upload, update_mux_upload } from '../services/directus';

const router = Router();

const handle_mux_webhook: RequestHandler = async (req, res): Promise<void> => {
    
    const mux = new Mux({
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET,
        webhookSecret: process.env.MUX_WEBHOOK_SECRET
    });


    try {
        // Convert Buffer to string
        const raw_body = req.body.toString('utf8');
        
        let event;
        try {
            event = mux.webhooks.unwrap(raw_body, req.headers);
        } catch (error) {
            console.error(error);
            res.status(200).send();
            return;
        }

        if (!event) {
            res.status(400).send('Missing required fields in the webhook payload');
            return;
        }

        const { type, data } = event;

        try {
            console.log(`Received Mux event: ${type}`);

            switch (type) {
                case 'video.upload.asset_created': {
                    const upload_id = data.id;
                    const asset_id = data.asset_id;
                    const status = data.status;

                    const search_result = await search_mux_upload(upload_id);

                    if (search_result && search_result.length > 0) {
                        const item_id = search_result[0].id;
                        await update_mux_upload(item_id, {
                            asset_id,
                            status
                        });
                        console.log(
                            `Updated item ${item_id} with asset ID: ${asset_id}, status: ${status}`
                        );
                        res.status(200).send();
                    } else {
                        console.error(
                            `No matching item found for the uploadId: ${upload_id}`
                        );
                        res.status(200).send();
                    }
                    break;
                }

                case 'video.asset.ready': {
                    const upload_id = data.upload_id;
                    const asset_id = data.id;
                    const playback_id = data.playback_ids?.[0]?.id;
                    const status = data.status;

                    if (!upload_id) {
                        console.error('Missing upload_id in webhook payload');
                        res.status(200).send();
                        return;
                    }

                    const search_result = await search_mux_upload(upload_id);

                    if (search_result && search_result.length > 0) {
                        const item_id = search_result[0].id;
                        await update_mux_upload(item_id, {
                            asset_id,
                            playback_id,
                            status
                        });
                        console.log(
                            `Updated item ${item_id} with asset ID: ${asset_id}, playback ID: ${playback_id}, status: ${status}`
                        );
                        res.status(200).send();
                    } else {
                        console.error(
                            `No matching item found for the uploadId: ${upload_id}`
                        );
                        res.status(200).send();
                    }
                    break;
                }

                default:
                    console.log(`Unhandled event type: ${type}`);
                    res.status(200).send('Event received but not handled.');
                    break;
            }
        } catch (error) {
            console.error('Failed to process webhook event:', error);
            res.status(500).send('Error processing webhook event.');
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.post('/webhooks/mux', handle_mux_webhook);

export default router;
