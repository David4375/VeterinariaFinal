import { useState, useEffect } from 'react';
import type { Mascota } from '../models/index';
import { MascotaService } from '../services/apiService';

export const useMascotas = () => {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [loading, setLoading] = useState(false);

    const cargarMascotas = async () => {
        setLoading(true);
        try {
            const res = await MascotaService.getAll();
            setMascotas(res.data);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const guardar = async (mascota: Mascota) => {
        if (mascota.id) await MascotaService.update(mascota.id, mascota);
        else await MascotaService.create(mascota);
        await cargarMascotas();
    };

    const eliminar = async (id: string) => {
        if(!confirm("¿Borrar mascota?")) return;
        await MascotaService.delete(id);
        await cargarMascotas();
    };

    useEffect(() => { cargarMascotas(); }, []);

    return { mascotas, loading, guardar, eliminar };
};