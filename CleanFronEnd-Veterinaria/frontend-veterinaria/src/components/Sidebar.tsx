import { Link, useLocation } from 'react-router-dom';
import { 
    Home, Receipt, Calendar, Users, Dog, Package, LogOut, FileText, Stethoscope 
} from 'lucide-react';

export const Sidebar = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside style={{ 
            width: '260px', 
            background: '#2c3e50', 
            color: '#ecf0f1', 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh', 
            position: 'sticky', 
            top: 0,
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)' // Sombra sutil para profundidad
        }}>
            {/* HEADER PRO */}
            <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ 
                    background: 'white', 
                    width: 70, height: 70, 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 15px', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                    {/* Nuevo Icono Más Bonito */}
                    <Stethoscope size={35} color="#2c3e50" strokeWidth={2} />
                </div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: 20, fontWeight: '700', letterSpacing: '0.5px' }}>
                    Veterinaria SF
                </h3>
                <small style={{ color: '#bdc3c7', fontSize: 13, display: 'block' }}>
                    Dr. Alex Flores
                </small>
            </div>

            {/* NAVEGACIÓN */}
            <nav style={{ flex: 1, padding: '20px 15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
                <MenuItem to="/" icon={<Home size={20} />} label="Inicio" active={isActive('/')} />
                <MenuItem to="/clientes" icon={<Users size={20} />} label="Clientes" active={isActive('/clientes')} />
                <MenuItem to="/mascotas" icon={<Dog size={20} />} label="Pacientes" active={isActive('/mascotas')} />
                <MenuItem to="/citas" icon={<Calendar size={20} />} label="Agenda & Citas" active={isActive('/citas')} />
                <MenuItem to="/ventas" icon={<Receipt size={20} />} label="Caja / Ventas" active={isActive('/ventas')} />
                <MenuItem to="/medicamentos" icon={<Package size={20} />} label="Inventario" active={isActive('/medicamentos')} />
                <MenuItem to="/facturas" icon={<FileText size={20} />} label="Facturación" active={isActive('/facturas')} />
            </nav>

            {/* FOOTER / SALIR */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button style={{ 
                    background: 'rgba(231, 76, 60, 0.1)', 
                    border: 'none', 
                    color: '#e74c3c', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, 
                    cursor: 'pointer', 
                    width: '100%', 
                    padding: '12px',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    transition: '0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'}
                >
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

// Componente de Item de Menú Mejorado
const MenuItem = ({ to, icon, label, active }: any) => (
    <Link to={to} style={{ 
        display: 'flex', alignItems: 'center', gap: 15, 
        padding: '12px 20px', 
        color: active ? 'white' : '#bdc3c7', 
        textDecoration: 'none', 
        borderRadius: 8, // Bordes redondeados modernos
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent', // Fondo sutil en vez de borde izquierdo
        fontWeight: active ? '600' : '400',
        transition: 'all 0.2s ease',
        transform: active ? 'translateX(5px)' : 'none' // Pequeño movimiento al activar
    }}>
        {icon}
        <span style={{ fontSize: 15 }}>{label}</span>
    </Link>
);