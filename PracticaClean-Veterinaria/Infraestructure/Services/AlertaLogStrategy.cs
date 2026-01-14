using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Infraestructure.Services
{
    // Estrategia 1: Simula enviar una alerta escribiendo en la consola o log
    public class AlertaLogStrategy : IAlertaStrategy
    {
        public Task EnviarAlerta(string mensaje)
        {
            // Aquí podrías guardar en un archivo de texto, consola, etc.
            Console.WriteLine($"[ALERTA SISTEMA]: {mensaje}");
            return Task.CompletedTask;
        }
    }
}