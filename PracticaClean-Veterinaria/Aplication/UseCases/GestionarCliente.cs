using Aplication.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class GestionarClientes
    {
        private readonly ICliente _clienteRepo;

        public GestionarClientes(ICliente clienteRepo)
        {
            _clienteRepo = clienteRepo;
        }

        // Listar para la tabla
        public async Task<List<ClienteDTO>> ListarClientes()
        {
            var clientes = await _clienteRepo.ListarTodos();

            return clientes.Select(c => new ClienteDTO
            {
                Id = c.Id,
                NombreCompleto = $"{c.Nombre} {c.Apellido}",
                Telefono = c.Telefono,
                Ubicacion = c.Ubicacion,
                Correo = c.Correo,
                CantidadMascotas = c.Mascotas.Count
            }).ToList();
        }

        // Crear Cliente + Mascota inicial
        public async Task CrearClienteConMascota(CrearClienteConMascotaDTO datos)
        {
            // 1. Creamos el Cliente
            var nuevoCliente = new Cliente
            {
                Id = Guid.NewGuid(),
                Nombre = datos.Nombre,
                Apellido = datos.Apellido,
                Telefono = datos.Telefono,
                Ubicacion = datos.Ubicacion,
                Correo = datos.Correo
            };

            // 2. Creamos la Mascota y la vinculamos
            var nuevaMascota = new Mascota
            {
                Id = Guid.NewGuid(),
                ClienteId = nuevoCliente.Id, // Vinculación clave
                Nombre = datos.NombreMascota,
                Especie = datos.Especie,
                Raza = datos.Raza,
                Edad = datos.Edad,
                Descripcion = datos.Descripcion
            };

            nuevoCliente.Mascotas.Add(nuevaMascota);

            // 3. Guardamos todo (Entity Framework es inteligente y guarda ambas tablas)
            await _clienteRepo.Crear(nuevoCliente);
        }
    }
}