using System.Threading.Tasks;

namespace Domain.Interfaces
{
    // SOLID: Open/Closed Principle
    // Definimos el contrato. Podemos crear muchas estrategias (Email, SMS, Log) sin cambiar el código que las usa.
    public interface IAlertaStrategy
    {
        Task EnviarAlerta(string mensaje);
    }
}