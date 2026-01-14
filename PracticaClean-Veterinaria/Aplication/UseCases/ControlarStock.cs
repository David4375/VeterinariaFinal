using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Aplication.UseCases
{
    public class ControlarStock
    {
        private readonly IMedicamento _medicamentoRepo;
        private readonly IAlertaStrategy _alertaStrategy;

        public ControlarStock(IMedicamento medicamentoRepo, IAlertaStrategy alertaStrategy)
        {
            _medicamentoRepo = medicamentoRepo;
            _alertaStrategy = alertaStrategy;
        }

        public async Task Ejecutar()
        {
            var medicamentos = await _medicamentoRepo.ListarTodos();

            foreach (var med in medicamentos)
            {
                if (med.Stock < 5)
                {
                    // CORRECCIÓN AQUÍ: Cambiamos "GenerarAlerta" por "EnviarAlerta"
                    await _alertaStrategy.EnviarAlerta($"ALERTA AUTOMÁTICA: El medicamento '{med.Nombre}' tiene stock crítico ({med.Stock}).");
                }
            }
        }
    }
}