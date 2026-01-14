import { useState, useEffect } from 'react';
import { 
    ShoppingCart, Plus, Search, Calendar, DollarSign, X, Trash2, FileText, Printer, ScanLine 
} from 'lucide-react';
import { VentaService, MedicamentoService } from '../services/apiService';
import type { VentaResponse, Medicamento, DetalleVenta } from '../models';

export const VentaView = () => {
    // Estados
    const [ventas, setVentas] = useState<VentaResponse[]>([]);
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    // Estado para Nueva Venta
    const [carrito, setCarrito] = useState<DetalleVenta[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [metodoPago, setMetodoPago] = useState('Efectivo');

    // ESTADO PARA LA FACTURA (LO NUEVO)
    const [mostrarFactura, setMostrarFactura] = useState(false);
    const [ventaParaFactura, setVentaParaFactura] = useState<VentaResponse | null>(null);

    // Cargar datos
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const resVentas = await VentaService.getHistorial();
            setVentas(resVentas.data);
            const resMeds = await MedicamentoService.getAll();
            setMedicamentos(resMeds.data);
        } catch (error) {
            console.error("Error cargando datos", error);
        }
    };

    // --- LÓGICA DEL CARRITO ---
    const agregarAlCarrito = () => {
        const producto = medicamentos.find(m => m.id === productoSeleccionado);
        if (!producto) return;

        if (producto.stock < cantidad) {
            alert(`Stock insuficiente. Solo quedan ${producto.stock}`);
            return;
        }

        const nuevoItem: DetalleVenta = {
            medicamentoId: producto.id!,
            nombreProducto: producto.nombre,
            cantidad: cantidad,
            precioUnitario: producto.precio,
            subtotal: producto.precio * cantidad
        };

        setCarrito([...carrito, nuevoItem]);
        setProductoSeleccionado('');
        setCantidad(1);
    };

    const eliminarDelCarrito = (index: number) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito.splice(index, 1);
        setCarrito(nuevoCarrito);
    };

    const finalizarVenta = async () => {
        if (carrito.length === 0) return;
        try {
            const ventaData = {
                metodoPago,
                productos: carrito.map(item => ({
                    medicamentoId: item.medicamentoId,
                    cantidad: item.cantidad
                }))
            };
            await VentaService.registrar(ventaData);
            alert("¡Venta registrada con éxito!");
            
            // LIMPIEZA
            setMostrarModal(false);
            setCarrito([]);
            await cargarDatos(); 
            
            // OPCIONAL: Abrir factura automáticamente de la última venta (podrías implementarlo aquí)
            
        } catch (error) {
            alert("Error al registrar la venta");
        }
    };

    // --- LÓGICA FACTURA ---
    const abrirFactura = (venta: VentaResponse) => {
        setVentaParaFactura(venta);
        setMostrarFactura(true);
    };

    const imprimirFactura = () => {
        window.print(); // Abre el diálogo de impresión del navegador
    };

    const totalCarrito = carrito.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const ventasFiltradas = ventas.filter(v => v.id.includes(busqueda));

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', background: '#f4f6f8' }}>
            
            {/* HEADER */}
            <div style={{ padding: '20px 40px', background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#2c3e50', display: 'flex', gap: 10, alignItems: 'center' }}>
                        <ShoppingCart size={24} /> Ventas y Caja
                    </h2>
                    <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: 14 }}>Gestiona las transacciones del día</p>
                </div>
                
                <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                        placeholder="Buscar por ID..." 
                        value={busqueda} 
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ padding: '10px 15px', border: '1px solid #ddd', borderRadius: 6, outline: 'none', width: 250 }}
                    />
                    <button 
                        onClick={() => setMostrarModal(true)}
                        style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 'bold' }}
                    >
                        <Plus size={18} /> Nueva Venta
                    </button>
                </div>
            </div>

            {/* TABLA HISTORIAL */}
            <div style={{ padding: '30px 40px', flex: 1 }}>
                <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                            <tr>
                                <th style={thStyle}>ID Venta</th>
                                <th style={thStyle}>Fecha</th>
                                <th style={thStyle}>Método Pago</th>
                                <th style={thStyle}>Total (Bs)</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasFiltradas.map((v) => (
                                <tr key={v.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: 20, color: '#7f8c8d', fontSize: 13 }}>{v.id.substring(0, 8)}...</td>
                                    <td style={{ padding: 20 }}>{new Date(v.fecha).toLocaleString()}</td>
                                    <td style={{ padding: 20 }}>
                                        <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: 15, fontSize: 12, fontWeight: 'bold' }}>
                                            {v.metodoPago}
                                        </span>
                                    </td>
                                    <td style={{ padding: 20, fontWeight: 'bold', color: '#27ae60' }}>Bs {v.total.toFixed(2)}</td>
                                    <td style={{ padding: 20 }}>
                                        <button 
                                            onClick={() => abrirFactura(v)}
                                            style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', display: 'flex', gap: 5, alignItems: 'center', fontSize: 12 }}
                                        >
                                            <FileText size={14} /> Ver Recibo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ventasFiltradas.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#999' }}>No hay ventas registradas.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: NUEVA VENTA */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 998 }}>
                    <div style={{ background: 'white', width: 800, height: 600, borderRadius: 10, display: 'flex', overflow: 'hidden' }}>
                        {/* IZQUIERDA: SELECCIÓN */}
                        <div style={{ flex: 1, padding: 30, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Seleccionar Productos</h3>
                            
                            <div style={{ marginBottom: 15 }}>
                                <label style={labelStyle}>Producto</label>
                                <select value={productoSeleccionado} onChange={e => setProductoSeleccionado(e.target.value)} style={inputStyle}>
                                    <option value="">-- Seleccione --</option>
                                    {medicamentos.map(m => (
                                        <option key={m.id} value={m.id} disabled={m.stock === 0}>
                                            {m.nombre} (Stock: {m.stock}) - Bs {m.precio}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: 20 }}>
                                <label style={labelStyle}>Cantidad</label>
                                <input type="number" min="1" value={cantidad} onChange={e => setCantidad(+e.target.value)} style={inputStyle} />
                            </div>

                            <button onClick={agregarAlCarrito} disabled={!productoSeleccionado} style={{ background: '#3498db', color: 'white', border: 'none', padding: '12px', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                                Agregar al Carrito
                            </button>
                        </div>

                        {/* DERECHA: RESUMEN */}
                        <div style={{ flex: 1, background: '#f8f9fa', padding: 30, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: '#2c3e50' }}>Resumen</h3>
                                <button onClick={() => setMostrarModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X /></button>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', marginTop: 20, background: 'white', borderRadius: 6, border: '1px solid #eee' }}>
                                {carrito.map((item, i) => (
                                    <div key={i} style={{ padding: '10px 15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: 14 }}>{item.nombreProducto}</div>
                                            <div style={{ fontSize: 12, color: '#7f8c8d' }}>{item.cantidad} x Bs {item.precioUnitario}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontWeight: 'bold' }}>Bs {item.subtotal?.toFixed(2)}</span>
                                            <button onClick={() => eliminarDelCarrito(i)} style={{ color: '#e74c3c', background: 'transparent', border: 'none', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 18, fontWeight: 'bold' }}>
                                    <span>Total a Pagar:</span>
                                    <span style={{ color: '#27ae60' }}>Bs {totalCarrito.toFixed(2)}</span>
                                </div>
                                <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={{ ...inputStyle, marginBottom: 15 }}>
                                    <option>Efectivo</option><option>QR / Transferencia</option><option>Tarjeta</option>
                                </select>
                                <button onClick={finalizarVenta} disabled={carrito.length === 0} style={{ width: '100%', background: '#2c3e50', color: 'white', border: 'none', padding: '15px', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}>
                                    Confirmar Venta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: FACTURA / RECIBO (EL QUE QUERÍAS) */}
            {mostrarFactura && ventaParaFactura && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', width: 400, padding: 0, borderRadius: 5, overflow: 'hidden', boxShadow: '0 5px 25px rgba(0,0,0,0.2)' }}>
                        {/* Header Factura */}
                        <div style={{ background: '#2c3e50', color: 'white', padding: 20, textAlign: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: 22 }}>VETERINARIA SF</h2>
                            <p style={{ margin: '5px 0 0', fontSize: 12, opacity: 0.8 }}>Dr. David Tejerina</p>
                            <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>NIT: 123456789 • Tarija, Bolivia</p>
                        </div>
                        
                        {/* Cuerpo Factura */}
                        <div style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                                <span><b>Nro:</b> {ventaParaFactura.id.substring(0, 8)}</span>
                                <span>{new Date(ventaParaFactura.fecha).toLocaleDateString()}</span>
                            </div>

                            <table style={{ width: '100%', fontSize: 13, marginBottom: 20 }}>
                                <thead>
                                    <tr style={{ color: '#7f8c8d', textAlign: 'left' }}>
                                        <th style={{ paddingBottom: 5 }}>Cant.</th>
                                        <th style={{ paddingBottom: 5 }}>Producto</th>
                                        <th style={{ paddingBottom: 5, textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventaParaFactura.detalles?.map((d, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: '5px 0' }}>{d.cantidad}</td>
                                            <td style={{ padding: '5px 0' }}>{d.nombreProducto}</td>
                                            <td style={{ padding: '5px 0', textAlign: 'right' }}>{d.subtotal?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div style={{ borderTop: '2px dashed #ddd', paddingTop: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 16, fontWeight: 'bold' }}>TOTAL A PAGAR</span>
                                <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2c3e50' }}>Bs {ventaParaFactura.total.toFixed(2)}</span>
                            </div>
                            
                            <div style={{ marginTop: 20, textAlign: 'center', color: '#7f8c8d', fontSize: 12 }}>
                                <p>Forma de Pago: {ventaParaFactura.metodoPago}</p>
                                <div style={{ background: '#f8f9fa', padding: 10, display: 'inline-block', margin: '10px 0' }}>
                                    <ScanLine size={40} color="#2c3e50" />
                                </div>
                                <p>¡Gracias por su preferencia!</p>
                            </div>
                        </div>

                        {/* Footer Botones */}
                        <div style={{ background: '#f1f2f6', padding: 15, display: 'flex', gap: 10 }}>
                            <button onClick={() => setMostrarFactura(false)} style={{ flex: 1, padding: 10, border: 'none', background: 'white', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>Cerrar</button>
                            <button onClick={imprimirFactura} style={{ flex: 1, padding: 10, border: 'none', background: '#2c3e50', color: 'white', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                <Printer size={16} /> Imprimir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const thStyle = { padding: '15px', textAlign: 'left' as const, color: '#7f8c8d', fontSize: 13, borderBottom: '2px solid #eee' };
const labelStyle = { display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 'bold', color: '#7f8c8d' };
const inputStyle = { width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, outline: 'none' };
