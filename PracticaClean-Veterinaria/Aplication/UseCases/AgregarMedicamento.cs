using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class AgregarMedicamento
    {
        private readonly IMedicamento _medicamentoRepo;

        public AgregarMedicamento(IMedicamento medicamentoRepo)
        {
            _medicamentoRepo = medicamentoRepo;
        }

        public async Task EjecutarAsync(Medicamento medicamento)
        {
            // Validaciones básicas con las propiedades QUE SÍ EXISTEN
            if (string.IsNullOrEmpty(medicamento.Nombre))
            {
                throw new ArgumentException("El nombre del medicamento es obligatorio.");
            }

            if (medicamento.Precio <= 0)
            {
                throw new ArgumentException("El precio debe ser mayor a 0.");
            }

            if (medicamento.Stock < 0)
            {
                throw new ArgumentException("El stock no puede ser negativo.");
            }

            // Guardar en base de datos
            await _medicamentoRepo.Crear(medicamento);
        }
    }
}