using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Venta
    {
        public Guid Id { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;
        public decimal Total { get; set; }
        public string MetodoPago { get; set; } = string.Empty; // "Efectivo", "Tarjeta"

        // Relación: Una venta tiene muchos detalles (productos)
        public List<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();
    }
}