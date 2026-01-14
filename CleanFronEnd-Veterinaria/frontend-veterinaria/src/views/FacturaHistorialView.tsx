import { useState, useEffect } from 'react';
import { 
    FileText, Search, Printer, Eye, Download, FileCheck 
} from 'lucide-react';
import { VentaService } from '../services/apiService'; // Usamos el servicio de Ventas
import type { VentaResponse } from '../models';

export const FacturaHistorialView = () => {
    const [facturas, setFacturas] = useState<VentaResponse[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(false);

    // Cargar las Ventas como si fueran Facturas
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // TRUCO: Leemos las ventas para mostrarlas como facturas
            const res = await VentaService.getHistorial();
            setFacturas(res.data);
        } catch (error) {
            console.error("Error al cargar facturas", error);
        }
        setLoading(false);
    };

    const facturasFiltradas = facturas.filter(f => 
        f.id.toLowerCase().includes(busqueda.toLowerCase())
    );

    const imprimirFactura = (id: string) => {
        // Simulación de impresión
        const confirmacion = window.confirm(`¿Desea imprimir la factura ${id.substring(0,8)}?`);
        if(confirmacion) window.print();
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', background: '#f4f6f8' }}>
            
            {/* HEADER */}
            <div style={{ padding: '30px 40px', background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#2c3e50', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <FileText size={24} /> Facturación Electrónica
                    </h2>
                    <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: 14 }}>Historial de documentos fiscales emitidos</p>
                </div>
                
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: 10, top: 10, color: '#95a5a6' }} />
                        <input 
                            placeholder="Buscar Nro. Factura..." 
                            value={busqueda} 
                            onChange={e => setBusqueda(e.target.value)}
                            style={{ padding: '10px 10px 10px 35px', borderRadius: 30, border: '1px solid #ddd', outline: 'none', width: 250 }}
                        />
                    </div>
                    <button onClick={cargarDatos} style={{ background: '#ecf0f1', border: 'none', padding: 10, borderRadius: '50%', cursor: 'pointer', color: '#2c3e50' }}>
                        <FileCheck size={20} />
                    </button>
                </div>
            </div>

            {/* TABLA DE FACTURAS */}
            <div style={{ padding: '30px 40px', flex: 1 }}>
                <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#2c3e50', color: 'white' }}>
                            <tr>
                                <th style={thStyle}>NRO. FACTURA</th>
                                <th style={thStyle}>FECHA EMISIÓN</th>
                                <th style={thStyle}>CLIENTE / NIT</th>
                                <th style={thStyle}>ESTADO</th>
                                <th style={thStyle}>IMPORTE (Bs)</th>
                                <th style={{...thStyle, textAlign: 'right'}}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturasFiltradas.map((f, index) => (
                                <tr key={f.id} style={{ borderBottom: '1px solid #eee', background: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
                                    
                                    {/* Usamos el ID de venta como Nro Factura */}
                                    <td style={{ padding: 20, fontWeight: 'bold', color: '#2c3e50' }}>
                                        F-{f.id.substring(0, 8).toUpperCase()}
                                    </td>
                                    
                                    <td style={{ padding: 20, color: '#555' }}>
                                        {new Date(f.fecha).toLocaleString()}
                                    </td>
                                    
                                    <td style={{ padding: 20, color: '#555' }}>
                                        Consumidor Final <br/>
                                        <span style={{ fontSize: 11, color: '#999' }}>NIT: 0</span>
                                    </td>
                                    
                                    <td style={{ padding: 20 }}>
                                        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                            <FileCheck size={12} /> VÁLIDA
                                        </span>
                                    </td>
                                    
                                    <td style={{ padding: 20, fontWeight: 'bold', color: '#2c3e50', fontSize: 15 }}>
                                        Bs {f.total.toFixed(2)}
                                    </td>
                                    
                                    <td style={{ padding: 20, textAlign: 'right' }}>
                                        <button title="Ver Detalle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3498db', marginRight: 10 }}>
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => imprimirFactura(f.id)} title="Imprimir" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2c3e50', marginRight: 10 }}>
                                            <Printer size={18} />
                                        </button>
                                        <button title="Descargar XML" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#27ae60' }}>
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {facturasFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                                        {loading ? 'Cargando facturas...' : 'No hay facturas emitidas.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const thStyle = { padding: '15px', textAlign: 'left' as const, fontSize: 12, fontWeight: 'bold', letterSpacing: '0.5px' };
