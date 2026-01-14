using System;

namespace Aplication.DTOs
{
    public class AjusteStockDTO
    {
        public Guid MedicamentoId { get; set; }
        public int CantidadAjuste { get; set; } // Puede ser positivo (compra) o negativo (ajuste/pérdida)
        public string Motivo { get; set; } = string.Empty; // "Rotura", "Conteo cíclico", "Venta manual"
    }
}