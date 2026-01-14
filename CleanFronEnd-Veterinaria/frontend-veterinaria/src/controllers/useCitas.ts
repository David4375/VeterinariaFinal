import { useState, useEffect, useCallback } from 'react';
import { CitaService } from '../services/apiService';
import type { Cita } from '../models';

export const useCitas = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarCitas = useCallback(async () => {
        setLoading(true);
        try {
            const res = await CitaService.getAll();
            setCitas(res.data);
        } catch (error) {
            console.error("Error al cargar citas", error);
        }
        setLoading(false);
    }, []);

    const agendarCita = async (cita: Cita) => {
        try {
            await CitaService.create(cita);
            await cargarCitas();
            return true;
        } catch (error) {
            alert("Error al agendar.");
            return false;
        }
    };

    // --- NUEVA FUNCIÓN PARA EDITAR ---
    const actualizarCita = async (id: string, cita: Cita) => {
        try {
            // Asegúrate de tener el endpoint update en apiService (usando PUT)
            // Si no tienes el método en apiService, agrégalo: update: (id, data) => axios.put(...)
            await CitaService.delete(id); // Truco rápido: Borramos y creamos de nuevo si no tienes PUT hecho
            await CitaService.create(cita); 
            // O SI TIENES PUT: await CitaService.update(id, cita);
            
            await cargarCitas();
            return true;
        } catch (error) {
            alert("Error al actualizar.");
            return false;
        }
    };

    const cancelarCita = async (id: string) => {
        if (!confirm("¿Eliminar este turno?")) return;
        try {
            await CitaService.delete(id);
            await cargarCitas();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarCitas();
    }, [cargarCitas]);

    return { citas, loading, agendarCita, actualizarCita, cancelarCita };
};