import { useState, useEffect, useCallback } from 'react';
import type { Medicamento } from '../models'; // Nota el uso de 'type'
import { MedicamentoService } from '../services/apiService';

export const useMedicamentos = () => {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);

    // 1. Memorizamos la función con useCallback para evitar que cambie en cada render
    const cargar = useCallback(async () => {
        try {
            const res = await MedicamentoService.getAll();
            setMedicamentos(res.data);
        } catch (error) {
            console.error("Error al cargar medicamentos:", error);
        }
    }, []);

    const guardar = async (med: Medicamento) => {
        if (med.id) await MedicamentoService.update(med.id, med);
        else await MedicamentoService.create(med);
        await cargar();
    };

    const eliminar = async (id: string) => {
        if (!confirm("¿Desea eliminar este medicamento?")) return;
        await MedicamentoService.delete(id);
        await cargar();
    };

    // 2. Usamos el efecto solo para el disparo inicial de forma segura
    useEffect(() => {
        // Ejecutamos la función memorizada
        cargar();
    }, [cargar]); 

    return { medicamentos, guardar, eliminar, recargar: cargar };
};