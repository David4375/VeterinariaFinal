import { useState, useEffect, useCallback } from 'react';
import { ClienteService } from '../services/apiService';
import type { Cliente, RegistroCompletoDTO } from '../models'; // Usamos type

export const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarClientes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await ClienteService.getAll();
            // Asignamos la respuesta a la variable de estado
            setClientes(res.data);
            console.log("Clientes cargados:", res.data); // Para depurar
        } catch (error) {
            console.error("Error cargando clientes", error);
        }
        setLoading(false);
    }, []);

    const registrarClienteMascota = async (datos: RegistroCompletoDTO) => {
        try {
            await ClienteService.registrarCompleto(datos);
            await cargarClientes(); // <--- ESTO ES CLAVE: Recargar lista tras guardar
            return true;
        } catch (error) {
            console.error(error);
            alert("Error al registrar. Verifica los datos.");
            return false;
        }
    };

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    return { clientes, loading, registrarClienteMascota };
};