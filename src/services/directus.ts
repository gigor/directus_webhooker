import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DIRECTUS_TOKEN) {
    throw new Error('DIRECTUS_TOKEN is not set in environment variables');
}

if (!process.env.DIRECTUS_URL) {
    throw new Error('DIRECTUS_URL is not set in environment variables');
}

// Ensure base URL is properly formatted
const base_url = process.env.DIRECTUS_URL;
const normalized_url = base_url.endsWith('/') ? base_url.slice(0, -1) : base_url;

const directus_client = axios.create({
    baseURL: normalized_url,
    headers: {
        'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

export const search_mux_upload = async (upload_id: string) => {
    try {
        console.log('Making request to:', `${normalized_url}/items/mux_uploads`);
        const response = await directus_client.get('/items/mux_uploads', {
            params: {
                fields: ['id', 'upload_id', 'asset_id', 'playback_id', 'status'],
                filter: {
                    upload_id: {
                        _eq: upload_id
                    }
                },
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error searching mux upload:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response:', error.response?.data);
        }
        throw error;
    }
};

export const update_mux_upload = async (item_id: string, data: any) => {
    try {
        const response = await directus_client.patch(
            `/items/mux_uploads/${item_id}`,
            data
        );
        return response.data.data;
    } catch (error) {
        console.error('Error updating mux upload:', error);
        if (axios.isAxiosError(error)) {
            console.error('Response:', error.response?.data);
        }
        throw error;
    }
};
