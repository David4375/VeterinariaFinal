// --- MODELOS PRINCIPALES ---

// --- CLIENTE ---
export interface Cliente {
    id: string;
    nombre: string;
    apellido: string;
    nombreCompleto?: string; // El backend puede mandar esto calculado
    telefono: string;
    ubicacion: string;
    correo: string;
    mascotas?: Mascota[]; // Lista de mascotas del cliente
    cantidadMascotas?: number; // Dato útil para la tabla
}

// --- MASCOTA ---
export interface Mascota {
    id?: string;
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    descripcion: string;
    clienteId?: string; // ID para vincular
    dueño?: Cliente;    // Objeto dueño completo (ahora el backend lo manda)
}

// --- DTO REGISTRO (IMPORTANTE) ---
export interface RegistroCompletoDTO {
    // Datos Cliente
    nombre: string;
    apellido: string;
    telefono: string;
    ubicacion: string;
    correo: string;
    // Datos Mascota Inicial
    nombreMascota: string;
    especie: string;
    raza: string;
    edad: number;
    descripcion: string;
}

// --- OTROS MODELOS DEL SISTEMA ---

export interface Medicamento {
    id?: string;
    nombre: string;
    laboratorio: string;
    precio: number;
    stock: number;
    fechaVencimiento: string;
    tipo: string; // "Medicamentos", "Vacunas", etc.
}

export interface Cita {
    id?: string;
    mascotaId: string;
    fechaHora: string;
    motivo: string;
    estado?: string;
}

export interface DetalleVenta {
    medicamentoId: string;
    cantidad: number;
    // Opcionales para mostrar en tabla
    nombreProducto?: string;
    precioUnitario?: number;
    subtotal?: number;
}

export interface RegistrarVenta {
    metodoPago: string;
    productos: DetalleVenta[];
}

// Respuesta que devuelve el backend al listar ventas
export interface VentaResponse {
    id: string;
    fecha: string;
    metodoPago: string;
    total: number;
    detalles: DetalleVenta[];
}

export interface Factura {
    id: string;
    numeroFactura: string;
    clienteNombre: string;
    clienteNit: string;
    total: number;
    fechaEmision: string;
}