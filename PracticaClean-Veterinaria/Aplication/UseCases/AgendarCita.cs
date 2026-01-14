using Aplication.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class AgendarCita
    {
        private readonly ICita _citaRepo;

        // Podríamos inyectar IMascotaRepo para validar que la mascota exista

        public AgendarCita(ICita citaRepo)
        {
            _citaRepo = citaRepo;
        }

        public async Task EjecutarAsync(AgendarCitaDTO datos)
        {
            // 1. Validaciones de negocio (Horarios laborales, fechas pasadas)
            if (datos.FechaHora < DateTime.Now)
                throw new ArgumentException("No se puede agendar una cita en el pasado.");

            // 2. Validar Disponibilidad (Paso 2.1 del Flujo)
            bool horarioOcupado = await _citaRepo.ExisteCitaEnHorario(datos.FechaHora);

            if (horarioOcupado)
            {
                // Flujo Alternativo 4.2
                throw new InvalidOperationException($"El horario {datos.FechaHora} ya está ocupado. Por favor seleccione otro.");
            }

            // 3. Crear la Cita
            var nuevaCita = new Cita
            {
                Id = Guid.NewGuid(),
                MascotaId = datos.MascotaId,
                FechaHora = datos.FechaHora,
                Motivo = datos.Motivo,
                Estado = "Programada"
            };

            // 4. Guardar (Paso 4.1)
            await _citaRepo.Crear(nuevaCita);
        }
    }
}