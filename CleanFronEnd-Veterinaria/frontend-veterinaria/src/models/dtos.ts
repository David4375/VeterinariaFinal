// src/models/dtos.ts
export interface RegistroCompletoDTO {
    // Cliente
    nombre: string;
    apellido: string;
    telefono: string;
    ubicacion: string;
    correo: string;
    // Mascota
    nombreMascota: string;
    especie: string;
    raza: string;
    edad: number;
    descripcion: string;
}