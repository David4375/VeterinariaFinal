import { useFacturas } from '../controllers/useFacture';

export const FacturaHistorialView = () => {
    const { facturas } = useFacturas();

    return (
        <div style={{ padding: 20 }}>
            <h2>🗂️ Historial de Facturación</h2>
            <p>Listado de todas las facturas generadas por el sistema.</p>
            
            <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, borderColor: '#ddd' }}>
                <thead style={{ background: '#2c3e50', color: 'white' }}>
                    <tr>
                        <th>Nro Factura</th>
                        <th>Cliente</th>
                        <th>NIT/CI</th>
                        <th>Fecha Emisión</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {facturas.map(f => (
                        <tr key={f.id}>
                            <td style={{ fontWeight: 'bold' }}>{f.numeroFactura}</td>
                            <td>{f.clienteNombre}</td>
                            <td>{f.clienteNit}</td>
                            <td>{new Date(f.fechaEmision).toLocaleString()}</td>
                            <td style={{ color: 'green', fontWeight: 'bold' }}>${f.total.toFixed(2)}</td>
                        </tr>
                    ))}
                    {facturas.length === 0 && (
                        <tr><td colSpan={5} style={{textAlign: 'center', padding: 20}}>No hay facturas registradas aún.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};