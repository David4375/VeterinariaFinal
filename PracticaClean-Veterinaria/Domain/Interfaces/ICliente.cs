using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ICliente
    {
        Task<List<Cliente>> ListarTodos();
        Task Crear(Cliente cliente);
    }
}