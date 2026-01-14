import { useState, useEffect, useCallback } from 'react';
import type { RegistrarVenta, DetalleVenta } from '../models';
import { VentaService } from '../services/apiService';

// Definimos la interfaz exacta de lo que devuelve tu Backend
export interface VentaHistorial {
    id: string;
    fecha: string;
    total: number;
    detalles?: { nombreProducto: string; cantidad: number }[]; // Tu backend guarda esto
}

export const useVentas = () => {
    // ESTADO INICIAL VACÍO (Array vacío real)
    const [historial, setHistorial] = useState<VentaHistorial[]>([]);
    const [loading, setLoading] = useState(false);
    const [carrito, setCarrito] = useState<DetalleVenta[]>([]);

    // Cargar solo datos reales del servidor
    const cargarHistorial = useCallback(async () => {
        setLoading(true);
        try {
            const res = await VentaService.getHistorial();
            // Si el backend no devuelve nada, nos aseguramos que sea un array vacío
            setHistorial(res.data || []);
        } catch (error) {
            console.error("No hay ventas aún o error de conexión", error);
            setHistorial([]); // En caso de error, mostramos vacío
        }
        setLoading(false);
    }, []);

    const agregarAlCarrito = (idMed: string, cantidad: number) => {
        setCarrito([...carrito, { medicamentoId: idMed, cantidad }]);
    };

    const realizarVenta = async (metodoPago: string) => {
        if (carrito.length === 0) return null;
        try {
            const venta: RegistrarVenta = { metodoPago, productos: carrito };
            const res = await VentaService.registrar(venta);
            
            // Éxito: Limpiamos y recargamos la tabla
            setCarrito([]); 
            await cargarHistorial(); 
            return res.data.ventaId;
        } catch (error) {
            alert("Error al registrar venta. Revisa el stock.");
            return null;
        }
    };

    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    return { 
        historial, loading, recargar: cargarHistorial,
        carrito, agregarAlCarrito, realizarVenta, vaciar: () => setCarrito([]) 
    };
};