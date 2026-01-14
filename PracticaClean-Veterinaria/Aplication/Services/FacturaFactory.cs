using Domain.Entities;
using System;

namespace Aplication.Services
{
    public static class FacturaFactory
    {
        // Método estático de fábrica para construir el objeto complejo
        public static Factura CrearFactura(Guid ventaId, decimal totalVenta, string nombre, string nit)
        {
            // Regla de Negocio: Calcular IVA (ejemplo 13%) dentro de la venta o agregado
            // Supongamos que el Total de la venta ya incluye impuestos, desglosamos:
            decimal impuesto = totalVenta * 0.13m;
            decimal subtotal = totalVenta - impuesto;

            return new Factura
            {
                Id = Guid.NewGuid(),
                VentaId = ventaId,
                FechaEmision = DateTime.Now,
                NumeroFactura = $"FAC-{DateTime.Now:yyyyMM}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}", // Generador de código único
                ClienteNombre = nombre,
                ClienteNit = nit,
                Subtotal = Math.Round(subtotal, 2),
                Impuesto = Math.Round(impuesto, 2),
                Total = totalVenta
            };
        }
    }
}