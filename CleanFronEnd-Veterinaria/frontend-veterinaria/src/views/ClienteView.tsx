import { useState } from 'react';
import { Users, Plus, Search, User, Mail, MapPin, Phone, PawPrint, X } from 'lucide-react';
import { useClientes } from '../controllers/useClientes';
import { useMascotas } from '../controllers/useMascotas';
import type { RegistroCompletoDTO, Mascota } from '../models';

export const ClienteView = () => {
    const { clientes, registrarClienteMascota } = useClientes();
    const { guardarMascota } = useMascotas();
    
    // Estados UI
    const [modalNuevoCliente, setModalNuevoCliente] = useState(false);
    const [modalNuevaMascota, setModalNuevaMascota] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
    const [busqueda, setBusqueda] = useState('');

    // Formulario 1: Cliente Nuevo + Mascota
    const initialFormCliente: RegistroCompletoDTO = {
        nombre: '', apellido: '', telefono: '', ubicacion: '', correo: '',
        nombreMascota: '', especie: 'Canino', raza: '', edad: 0, descripcion: ''
    };
    const [formCliente, setFormCliente] = useState(initialFormCliente);

    // Formulario 2: Solo Mascota (para cliente existente)
    const initialFormMascota: Mascota = {
        nombre: '', especie: 'Canino', raza: '', edad: 0, descripcion: '', clienteId: ''
    };
    const [formMascota, setFormMascota] = useState(initialFormMascota);

    // Filtrado Inteligente
    const clientesFiltrados = clientes.filter(c => {
        const nombreFull = `${c.nombre} ${c.apellido}`.toLowerCase();
        const term = busqueda.toLowerCase();
        return nombreFull.includes(term) || c.telefono.includes(term);
    });

    // Guardar Cliente Nuevo
    const handleGuardarCliente = async (e: React.FormEvent) => {
        e.preventDefault();
        const exito = await registrarClienteMascota(formCliente);
        if (exito) {
            setModalNuevoCliente(false);
            setFormCliente(initialFormCliente);
        }
    };

    // Abrir modal para agregar mascota extra
    const abrirModalMascota = (cliente: any) => {
        setClienteSeleccionado(cliente);
        setFormMascota({ ...initialFormMascota, clienteId: cliente.id });
        setModalNuevaMascota(true);
    };

    // Guardar Mascota Extra
    const handleGuardarMascota = async (e: React.FormEvent) => {
        e.preventDefault();
        const exito = await guardarMascota(formMascota);
        if (exito) {
            alert("Mascota agregada correctamente");
            setModalNuevaMascota(false);
            window.location.reload(); // Recarga rápida para ver el contador actualizado
        }
    };

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ padding: '20px 30px', background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#2c3e50', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Users size={24} /> Clientes
                </h2>
                <div style={{ display: 'flex', gap: 10 }}>
                    <input 
                        placeholder="Buscar cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)}
                        style={{ padding: '8px 15px', border: '1px solid #ddd', borderRadius: 4, outline: 'none', width: 250 }}
                    />
                    <button onClick={() => setModalNuevoCliente(true)} style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Plus size={16} /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div style={{ padding: 30, flex: 1 }}>
                <div style={{ background: 'white', borderRadius: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                            <tr>
                                <th style={thStyle}>Nombre Completo</th>
                                <th style={thStyle}>Teléfono</th>
                                <th style={thStyle}>Mascotas</th>
                                <th style={thStyle}>Ubicación</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: 15, fontWeight: 'bold', color: '#2c3e50' }}>
                                        {c.nombreCompleto || `${c.nombre} ${c.apellido}`}
                                    </td>
                                    <td style={{ padding: 15, color: '#7f8c8d' }}>{c.telefono}</td>
                                    <td style={{ padding: 15 }}>
                                        {/* Contador de mascotas */}
                                        <span style={{ background: '#e0f2f1', color: '#00695c', padding: '2px 8px', borderRadius: 10, fontSize: 12, fontWeight: 'bold' }}>
                                            {c.mascotas ? c.mascotas.length : (c.cantidadMascotas || 0)}
                                        </span>
                                    </td>
                                    <td style={{ padding: 15, color: '#7f8c8d' }}>{c.ubicacion}</td>
                                    <td style={{ padding: 15 }}>
                                        <button 
                                            onClick={() => abrirModalMascota(c)}
                                            style={{ background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}
                                        >
                                            <PawPrint size={14} /> + Mascota
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clientesFiltrados.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#ccc' }}>No se encontraron clientes.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: NUEVO CLIENTE (DOBLE) */}
            {modalNuevoCliente && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', width: 900, borderRadius: 8, overflow: 'hidden' }}>
                        <div style={{ background: '#2c3e50', color: 'white', padding: '15px 25px', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>Nuevo Cliente + Mascota</h3>
                            <button onClick={() => setModalNuevoCliente(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleGuardarCliente} style={{ display: 'flex', padding: 20, gap: 20 }}>
                            <div style={{ flex: 1 }}>
                                <h4>Datos Cliente</h4>
                                <input required placeholder="Nombre" value={formCliente.nombre} onChange={e => setFormCliente({...formCliente, nombre: e.target.value})} style={inputStyle} />
                                <input required placeholder="Apellido" value={formCliente.apellido} onChange={e => setFormCliente({...formCliente, apellido: e.target.value})} style={{...inputStyle, marginTop: 10}} />
                                <input required placeholder="Teléfono" value={formCliente.telefono} onChange={e => setFormCliente({...formCliente, telefono: e.target.value})} style={{...inputStyle, marginTop: 10}} />
                                <input required placeholder="Correo" value={formCliente.correo} onChange={e => setFormCliente({...formCliente, correo: e.target.value})} style={{...inputStyle, marginTop: 10}} />
                                <input required placeholder="Ubicación" value={formCliente.ubicacion} onChange={e => setFormCliente({...formCliente, ubicacion: e.target.value})} style={{...inputStyle, marginTop: 10}} />
                            </div>
                            <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: 20 }}>
                                <h4>Mascota Inicial</h4>
                                <input required placeholder="Nombre Mascota" value={formCliente.nombreMascota} onChange={e => setFormCliente({...formCliente, nombreMascota: e.target.value})} style={inputStyle} />
                                <select value={formCliente.especie} onChange={e => setFormCliente({...formCliente, especie: e.target.value})} style={{...inputStyle, marginTop: 10}}>
                                    <option>Canino</option><option>Felino</option><option>Otro</option>
                                </select>
                                <input placeholder="Raza" value={formCliente.raza} onChange={e => setFormCliente({...formCliente, raza: e.target.value})} style={{...inputStyle, marginTop: 10}} />
                                <input type="number" placeholder="Edad" value={formCliente.edad} onChange={e => setFormCliente({...formCliente, edad: +e.target.value})} style={{...inputStyle, marginTop: 10}} />
                                <button type="submit" style={{ marginTop: 20, width: '100%', background: '#2c3e50', color: 'white', padding: 10, border: 'none', borderRadius: 4, cursor: 'pointer' }}>Registrar Todo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: NUEVA MASCOTA EXTRA */}
            {modalNuevaMascota && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', width: 400, borderRadius: 8, padding: 20 }}>
                        <h3 style={{ marginTop: 0 }}>Nueva mascota para {clienteSeleccionado?.nombre}</h3>
                        <form onSubmit={handleGuardarMascota}>
                            <label style={labelStyle}>Nombre</label>
                            <input required value={formMascota.nombre} onChange={e => setFormMascota({...formMascota, nombre: e.target.value})} style={inputStyle} />
                            
                            <label style={labelStyle}>Especie</label>
                            <select value={formMascota.especie} onChange={e => setFormMascota({...formMascota, especie: e.target.value})} style={inputStyle}>
                                <option>Canino</option><option>Felino</option>
                            </select>

                            <label style={labelStyle}>Raza</label>
                            <input value={formMascota.raza} onChange={e => setFormMascota({...formMascota, raza: e.target.value})} style={inputStyle} />

                            <label style={labelStyle}>Edad</label>
                            <input type="number" value={formMascota.edad} onChange={e => setFormMascota({...formMascota, edad: +e.target.value})} style={inputStyle} />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                                <button type="button" onClick={() => setModalNuevaMascota(false)} style={{ background: '#eee', border: 'none', padding: '8px 15px', borderRadius: 4 }}>Cancelar</button>
                                <button type="submit" style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 15px', borderRadius: 4 }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const thStyle = { padding: '15px', textAlign: 'left' as const, color: '#7f8c8d', fontSize: 13, borderBottom: '2px solid #eee' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 4, outline: 'none' };
const labelStyle = { display: 'block', margin: '10px 0 5px', fontSize: 13, fontWeight: 'bold', color: '#555' };