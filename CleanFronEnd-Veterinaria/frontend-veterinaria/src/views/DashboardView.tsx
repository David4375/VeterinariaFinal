import { 
    Dog, Package, TrendingUp, Clock, Calendar 
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

import { useMascotas } from '../controllers/useMascotas';
import { useCitas } from '../controllers/useCitas';
import { useMedicamentos } from '../controllers/useMedicamentos';
// Asegúrate de que tu hook se llame 'useFacturas' (plural) o ajústalo si se llama 'useFacture'
import { useFacturas } from '../controllers/useFacture'; 

export const DashboardView = () => {
    const { mascotas } = useMascotas();
    const { citas } = useCitas();
    const { medicamentos } = useMedicamentos();
    const { facturas } = useFacturas();

    // --- CÁLCULOS KPI ---
    const totalMascotas = mascotas.length;
    const totalProductos = medicamentos.length;
    
    // Suma total de ingresos basada en facturas
    const ingresoTotal = facturas.reduce((acc, curr) => acc + curr.total, 0);
    
    // Filtramos citas que no estén canceladas ni realizadas (Pendientes)
    const citasPendientes = citas.filter(c => c.estado !== 'Cancelada' && c.estado !== 'Realizada');

    // Datos simulados para la gráfica (puedes conectarlos con datos reales luego)
    const dataGrafica = [
        { name: 'Lun', ingresos: 400 },
        { name: 'Mar', ingresos: 300 },
        { name: 'Mie', ingresos: 550 },
        { name: 'Jue', ingresos: 450 },
        { name: 'Vie', ingresos: ingresoTotal > 0 ? ingresoTotal : 600 },
        { name: 'Sab', ingresos: 700 },
        { name: 'Dom', ingresos: 200 },
    ];

    return (
        <div style={{ padding: '30px', fontFamily: "'Segoe UI', sans-serif" }}>
            
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#2c3e50' }}>Panel de Control</h2>
                    <span style={{ color: '#7f8c8d' }}>Resumen general de la clínica</span>
                </div>
            </header>

            {/* 1. Tarjetas Superiores (KPIs) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
                <StatCard title="Pacientes" value={totalMascotas} icon={<Dog size={24} color="#3498db" />} sub="Total registrados" />
                <StatCard 
    title="Ingresos" 
    value={`Bs ${ingresoTotal.toFixed(2)}`}  // <--- AQUÍ CAMBIAS EL $ POR Bs
    icon={<TrendingUp size={24} color="#2ecc71" />} 
    sub="Facturado histórico" 
/>
                <StatCard title="Inventario" value={totalProductos} icon={<Package size={24} color="#e67e22" />} sub="Productos en stock" />
                <StatCard title="Pendientes" value={citasPendientes.length} icon={<Calendar size={24} color="#e74c3c" />} sub="Próximos turnos" />
            </div>

            {/* 2. Sección Central */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                
                {/* GRÁFICA DE INGRESOS */}
                <div style={{ background: 'white', padding: 25, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Movimiento de Caja</h3>
                    
                    {/* --- CORRECCIÓN AQUÍ: HEIGHT FIJO --- */}
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataGrafica}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2ecc71" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="ingresos" stroke="#2ecc71" fillOpacity={1} fill="url(#colorIngresos)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* LISTA DE PRÓXIMOS TURNOS */}
                <div style={{ background: 'white', padding: 25, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50', fontSize: 18 }}>Próximos Turnos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        {citasPendientes.slice(0, 4).map((cita, i) => (
                            <div key={i} style={{ display: 'flex', gap: 15, paddingBottom: 15, borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50 }}>
                                    <Clock size={16} color="#7f8c8d" />
                                    <span style={{ fontSize: 12, fontWeight: 'bold', marginTop: 4, color: '#2c3e50' }}>
                                        {new Date(cita.fechaHora).getHours()}:{new Date(cita.fechaHora).getMinutes().toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <div>
                                    <strong style={{ color: '#2c3e50', display: 'block' }}>
                                        {/* Intentamos mostrar el nombre si existe, sino el ID corto */}
                                        Mascota (ID: {cita.mascotaId.substring(0,4)}...)
                                    </strong>
                                    <span style={{ fontSize: 13, color: '#7f8c8d' }}>{cita.motivo}</span>
                                </div>
                            </div>
                        ))}
                        {citasPendientes.length === 0 && (
                            <p style={{ color: '#95a5a6', fontStyle: 'italic' }}>No hay citas pendientes.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar para las tarjetas de arriba
const StatCard = ({ title, value, icon, sub }: any) => (
    <div style={{ background: 'white', padding: 25, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
            <h4 style={{ margin: 0, color: '#7f8c8d', fontSize: 14, textTransform: 'uppercase' }}>{title}</h4>
            <div style={{ background: '#f8f9fa', padding: 8, borderRadius: '50%' }}>{icon}</div>
        </div>
        <div>
            <span style={{ fontSize: 28, fontWeight: 'bold', color: '#2c3e50' }}>{value}</span>
            <div style={{ fontSize: 12, color: '#95a5a6', marginTop: 5 }}>{sub}</div>
        </div>
    </div>
);