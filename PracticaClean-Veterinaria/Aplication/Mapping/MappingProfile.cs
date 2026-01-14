using Aplication.DTOs;
using Domain.Entities;
using AutoMapper;

namespace Aplication.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Mapeo de Medicamentos
            CreateMap<Medicamento, MedicamentoDTOs>().ReverseMap();
        }
    }
}