package com.full3.full3.model;

// Importa las anotaciones de JPA para mapear la clase a una tabla de Oracle
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Importa anotaciones de validación para asegurar datos correctos al recibir JSON
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// Indica que esta clase es una entidad JPA (se mapea a una tabla de BD)
@Entity

// Define el nombre exacto de la tabla en Oracle
@Table(name = "USUARIOS")
public class Usuario {

    // Clave primaria de la tabla
    @Id

    // El valor se genera automáticamente con la secuencia de Oracle
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El nombre no puede estar vacío
    @NotBlank(message = "El nombre es obligatorio")

    // Columna NOMBRE en la tabla USUARIOS
    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;

    // El email no puede estar vacío y debe tener formato de correo válido
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")

    // Columna EMAIL en la tabla USUARIOS, única para evitar duplicados
    @Column(name = "EMAIL", nullable = false, length = 150, unique = true)
    private String email;

    // La contraseña no puede estar vacía
    @NotBlank(message = "La contraseña es obligatoria")

    // Columna PASSWORD en la tabla USUARIOS
    @Column(name = "PASSWORD", nullable = false, length = 100)
    private String password;

    // El rol debe ser exactamente ADMIN o CLIENTE
    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "ADMIN|CLIENTE", message = "El rol debe ser ADMIN o CLIENTE")

    // Columna ROL en la tabla USUARIOS
    @Column(name = "ROL", nullable = false, length = 10)
    private String rol;

    // Constructor vacío obligatorio para JPA
    public Usuario() {
    }

    // Constructor con todos los campos para facilitar la creación de objetos
    public Usuario(Long id, String nombre, String email, String password, String rol) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    // Devuelve el id del usuario
    public Long getId() {
        return id;
    }

    // Asigna el id del usuario
    public void setId(Long id) {
        this.id = id;
    }

    // Devuelve el nombre del usuario
    public String getNombre() {
        return nombre;
    }

    // Asigna el nombre del usuario
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Devuelve el email del usuario
    public String getEmail() {
        return email;
    }

    // Asigna el email del usuario
    public void setEmail(String email) {
        this.email = email;
    }

    // Devuelve la contraseña del usuario
    public String getPassword() {
        return password;
    }

    // Asigna la contraseña del usuario
    public void setPassword(String password) {
        this.password = password;
    }

    // Devuelve el rol del usuario (ADMIN o CLIENTE)
    public String getRol() {
        return rol;
    }

    // Asigna el rol del usuario
    public void setRol(String rol) {
        this.rol = rol;
    }
}
