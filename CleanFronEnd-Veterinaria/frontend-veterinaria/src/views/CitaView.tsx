import { useState } from 'react';
import { 
    Calendar as CalendarIcon, Clock, X, Trash2, Edit2, Search 
} from 'lucide-react';
import { useCitas } from '../controllers/useCitas';
import { useMascotas } from '../controllers/useMascotas';
import type { Cita, Mascota } from '../models';

export const CitaView = () => {
    const { citas, agendarCita, actualizarCita, cancelarCita } = useCitas();
    const { mascotas } = useMascotas();

    // Filtros y Estados
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const [mostrarModal, setMostrarModal] = useState(false);
    
    // Estado para EDICIÓN
    const [citaEditandoId, setCitaEditandoId] = useState<string | null>(null);

    // Estado Buscador Mascota (Modal)
    const [busquedaMascota, setBusquedaMascota] = useState('');
    const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);

    // Formulario
    const initialForm: Cita = { 
        mascotaId: '', 
        fechaHora: `${fechaSeleccionada}T09:00`, 
        motivo: '', 
        estado: 'Programada' 
    };
    const [form, setForm] = useState<Cita>(initialForm);

    // --- LÓGICA DE FILTRADO Y ORDEN ---
    const citasDelDia = citas.filter(c => c.fechaHora.split('T')[0] === fechaSeleccionada);
    citasDelDia.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

    // Helpers
    const getNombreMascota = (id: string) => mascotas.find(m => m.id === id)?.nombre || 'Paciente';
    
    // Genera texto tipo "Hace 1 hora" o "En 7 mins"
    const getTextoTiempo = (fecha: string) => {
        const diff = new Date(fecha).getTime() - new Date().getTime();
        const mins = Math.floor(diff / 60000);
        const horas = Math.floor(Math.abs(mins) / 60);

        if (mins < 0) {
            // Pasado
            if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
            return `Hace ${Math.abs(mins)} mins`;
        } else {
            // Futuro
            if (horas > 0) return `En ${horas} hora${horas > 1 ? 's' : ''}`;
            return `En ${mins} mins`;
        }
    };

    const getColorTiempo = (fecha: string) => {
        const diff = new Date(fecha).getTime() - new Date().getTime();
        return diff < 0 ? '#95a5a6' : '#1abc9c'; // Gris si pasó, Verde si falta
    };

    // --- MANEJADORES ---

    const abrirModalNuevo = () => {
        setCitaEditandoId(null); // Modo crear
        setMascotaSeleccionada(null);
        setForm({ ...initialForm, fechaHora: `${fechaSeleccionada}T09:00` });
        setMostrarModal(true);
    };

    const abrirModalEditar = (cita: Cita) => {
        setCitaEditandoId(cita.id!); // Modo editar
        const mascota = mascotas.find(m => m.id === cita.mascotaId) || null;
        setMascotaSeleccionada(mascota);
        setForm({
            mascotaId: cita.mascotaId,
            fechaHora: cita.fechaHora,
            motivo: cita.motivo,
            estado: cita.estado
        });
        setMostrarModal(true);
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.mascotaId) { alert("Seleccione un paciente"); return; }
        
        let exito = false;
        if (citaEditandoId) {
            // Editar
            exito = await actualizarCita(citaEditandoId, form);
        } else {
            // Crear
            exito = await agendarCita(form);
        }

        if (exito) {
            setMostrarModal(false);
            setForm(initialForm);
        }
    };

    const sugerenciasMascotas = busquedaMascota.length > 0 
        ? mascotas.filter(m => m.nombre.toLowerCase().includes(busquedaMascota.toLowerCase()))
        : [];

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', background: '#f4f6f8' }}>
            
            {/* HEADER CON FILTRO FECHA */}
            <div style={{ background: 'white', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
                    <div style={{ background: 'white', border: '1px solid #ddd', padding: '8px 10px', display: 'flex', alignItems: 'center', borderRadius: 4 }}>
                        <CalendarIcon size={16} color="#7f8c8d" />
                        <input 
                            type="date" 
                            value={fechaSeleccionada} 
                            onChange={(e) => setFechaSeleccionada(e.target.value)} 
                            style={{ border: 'none', outline: 'none', color: '#555', marginLeft: 10, fontFamily: 'inherit' }} 
                        />
                    </div>
                </div>

                <button 
                    onClick={abrirModalNuevo}
                    style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Agendar Cita
                </button>
            </div>

            {/* PESTAÑAS VISUALES (Solo decorativo para igualar imagen) */}
            <div style={{ padding: '0 30px', background: '#f4f6f8', borderBottom: '1px solid #e0e0e0', marginTop: 20 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ background: 'white', padding: '10px 20px', borderTopLeftRadius: 4, borderTopRightRadius: 4, fontWeight: 'bold', color: '#555', boxShadow: '0 -2px 5px rgba(0,0,0,0.02)' }}>
                        <Clock size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Hoy
                    </div>
                    <div style={{ padding: '10px 20px', color: '#999', cursor: 'pointer' }}>
                        <CalendarIcon size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} /> Calendario
                    </div>
                </div>
            </div>

            {/* LISTA DE CITAS (ESTILO IMAGEN image_34d2e7.png) */}
            <div style={{ padding: '20px 30px', flex: 1 }}>
                
                {citasDelDia.length === 0 ? (
                    <div style={{ background: 'white', padding: 40, textAlign: 'center', color: '#999', borderRadius: 4 }}>
                        No hay turnos para esta fecha.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {citasDelDia.map(cita => (
                            <div key={cita.id} style={{ 
                                background: 'white', 
                                padding: '20px', 
                                display: 'flex', 
                                alignItems: 'center', // Alineación vertical
                                borderRadius: 4, 
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
                            }}>
                                
                                {/* COLUMNA 1: HORA (Izquierda) */}
                                <div style={{ minWidth: 100, borderRight: '1px solid #eee', marginRight: 20, textAlign: 'right', paddingRight: 20 }}>
                                    <div style={{ fontSize: 18, color: '#555', fontWeight: '600' }}>
                                        {new Date(cita.fechaHora).getHours()}:{new Date(cita.fechaHora).getMinutes().toString().padStart(2, '0')} <span style={{ fontSize: 12, fontWeight: 'normal' }}>hs</span>
                                    </div>
                                    <div style={{ color: getColorTiempo(cita.fechaHora), fontSize: 12, marginTop: 4 }}>
                                        {getTextoTiempo(cita.fechaHora)}
                                    </div>
                                </div>

                                {/* COLUMNA 2: DETALLES (Centro) */}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: 16, fontWeight: 'bold' }}>
                                        {cita.motivo}
                                    </h4>
                                    <p style={{ margin: 0, color: '#7f8c8d', fontSize: 14 }}>
                                        {getNombreMascota(cita.mascotaId)}
                                    </p>
                                </div>

                                {/* COLUMNA 3: ACCIONES (Derecha) */}
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button 
                                        onClick={() => cancelarCita(cita.id!)}
                                        title="Eliminar"
                                        style={{ 
                                            background: '#ff6b6b', color: 'white', border: 'none', 
                                            width: 35, height: 35, borderRadius: 4, 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => abrirModalEditar(cita)}
                                        title="Editar"
                                        style={{ 
                                            background: '#2c3e50', color: 'white', border: 'none', 
                                            width: 35, height: 35, borderRadius: 4, 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL (CREAR / EDITAR) */}
            {mostrarModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
                    <div style={{ background: 'white', width: 450, padding: 25, borderRadius: 5, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <h3 style={{ margin: 0, color: '#2c3e50' }}>{citaEditandoId ? 'Editar Cita' : 'Agendar Nueva Cita'}</h3>
                            <button onClick={() => setMostrarModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleGuardar}>
                            
                            {/* BUSCADOR DE MASCOTAS */}
                            <div style={{ marginBottom: 15, position: 'relative' }}>
                                <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 'bold', color: '#7f8c8d' }}>Paciente</label>
                                {mascotaSeleccionada ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: '#e3f2fd', borderRadius: 4, border: '1px solid #90caf9' }}>
                                        <span style={{ fontWeight: 'bold', color: '#1565c0' }}>{mascotaSeleccionada.nombre}</span>
                                        <button type="button" onClick={() => { setMascotaSeleccionada(null); setForm({...form, mascotaId: ''})}} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#d32f2f', fontSize: 12 }}>Cambiar</button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 4, padding: '0 10px' }}>
                                            <Search size={16} color="#ccc" />
                                            <input placeholder="Buscar mascota..." value={busquedaMascota} onChange={e => setBusquedaMascota(e.target.value)} style={{ border: 'none', padding: 10, width: '100%', outline: 'none' }} />
                                        </div>
                                        {sugerenciasMascotas.length > 0 && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #ddd', zIndex: 10, maxHeight: 150, overflowY: 'auto' }}>
                                                {sugerenciasMascotas.map(m => (
                                                    <div key={m.id} onClick={() => { setMascotaSeleccionada(m); setForm({...form, mascotaId: m.id!}); setBusquedaMascota(''); }} style={{ padding: 10, cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                                        <strong>{m.nombre}</strong>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 'bold', color: '#7f8c8d' }}>Fecha y Hora</label>
                                    <input type="datetime-local" required value={form.fechaHora} onChange={e => setForm({...form, fechaHora: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 'bold', color: '#7f8c8d' }}>Motivo</label>
                                    <input required value={form.motivo} onChange={e => setForm({...form, motivo: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }} />
                                </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <button type="submit" style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '10px 25px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
                                    {citaEditandoId ? 'Guardar Cambios' : 'Agendar Cita'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};