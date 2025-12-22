import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const chatApi = {
    sendText: async (session_id: string, message: string) => {
        return apiClient.post('/chat/text', { session_id, message });
    },

    sendVoice: async (session_id: string, audioFile: File) => {
        const formData = new FormData();
        formData.append('session_id', session_id);
        formData.append('audio', audioFile);
        return apiClient.post('/chat/voice', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    sendImage: async (session_id: string, imageFile: File, message?: string) => {
        const formData = new FormData();
        formData.append('session_id', session_id);
        formData.append('image', imageFile);
        if (message) formData.append('message', message);
        return apiClient.post('/chat/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};
