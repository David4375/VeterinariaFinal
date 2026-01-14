import axios from 'axios';

// Asegúrate que el puerto coincida con tu .NET (revisa el launchSettings.json o la URL de Swagger)
export const api = axios.create({
    baseURL: 'http://localhost:5224/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});