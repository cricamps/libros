package com.full3.full3.service;

// Importa las clases del modelo y del repository
import com.full3.full3.model.Usuario;
import com.full3.full3.repository.UsuarioRepository;

// Marca esta clase como un componente de servicio de Spring
import org.springframework.stereotype.Service;

// Importa List y Optional para los tipos de retorno
import java.util.List;
import java.util.Optional;

// Indica que esta clase pertenece a la capa de servicio.
// Aquí se ubica la lógica de negocio del microservicio de usuarios.
@Service
@SuppressWarnings("all")
public class UsuarioService {

    // Referencia al repository de usuarios.
    // Desde aquí se accede a las operaciones de base de datos.
    private final UsuarioRepository usuarioRepository;

    // Constructor con inyección de dependencias.
    // Spring Boot entrega automáticamente una instancia de UsuarioRepository.
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ==========================================================
    // OBTENER TODOS LOS USUARIOS
    // ==========================================================

    // Devuelve la lista completa de usuarios registrados.
    // Usado en el endpoint: GET /api/usuarios
    public List<Usuario> obtenerTodos() {

        // findAll() recupera todos los registros de la tabla USUARIOS
        return usuarioRepository.findAll();
    }

    // ==========================================================
    // OBTENER UN USUARIO POR ID
    // ==========================================================

    // Busca un usuario específico por su clave primaria.
    // Devuelve Optional porque el usuario puede no existir.
    // Usado en: GET /api/usuarios/{id}
    public Optional<Usuario> obtenerPorId(Long id) {

        // findById() retorna Optional con el usuario o vacío si no existe
        return usuarioRepository.findById(id);
    }

    // ==========================================================
    // CREAR UN NUEVO USUARIO
    // ==========================================================

    // Guarda un nuevo usuario en la base de datos.
    // Usado en: POST /api/usuarios
    public Usuario guardar(Usuario usuario) {

        // save() con id=null inserta un nuevo registro en USUARIOS
        return usuarioRepository.save(usuario);
    }

    // ==========================================================
    // ACTUALIZAR UN USUARIO EXISTENTE
    // ==========================================================

    // Modifica los datos de un usuario existente buscándolo por id.
    // Si no existe, devuelve Optional vacío.
    // Usado en: PUT /api/usuarios/{id}
    public Optional<Usuario> actualizar(Long id, Usuario usuarioActualizado) {

        // Busca el usuario actual. Si existe, actualiza sus campos.
        return usuarioRepository.findById(id).map(usuario -> {

            // Actualiza cada campo con los nuevos valores recibidos
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setEmail(usuarioActualizado.getEmail());
            usuario.setPassword(usuarioActualizado.getPassword());
            usuario.setRol(usuarioActualizado.getRol());

            // Guarda y retorna el usuario modificado
            return usuarioRepository.save(usuario);
        });
    }

    // ==========================================================
    // ELIMINAR UN USUARIO POR ID
    // ==========================================================

    // Elimina un usuario usando su id.
    // Retorna true si fue eliminado, false si no existía.
    // Usado en: DELETE /api/usuarios/{id}
    public boolean eliminar(Long id) {

        // Verifica si el usuario existe antes de eliminar
        if (usuarioRepository.existsById(id)) {

            // Elimina el registro de la base de datos
            usuarioRepository.deleteById(id);

            // Indica que la eliminación fue exitosa
            return true;
        }

        // El usuario no existía, retorna false
        return false;
    }

    // ==========================================================
    // LOGIN DE USUARIO
    // ==========================================================

    // Valida las credenciales del usuario comparando email y contraseña.
    // Si son correctas, devuelve el usuario con su rol.
    // Si no coinciden, devuelve Optional vacío.
    // Usado en: POST /api/auth/login
    public Optional<Usuario> login(String email, String password) {

        // Busca el usuario por email en la base de datos
        return usuarioRepository.findByEmail(email).filter(usuario ->

            // Verifica que la contraseña recibida coincida con la almacenada
            usuario.getPassword().equals(password)
        );
    }
}
