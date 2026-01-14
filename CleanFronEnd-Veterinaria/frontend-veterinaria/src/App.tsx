import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout'; // <--- Importamos el Layout

// Vistas
import { DashboardView } from './views/DashboardView';
import { MascotaView } from './views/MascotaView';
import { VentaView } from './views/VentaView';
import { MedicamentoView } from './views/MedicamentoView';
import { CitaView } from './views/CitaView';
import { FacturaHistorialView } from './views/FacturaHistorialView';
import { ClienteView } from './views/ClienteView';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PADRE CON EL LAYOUT (MENÚ FIJO) */}
        <Route element={<MainLayout />}>
            
            {/* Todas estas páginas tendrán el menú a la izquierda */}
            <Route path="/" element={<DashboardView />} />
            <Route path="/mascotas" element={<MascotaView />} />
            <Route path="/medicamentos" element={<MedicamentoView />} />
            <Route path="/citas" element={<CitaView />} />
            <Route path="/ventas" element={<VentaView />} />
            <Route path="/facturas" element={<FacturaHistorialView />} />
            <Route path="/clientes" element={<ClienteView />} />
        </Route>
        
        <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;