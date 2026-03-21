package com.full3.full3.exception;

// Importa las clases necesarias para construir la respuesta de error en JSON
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

// Importa las anotaciones de Spring para el manejo global de excepciones
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

// Importa clases para capturar el momento del error
import java.time.LocalDateTime;

// Importa Map y LinkedHashMap para construir la respuesta JSON con campos ordenados
import java.util.LinkedHashMap;
import java.util.Map;

// @RestControllerAdvice intercepta las excepciones lanzadas desde cualquier
// controlador (@RestController) de la aplicación.
// De esta forma, NO se necesita try-catch en ningún controlador.
// Todos los errores pasan por aquí y se devuelven como JSON descriptivo.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========================================================
    // ERROR 400 - VALIDACIONES FALLIDAS
    // ==========================================================

    // Se activa cuando @Valid detecta que los datos del body no cumplen
    // con las restricciones definidas en el modelo (@NotBlank, @Email, etc.)
    // Ejemplo: crear un usuario con email vacío o rol incorrecto.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(
            MethodArgumentNotValidException ex) {

        // Construye el cuerpo de la respuesta de error con campos ordenados
        Map<String, Object> cuerpo = new LinkedHashMap<>();

        // Incluye el momento exacto en que ocurrió el error
        cuerpo.put("timestamp", LocalDateTime.now().toString());

        // Código HTTP del error
        cuerpo.put("status", 400);

        // Descripción del tipo de error
        cuerpo.put("error", "Datos inválidos");

        // Mensaje general para el cliente
        cuerpo.put("mensaje", "Uno o más campos no cumplen con los requisitos de validación");

        // Recopila todos los mensajes de error de cada campo con problema
        // Ejemplo: "titulo: El título es obligatorio"
        Map<String, String> erroresCampos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            erroresCampos.put(error.getField(), error.getDefaultMessage())
        );

        // Agrega los errores por campo al cuerpo de la respuesta
        cuerpo.put("errores", erroresCampos);

        // Retorna respuesta HTTP 400 con el cuerpo construido en formato JSON
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cuerpo);
    }

    // ==========================================================
    // ERROR 404 - RECURSO NO ENCONTRADO
    // ==========================================================

    // Se activa cuando se lanza una IllegalArgumentException desde el servicio,
    // lo que indica que un recurso (libro, usuario, producto) no fue encontrado.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> manejarNoEncontrado(
            IllegalArgumentException ex) {

        // Construye el cuerpo del error 404
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("timestamp", LocalDateTime.now().toString());
        cuerpo.put("status", 404);
        cuerpo.put("error", "Recurso no encontrado");

        // Usa el mensaje de la excepción como detalle descriptivo
        cuerpo.put("mensaje", ex.getMessage());

        // Retorna respuesta HTTP 404
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(cuerpo);
    }

    // ==========================================================
    // ERROR 500 - ERROR INTERNO DEL SERVIDOR
    // ==========================================================

    // Captura cualquier excepción no manejada explícitamente.
    // Evita que el servidor devuelva un "Error 500" genérico sin información útil.
    // En su lugar, devuelve un JSON descriptivo con el mensaje del error.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarErrorGeneral(Exception ex) {

        // Construye el cuerpo del error 500
        Map<String, Object> cuerpo = new LinkedHashMap<>();
        cuerpo.put("timestamp", LocalDateTime.now().toString());
        cuerpo.put("status", 500);
        cuerpo.put("error", "Error interno del servidor");

        // Incluye el mensaje de la excepción para facilitar el diagnóstico
        cuerpo.put("mensaje", ex.getMessage());

        // Retorna respuesta HTTP 500 con JSON descriptivo
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(cuerpo);
    }
}
