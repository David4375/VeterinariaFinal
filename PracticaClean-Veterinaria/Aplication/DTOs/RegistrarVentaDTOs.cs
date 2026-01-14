using System;
using System.Collections.Generic;

namespace Aplication.DTOs
{
    public class ProductoVentaDTO
    {
        public Guid MedicamentoId { get; set; }
        public int Cantidad { get; set; }
    }

    public class RegistrarVentaDTO
    {
        public string MetodoPago { get; set; } = "Efectivo";
        public List<ProductoVentaDTO> Productos { get; set; } = new List<ProductoVentaDTO>();
    }
}