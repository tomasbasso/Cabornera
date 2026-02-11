
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const getCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (productData) => {
    // Axios detects FormData and sets 'Content-Type': 'multipart/form-data' automatically
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
};

// Tables
export const getTables = async () => {
    const response = await api.get('/tables');
    return response.data;
};

export const updateTablePosition = async (id, x, y) => {
    const response = await api.put(`/tables/${id}/move`, { x, y });
    return response.data;
};

export const toggleTableStatus = async (id, isOccupied) => {
    const response = await api.put(`/tables/${id}/status`, { IsOccupied: isOccupied });
    return response.data;
};

// Reservations
export const getReservations = async () => {
    const response = await api.get('/reservations');
    return response.data;
};

export const createReservation = async (reservation) => {
    try {
        const response = await api.post('/reservations', reservation);
        return response.data;
    } catch (error) {
        console.error("API Error createReservation:", error.response?.data || error);
        throw error;
    }
};

export const updateReservationStatus = async (id, status) => {
    const response = await api.put(`/reservations/${id}/status`, { Status: status });
    return response.data;
};
