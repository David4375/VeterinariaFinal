import axios from 'axios';
import type { RegistroCompletoDTO } from '../models'; 

const API_URL = 'http://localhost:5224/api'; 

// --- CLIENTES ---
export const ClienteService = {
    getAll: () => axios.get(`${API_URL}/Cliente`),
    registrarCompleto: (data: RegistroCompletoDTO) => axios.post(`${API_URL}/Cliente/registrar-completo`, data)
};

// --- MASCOTAS ---
export const MascotaService = {
    getAll: () => axios.get(`${API_URL}/Mascota`),
    create: (data: any) => axios.post(`${API_URL}/Mascota`, data),
    delete: (id: string) => axios.delete(`${API_URL}/Mascota/${id}`)
};

// --- CITAS ---
export const CitaService = {
    getAll: () => axios.get(`${API_URL}/Cita`),
    create: (data: any) => axios.post(`${API_URL}/Cita`, data),
    // Si usas editar citas también, asegúrate de tenerlo:
    update: (id: string, data: any) => axios.put(`${API_URL}/Cita/${id}`, data), 
    delete: (id: string) => axios.delete(`${API_URL}/Cita/${id}`)
};

// --- MEDICAMENTOS (AQUÍ ESTABA EL ERROR) ---
export const MedicamentoService = { 
    getAll: () => axios.get(`${API_URL}/Medicamento`),
    create: (data: any) => axios.post(`${API_URL}/Medicamento`, data),
    
    // 👇 ESTA LÍNEA FALTABA, POR ESO NO TE DEJABA EDITAR:
    update: (id: string, data: any) => axios.put(`${API_URL}/Medicamento/${id}`, data),
    
    delete: (id: string) => axios.delete(`${API_URL}/Medicamento/${id}`)
};

// --- VENTAS ---
export const VentaService = {
    getHistorial: () => axios.get(`${API_URL}/Venta`),
    registrar: (data: any) => axios.post(`${API_URL}/Venta`, data)
};

// --- FACTURAS ---
export const FacturaService = {
    getHistorial: () => axios.get(`${API_URL}/Factura`),
    emitir: (data: any) => axios.post(`${API_URL}/Factura`, data)
};