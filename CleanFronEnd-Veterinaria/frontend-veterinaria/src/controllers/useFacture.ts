import { useState, useEffect, useCallback } from 'react';
import type { Factura } from '../models';
import { FacturaService } from '../services/apiService';

export const useFacturas = () => {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar historial
    const cargarHistorial = useCallback(async () => {
        try {
            const res = await FacturaService.getHistorial();
            setFacturas(res.data);
        } catch (error) {
            console.error("Error al cargar facturas", error);
        }
    }, []);

    // Emitir nueva factura
    const emitirFactura = async (ventaId: string, nombre: string, nit: string) => {
        if (!nombre || !nit) {
            alert("Por favor ingrese Nombre y NIT del cliente");
            return false;
        }
        
        setLoading(true);
        try {
            await FacturaService.emitir({ 
                ventaId, 
                clienteNombre: nombre, 
                clienteNit: nit 
            });
            alert("✅ Factura generada correctamente");
            await cargarHistorial(); // Actualizamos la lista
            return true;
        } catch (error: any) {
            console.error(error);
            alert("Error: " + (error.response?.data?.error || "No se pudo facturar. Verifica si ya existe factura para esta venta."));
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    return { facturas, emitirFactura, recargar: cargarHistorial, loading };
};