package com.full3.full3.repository;

// Importa la entidad Usuario que será administrada por este repository
import com.full3.full3.model.Usuario;

// Importa JpaRepository, que entrega operaciones CRUD ya implementadas
import org.springframework.data.jpa.repository.JpaRepository;

// Importa Optional para representar resultados de búsqueda que pueden no existir
import java.util.Optional;

// Define el repository de Usuario.
// JpaRepository<Usuario, Long>:
// - Usuario: entidad que administra este repository
// - Long: tipo de la clave primaria (id)
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método personalizado para buscar un usuario por su email.
    // Spring Data JPA genera automáticamente la consulta SQL a partir del nombre del método.
    // Se usa en el login para encontrar al usuario por su correo electrónico.
    Optional<Usuario> findByEmail(String email);
}
