package com.full3.full3.model;

// Esta clase es un DTO (Data Transfer Object).
// Se usa exclusivamente para recibir los datos del endpoint de login.
// No está mapeada a ninguna tabla de la base de datos.
public class LoginRequest {

    // Email que el usuario envía al intentar iniciar sesión
    private String email;

    // Contraseña que el usuario envía al intentar iniciar sesión
    private String password;

    // Constructor vacío necesario para que Spring pueda deserializar el JSON
    public LoginRequest() {
    }

    // Devuelve el email del login
    public String getEmail() {
        return email;
    }

    // Asigna el email del login
    public void setEmail(String email) {
        this.email = email;
    }

    // Devuelve la contraseña del login
    public String getPassword() {
        return password;
    }

    // Asigna la contraseña del login
    public void setPassword(String password) {
        this.password = password;
    }
}
