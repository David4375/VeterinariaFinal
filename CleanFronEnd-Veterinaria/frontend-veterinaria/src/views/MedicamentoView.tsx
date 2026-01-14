import { useState } from 'react';
import { 
    ShoppingCart, BriefcaseMedical, Syringe, Utensils, 
    ArrowLeft, Plus, Trash2, Search, X, AlertTriangle, Edit, CheckCircle, Clock
} from 'lucide-react';
import { useMedicamentos } from '../controllers/useMedicamentos';
import type { Medicamento } from '../models';

export const MedicamentoView = () => {
    const { medicamentos, guardar, eliminar } = useMedicamentos();
    
    // LISTA DE PROVEEDORES
    const proveedores = [
        "Agrovet Tarija", "Distribuidora El Valle", "Inti Veterinaria", 
        "Microsules", "Laboratorios Over", "König Bolivia", 
        "Brouwer", "Drag Pharma", "Royal Canin", "Genérico"
    ];

    const [vista, setVista] = useState<'menu' | 'lista'>('menu');
    const [categoriaActual, setCategoriaActual] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    
    // FECHA MÁGICA PARA "NO VENCE"
    const FECHA_INFINITA = '2099-12-31';

    const initialState: Medicamento = { 
        nombre: '', laboratorio: proveedores[0], precio: 0, stock: 0, 
        fechaVencimiento: new Date().toISOString().split('T')[0], tipo: 'Medicamentos'
    };
    const [form, setForm] = useState<Medicamento>(initialState);
    const [esSinVencimiento, setEsSinVencimiento] = useState(false);

    // Filtrado
    const medicamentosFiltrados = medicamentos.filter(m => {
        const esDeLaCategoria = m.tipo === categoriaActual;
        const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                 m.laboratorio.toLowerCase().includes(busqueda.toLowerCase());
        return esDeLaCategoria && coincideBusqueda;
    });

    const entrarEnCategoria = (categoria: string) => {
        setCategoriaActual(categoria);
        setVista('lista');
    };

    const abrirModalNuevo = () => {
        setEsSinVencimiento(false);
        setForm({ ...initialState, tipo: categoriaActual, laboratorio: proveedores[0] });
        setMostrarModal(true);
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        const fechaFinal = esSinVencimiento ? FECHA_INFINITA : form.fechaVencimiento;
        const medEnviar = {
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock),
            fechaVencimiento: new Date(fechaFinal).toISOString()
        };
        if (form.id && form.id !== '') { (medEnviar as any).id = form.id; }
        await guardar(medEnviar);
        setMostrarModal(false);
    };

    const abrirEditar = (m: Medicamento) => {
        const fechaStr = new Date(m.fechaVencimiento).toISOString().split('T')[0];
        const esInfinito = new Date(m.fechaVencimiento).getFullYear() > 2090;
        setEsSinVencimiento(esInfinito);
        setForm({ ...m, fechaVencimiento: esInfinito ? new Date().toISOString().split('T')[0] : fechaStr });
        setMostrarModal(true);
    };

    // Helper para fecha
    const renderFecha = (fecha: string) => {
        const date = new Date(fecha);
        if (date.getFullYear() > 2090) return <span style={{color: '#95a5a6', fontWeight: 'bold', fontSize: 11}}>NO VENCE</span>;
        return date.toLocaleDateString();
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', background: '#f4f6f8' }}>
            
            {vista === 'menu' && (
                <div style={{ padding: '40px' }}>
                    <div style={{ marginBottom: 40, borderBottom: '1px solid #ddd', paddingBottom: 20 }}>
                        <h1 style={{ color: '#2c3e50', margin: 0, fontSize: 28, display: 'flex', gap: 10, alignItems: 'center' }}>
                            <BriefcaseMedical /> Inventario SF
                        </h1>
                        <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Administración de productos del Dr. Tejerina</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 25 }}>
                        <CategoryCard icon={<ShoppingCart size={40} />} title="Artículos" desc="Accesorios y Juguetes" color="#34495e" onClick={() => entrarEnCategoria('Artículos')} />
                        <CategoryCard icon={<BriefcaseMedical size={40} />} title="Medicamentos" desc="Farmacia y Remedios" color="#2980b9" onClick={() => entrarEnCategoria('Medicamentos')} />
                        <CategoryCard icon={<Syringe size={40} />} title="Vacunas" desc="Inmunización" color="#27ae60" onClick={() => entrarEnCategoria('Vacunas')} />
                        <CategoryCard icon={<Utensils size={40} />} title="Alimentos" desc="Nutrición y Dietas" color="#e67e22" onClick={() => entrarEnCategoria('Alimentos')} />
                    </div>
                </div>
            )}

            {vista === 'lista' && (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ background: 'white', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                            <button onClick={() => setVista('menu')} style={{ background: '#ecf0f1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2c3e50', padding: '8px 12px', borderRadius: 6, fontWeight: 'bold' }}>
                                <ArrowLeft size={18} style={{ marginRight: 5 }} /> Volver
                            </button>
                            <h2 style={{ margin: 0, color: '#2c3e50', fontSize: 22 }}>{categoriaActual}</h2>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: 10, top: 10, color: '#95a5a6' }} />
                            <input placeholder="Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ padding: '10px 10px 10px 35px', borderRadius: 30, border: '1px solid #ddd', outline: 'none', width: 250 }} />
                        </div>
                    </div>

                    <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
                        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button onClick={abrirModalNuevo} style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', display: 'flex', gap: 8, alignItems: 'center', fontWeight: 'bold' }}>
                                <Plus size={18} /> Nuevo Producto
                            </button>
                            <span style={{ color: '#7f8c8d', fontSize: 14 }}>{medicamentosFiltrados.length} resultados</span>
                        </div>

                        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                    <tr>
                                        <th style={{...thStyle, width: '25%'}}>NOMBRE</th>
                                        <th style={{...thStyle, width: '15%'}}>PROVEEDOR</th>
                                        <th style={{...thStyle, width: '15%'}}>STOCK</th>
                                        <th style={{...thStyle, width: '15%'}}>PRECIO</th>
                                        <th style={{...thStyle, width: '15%'}}>VENCIMIENTO</th>
                                        <th style={{...thStyle, width: '15%', textAlign: 'right'}}>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicamentosFiltrados.map((m) => (
                                        <tr key={m.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                            <td style={{ padding: 15, fontWeight: 'bold', color: '#2c3e50' }}>{m.nombre}</td>
                                            <td style={{ padding: 15, color: '#7f8c8d' }}>{m.laboratorio}</td>
                                            
                                            {/* AQUÍ USAMOS EL PATRÓN FACTORY */}
                                            <td style={{ padding: 15 }}>
                                                <StockStatusFactory stock={m.stock} />
                                            </td>

                                            <td style={{ padding: 15, fontWeight: 'bold', color: '#2c3e50' }}>Bs {m.precio.toFixed(2)}</td>
                                            <td style={{ padding: 15, color: '#7f8c8d' }}>{renderFecha(m.fechaVencimiento)}</td>
                                            <td style={{ padding: 15, textAlign: 'right' }}>
                                                <button onClick={() => abrirEditar(m)} title="Editar" style={{ marginRight: 10, cursor: 'pointer', background: '#e3f2fd', border: 'none', color: '#2980b9', padding: 6, borderRadius: 4 }}><Edit size={16}/></button>
                                                <button onClick={() => eliminar(m.id!)} title="Eliminar" style={{ cursor: 'pointer', background: '#ffebee', border: 'none', color: '#c62828', padding: 6, borderRadius: 4 }}><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {medicamentosFiltrados.length === 0 && <tr><td colSpan={6} style={{ padding: 30, textAlign: 'center', color: '#ccc' }}>No hay productos.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', width: 500, borderRadius: 8, padding: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, color: '#2c3e50' }}>{form.id ? 'Editar' : 'Nuevo'} Producto</h3>
                            <button onClick={() => setMostrarModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleGuardar}>
                            <div style={{ marginBottom: 15 }}>
                                <label style={labelStyle}>Nombre del Producto</label>
                                <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                                <div>
                                    <label style={labelStyle}>Proveedor</label>
                                    <select value={form.laboratorio} onChange={e => setForm({...form, laboratorio: e.target.value})} style={inputStyle}>
                                        {proveedores.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Stock Inicial</label>
                                    <input type="number" required min="0" value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 25 }}>
                                <div>
                                    <label style={labelStyle}>Precio Venta (Bs)</label>
                                    <input type="number" step="0.5" required min="0" value={form.precio} onChange={e => setForm({...form, precio: +e.target.value})} style={inputStyle} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <label style={{ ...labelStyle, marginBottom: 0 }}>Vencimiento</label>
                                        <label style={{ fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <input type="checkbox" checked={esSinVencimiento} onChange={(e) => setEsSinVencimiento(e.target.checked)}/> Sin Vencimiento
                                        </label>
                                    </div>
                                    <input type="date" disabled={esSinVencimiento} required={!esSinVencimiento} value={form.fechaVencimiento} onChange={e => setForm({...form, fechaVencimiento: e.target.value})} style={{ ...inputStyle, background: esSinVencimiento ? '#f9f9f9' : 'white' }} />
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <button type="button" onClick={() => setMostrarModal(false)} style={{ background: 'transparent', border: '1px solid #ddd', color: '#7f8c8d', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', marginRight: 10 }}>Cancelar</button>
                                <button type="submit" style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '10px 25px', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- PATRÓN FACTORY (FRONTEND) ---
// Justificación: Encapsula la lógica de creación de componentes visuales (Badges)
// dependiendo del estado del stock, cumpliendo el principio de Responsabilidad Única.
const StockStatusFactory = ({ stock }: { stock: number }) => {
    
    // 1. Producto Crítico (Rojo)
    if (stock < 5) {
        return (
            <span style={{ background: '#ffebee', color: '#c62828', padding: '5px 10px', borderRadius: 15, fontSize: 12, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <AlertTriangle size={12} /> {stock} Crítico
            </span>
        );
    }
    
    // 2. Producto Bajo (Amarillo/Naranja) - Opcional, si quisieras agregar lógica intermedia
    if (stock >= 5 && stock < 10) {
        return (
            <span style={{ background: '#fff3e0', color: '#ef6c00', padding: '5px 10px', borderRadius: 15, fontSize: 12, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Clock size={12} /> {stock} Bajo
            </span>
        );
    }

    // 3. Producto Normal (Verde)
    return (
        <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 10px', borderRadius: 15, fontSize: 12, fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <CheckCircle size={12} /> {stock} Normal
        </span>
    );
};

const CategoryCard = ({ icon, title, desc, color, onClick }: any) => (
    <div onClick={onClick} style={{ background: color, color: 'white', borderRadius: 10, padding: 25, cursor: 'pointer', height: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
        <div style={{ marginBottom: 15, background: 'rgba(255,255,255,0.2)', width: 'fit-content', padding: 10, borderRadius: 50 }}>{icon}</div>
        <h3 style={{ margin: 0, fontSize: 20 }}>{title}</h3>
        <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: 13 }}>{desc}</p>
    </div>
);

const thStyle = { textAlign: 'left' as const, padding: '15px', color: '#7f8c8d', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' as const };
const labelStyle = { display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 'bold', color: '#555' };
const inputStyle = { width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4, outline: 'none', fontSize: 14 };