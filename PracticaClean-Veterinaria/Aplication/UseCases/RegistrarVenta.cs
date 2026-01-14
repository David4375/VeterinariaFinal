using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class RegistrarVenta
    {
        private readonly IVenta _ventaRepo;
        private readonly IMedicamento _medicamentoRepo; // Necesario para bajar el stock

        public RegistrarVenta(IVenta ventaRepo, IMedicamento medicamentoRepo)
        {
            _ventaRepo = ventaRepo;
            _medicamentoRepo = medicamentoRepo;
        }

        // ESTE ES EL MÉTODO QUE FALTABA (CS1061):
        public async Task Ejecutar(Venta venta)
        {
            // 1. Validar y Actualizar Stock
            var productos = await _medicamentoRepo.ListarTodos();

            foreach (var detalle in venta.Detalles)
            {
                var productoEnBd = productos.FirstOrDefault(m => m.Id == detalle.MedicamentoId);
                
                if (productoEnBd != null)
                {
                    if (productoEnBd.Stock < detalle.Cantidad)
                    {
                        throw new Exception($"Stock insuficiente para {productoEnBd.Nombre}. Quedan {productoEnBd.Stock}");
                    }

                    // Restar stock
                    productoEnBd.Stock -= detalle.Cantidad;
                    await _medicamentoRepo.Actualizar(productoEnBd);

                    // Asignar precios reales del backend (seguridad)
                    detalle.PrecioUnitario = productoEnBd.Precio;
                    detalle.Subtotal = productoEnBd.Precio * detalle.Cantidad;
                }
            }

            // 2. Calcular Total Final
            venta.Total = venta.Detalles.Sum(d => d.Subtotal);

            // 3. Guardar Venta
            await _ventaRepo.Crear(venta); // Asumo que tu repo tiene "Crear", si se llama "Registrar", cámbialo aquí.
        }
    }
}