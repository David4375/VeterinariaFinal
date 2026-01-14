import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const MainLayout = () => {
    return (
        // Usamos width: 100% y quitamos cualquier margen
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
            
            {/* Sidebar Fijo Izquierda */}
            <div style={{ flexShrink: 0 }}> {/* Evita que el sidebar se aplaste */}
                <Sidebar />
            </div>

            {/* Contenido Derecha - Se expande para ocupar todo el resto */}
            <div style={{ flex: 1, background: '#f4f6f8', minWidth: 0 }}>
                <Outlet />
            </div>
        </div>
    );
};