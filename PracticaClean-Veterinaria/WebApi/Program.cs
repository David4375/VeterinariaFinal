using Aplication.UseCases;
using Domain.Interfaces;
using Infraestructure.Data;
using Infraestructure.Repositorios;
using Infraestructure.Services; 
using Microsoft.EntityFrameworkCore;
using Aplication.Mapping;
using System.Text.Json.Serialization; // CRÍTICO: Necesario para evitar ciclos infinitos

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE CORS (Permitir conexión desde React) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// --- 2. BASE DE DATOS (SQL Server) ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    b => b.MigrationsAssembly("Infraestructure")));

// --- 3. AUTOMAPPER ---
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// --- 4. INYECCIÓN DE DEPENDENCIAS: REPOSITORIOS (Acceso a Datos) ---
builder.Services.AddScoped<IMedicamento, MedicamentoRepositorio>();
builder.Services.AddScoped<IVenta, VentaRepositorio>();
builder.Services.AddScoped<ICita, CitaRepositorio>();
builder.Services.AddScoped<IMascota, MascotaRepositorio>();
builder.Services.AddScoped<IFactura, FacturaRepositorio>();
builder.Services.AddScoped<ICliente, ClienteRepositorio>(); // NUEVO: Repositorio de Clientes

// --- 5. INYECCIÓN DE DEPENDENCIAS: CASOS DE USO (Lógica de Negocio) ---

// Módulo: Medicamentos e Inventario
builder.Services.AddScoped<GestionarMedicamentos>();
builder.Services.AddScoped<AgregarMedicamento>();
builder.Services.AddScoped<ControlarStock>();
// Estrategia de Alertas (Patrón Strategy)
builder.Services.AddScoped<IAlertaStrategy, AlertaLogStrategy>();

// Módulo: Pacientes (Mascotas) y Clientes
builder.Services.AddScoped<GestionarMascotas>(); // CRÍTICO: El que arreglamos (Plural)
builder.Services.AddScoped<GestionarClientes>(); // NUEVO: Lógica de Clientes
builder.Services.AddScoped<RegistrarMascota>();  // (Mantenido por compatibilidad)

// Módulo: Citas
builder.Services.AddScoped<GestionarCitas>();
builder.Services.AddScoped<AgendarCita>();

// Módulo: Ventas y Facturación
builder.Services.AddScoped<RegistrarVenta>();
builder.Services.AddScoped<GenerarFactura>();
builder.Services.AddScoped<ObtenerReportes>();

// --- 6. CONFIGURACIÓN DE CONTROLADORES ---
// ReferenceHandler.IgnoreCycles es OBLIGATORIO para que funcione la relación Mascota -> Dueño
builder.Services.AddControllers().AddJsonOptions(x =>
   x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// --- 7. SWAGGER (Documentación API) ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- 8. PIPELINE DE LA APLICACIÓN ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll"); // Aplicar política CORS
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();