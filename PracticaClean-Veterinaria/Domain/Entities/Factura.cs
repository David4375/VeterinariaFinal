using System;

namespace Domain.Entities
{
    public class Factura
    {
        public Guid Id { get; set; }
        public Guid VentaId { get; set; } // Vinculada a una venta específica
        public string NumeroFactura { get; set; } = string.Empty; // Ej: FAC-2024-001
        public DateTime FechaEmision { get; set; }

        // Datos del Cliente (Snapshot: se guardan aquí por si el cliente cambia datos después)
        public string ClienteNombre { get; set; } = string.Empty;
        public string ClienteNit { get; set; } = string.Empty;

        // Montos
        public decimal Subtotal { get; set; }
        public decimal Impuesto { get; set; } // Ej: IVA 13%
        public decimal Total { get; set; }
    }
}