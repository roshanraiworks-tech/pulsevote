import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || "https://pulsevote-rr0y.onrender.com",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;