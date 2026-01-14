using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IFactura
    {
        Task Crear(Factura factura);
        Task<Factura?> ObtenerPorVentaId(Guid ventaId); // Para no facturar doble
        Task<IEnumerable<Factura>> ObtenerTodas();
    }
}