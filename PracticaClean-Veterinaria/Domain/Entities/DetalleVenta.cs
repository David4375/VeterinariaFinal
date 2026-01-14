using System;

namespace Domain.Entities
{
    public class DetalleVenta
    {
        public Guid Id { get; set; }
        public Guid VentaId { get; set; }
        public Guid MedicamentoId { get; set; } // Relación con el producto
        public string NombreProducto { get; set; } = string.Empty; // Guardamos el nombre por si luego cambia en inventario
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}