using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq; // <--- ESTO FALTABA PARA EL ToList()
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class GestionarMedicamentos
    {
        private readonly IMedicamento _medicamentoRepo;
        private readonly IAlertaStrategy _alertaStrategy;

        public GestionarMedicamentos(IMedicamento medicamentoRepo, IAlertaStrategy alertaStrategy)
        {
            _medicamentoRepo = medicamentoRepo;
            _alertaStrategy = alertaStrategy;
        }

        public async Task<List<Medicamento>> ListarTodos()
        {
            // SOLUCIÓN AL ERROR DE TU IMAGEN:
            var resultados = await _medicamentoRepo.ListarTodos();
            return resultados.ToList(); 
        }

        public async Task Guardar(Medicamento medicamento)
        {
            // LÓGICA DEL PATRÓN STRATEGY (Para tu defensa)
            if (medicamento.Stock < 5)
            {
                // Aquí se ejecuta la estrategia (Consola, Email, etc.)
                await _alertaStrategy.EnviarAlerta($"¡ALERTA DE STOCK! El producto '{medicamento.Nombre}' se está agotando. Quedan: {medicamento.Stock}");
            }

            if (medicamento.Id == Guid.Empty)
            {
                medicamento.Id = Guid.NewGuid();
                await _medicamentoRepo.Crear(medicamento);
            }
            else
            {
                await _medicamentoRepo.Actualizar(medicamento);
            }
        }

        public async Task Eliminar(Guid id)
        {
            await _medicamentoRepo.Eliminar(id);
        }
    }
}