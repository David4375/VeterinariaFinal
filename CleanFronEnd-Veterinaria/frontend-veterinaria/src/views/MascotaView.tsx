import { useState } from 'react';
import { Search, PawPrint, Trash2 } from 'lucide-react';
import { useMascotas } from '../controllers/useMascotas';

export const MascotaView = () => {
    const { mascotas, eliminarMascota } = useMascotas();
    const [busqueda, setBusqueda] = useState('');

    const mascotasFiltradas = mascotas.filter(m => 
        m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (m.dueño && (m.dueño.nombre + m.dueño.apellido).toLowerCase().includes(busqueda.toLowerCase()))
    );

    return (
        <div style={{ width: '100%', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ padding: '20px 30px', background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: '#2c3e50', display: 'flex', gap: 10, alignItems: 'center' }}>
                    <PawPrint size={20} /> Pacientes (Mascotas)
                </h2>
                <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#ccc' }} />
                    <input 
                        placeholder="Buscar por mascota o dueño..." 
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ padding: '8px 10px 8px 35px', width: 300, border: '1px solid #ddd', borderRadius: 4, outline: 'none' }}
                    />
                </div>
            </div>

            <div style={{ padding: 30 }}>
                <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 4 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <th style={thStyle}>Mascota</th>
                                <th style={thStyle}>Especie/Raza</th>
                                <th style={thStyle}>Edad</th>
                                <th style={thStyle}>Dueño (Cliente)</th>
                                <th style={thStyle}>Teléfono Dueño</th>
                                <th style={thStyle}>Descripción</th>
                                <th style={thStyle}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mascotasFiltradas.map((m) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: 15, fontWeight: 'bold', color: '#2c3e50' }}>{m.nombre}</td>
                                    <td style={{ padding: 15, color: '#7f8c8d' }}>{m.especie} - {m.raza}</td>
                                    <td style={{ padding: 15, color: '#7f8c8d' }}>{m.edad} años</td>
                                    
                                    {/* AQUÍ MOSTRAMOS EL DUEÑO REAL */}
                                    <td style={{ padding: 15, color: '#3498db', fontWeight: 'bold' }}>
                                        {m.dueño ? `${m.dueño.nombre} ${m.dueño.apellido}` : 'Sin Asignar'}
                                    </td>
                                    <td style={{ padding: 15, color: '#7f8c8d' }}>
                                        {m.dueño ? m.dueño.telefono : '-'}
                                    </td>

                                    <td style={{ padding: 15, fontStyle: 'italic', color: '#95a5a6' }}>{m.descripcion}</td>
                                    <td style={{ padding: 15 }}>
                                        <button onClick={() => eliminarMascota(m.id!)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#e74c3c' }}><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            {mascotasFiltradas.length === 0 && <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#ccc' }}>No hay pacientes.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const thStyle = { padding: '15px', textAlign: 'left' as const, color: '#7f8c8d', fontSize: 13, fontWeight: 'bold' };