using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Infraestructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Agregamos las tablas
        public DbSet<Medicamento> Medicamentos { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<DetalleVenta> DetalleVentas { get; set; }
        public DbSet<Mascota> Mascotas { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<Cliente> Clientes { get; set; } // <--- NUEVA TABLA

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de tipos decimales (Moneda)
            modelBuilder.Entity<Medicamento>().Property(p => p.Precio).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<DetalleVenta>().Property(p => p.PrecioUnitario).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<DetalleVenta>().Property(p => p.Subtotal).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Venta>().Property(p => p.Total).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Factura>().Property(p => p.Total).HasColumnType("decimal(18,2)");

            // CONFIGURACIÓN DE LA RELACIÓN CLIENTE -> MASCOTAS
            modelBuilder.Entity<Mascota>()
                .HasOne(m => m.Dueño)
                .WithMany(c => c.Mascotas)
                .HasForeignKey(m => m.ClienteId)
                .OnDelete(DeleteBehavior.Cascade); // Si borras al cliente, se borran sus mascotas
        }
    }
}