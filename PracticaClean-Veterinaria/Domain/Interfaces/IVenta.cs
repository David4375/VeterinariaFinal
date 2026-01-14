using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IVenta
    {
        Task Crear(Venta venta);
        Task<IEnumerable<Venta>> ObtenerHistorial();
    }
}