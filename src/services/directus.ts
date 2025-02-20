import axios from 'axios';

const directus_client = axios.create({
    baseURL: process.env.DIRECTUS_URL,
    headers: {
        Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

export const search_mux_upload = async (upload_id: string) => {
    try {
        const response = await directus_client.get('/items/mux_uploads', {
            params: {
                filter: JSON.stringify({
                    upload_id: { _eq: upload_id }
                }),
                limit: 1
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error searching mux upload:', error);
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
        throw error;
    }
};
