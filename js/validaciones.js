/* =========================================================
   LÓGICA DE VALIDACIÓN DE FORMULARIOS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Escuchamos el evento "submit" de los distintos formularios
  const loginForm = document.getElementById("form-login");
  if (loginForm) {
    loginForm.addEventListener("submit", validarLogin);
  }

  const registroForm = document.getElementById("form-registro");
  if (registroForm) {
    registroForm.addEventListener("submit", validarRegistro);
  }

  const contactoForm = document.getElementById("form-contacto");
  if (contactoForm) {
    contactoForm.addEventListener("submit", validarContacto);
  }
});

// ================== VALIDACIÓN DEL LOGIN ==================
function validarLogin(evento) {
  evento.preventDefault();

  const correoInput = document.getElementById("correo").value.trim();
  const passInput = document.getElementById("password").value.trim();
  const mensajeError = document.getElementById("login-error-msg");

  mensajeError.textContent = "";
  mensajeError.classList.add("d-none");

  if (!correoInput) return mostrarError("El correo es obligatorio.", mensajeError);
  if (correoInput.length > 100) return mostrarError("El correo no puede exceder los 100 caracteres.", mensajeError);

  const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const tieneDominioValido = dominiosValidos.some((dominio) => correoInput.endsWith(dominio));

  if (!tieneDominioValido) return mostrarError("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.", mensajeError);
  if (!passInput) return mostrarError("La contraseña es obligatoria.", mensajeError);
  if (passInput.length < 4 || passInput.length > 10) return mostrarError("La contraseña debe tener entre 4 y 10 caracteres.", mensajeError);

  // Lógica simulada de Roles (Diferenciar Cliente vs Admin en Frontend)
  if (correoInput.toLowerCase().includes("admin")) {
    alert("¡Bienvenido al Panel de Control, Administrador Jefatura!");
    window.location.href = "../views_admin/admin_home.html";
  } else {
    alert("¡Inicio de sesión exitoso! Bienvenido a la tienda oficial Audi F1.");
    window.location.href = "../index.html"; // El cliente común es redirigido a la vitrina
  }
}

/* =========================================================
 * MÓDULO DE AUTENTICACIÓN Y SEGURIDAD FRONTEND
 * Evalúa Regex (Expresiones Regulares) en los inputs del usuario
 * y simula Routing basado en Roles.
 * ========================================================= */

// ================== INICIALIZACIÓN Y EVENT LISTENERS ==================
function validarRegistro(evento) {
  evento.preventDefault();

  // Captura de todos los campos del registro
  const rutInput = document.getElementById("rut").value.trim().toUpperCase();
  const correoInput = document.getElementById("correo-reg").value.trim();
  const nombreInput = document.getElementById("nombre").value.trim();
  const apellidosInput = document.getElementById("apellidos").value.trim();
  const passInput = document.getElementById("password-reg").value.trim();
  const passConfInput = document.getElementById("password-conf").value.trim();
  const mensajeError = document.getElementById("registro-error-msg");

  mensajeError.textContent = "";
  mensajeError.classList.add("d-none");

  // 1. Validar RUT (Mínimo 7, Máximo 9, sin puntos ni guión)
  // Usamos una Expresión Regular (Regex) básica para validar que solo haya números y termine en K o número
  const rutRegex = /^[0-9]+[0-9K]$/;
  if (!rutInput || rutInput.length < 7 || rutInput.length > 9 || !rutRegex.test(rutInput)) {
    return mostrarError("RUT inválido. Debe tener entre 7 y 9 caracteres, sin puntos ni guión (Ej: 19011022K).", mensajeError);
  }

  // 2. Validar Correo
  if (!correoInput || correoInput.length > 100) return mostrarError("El correo es obligatorio y máximo 100 caracteres.", mensajeError);

  const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const tieneDominioValido = dominiosValidos.some((dominio) => correoInput.endsWith(dominio));
  if (!tieneDominioValido) return mostrarError("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.", mensajeError);

  // 3. Validar Nombre y Apellidos
  if (!nombreInput || nombreInput.length > 50) return mostrarError("El nombre es obligatorio (Máx. 50 caracteres).", mensajeError);
  if (!apellidosInput || apellidosInput.length > 100) return mostrarError("Los apellidos son obligatorios (Máx. 100 caracteres).", mensajeError);

  // 4. Validar Contraseña y Confirmación
  if (!passInput || passInput.length < 4 || passInput.length > 10) return mostrarError("La contraseña debe tener entre 4 y 10 caracteres.", mensajeError);
  if (passInput !== passConfInput) return mostrarError("Las contraseñas no coinciden. Inténtalo nuevamente.", mensajeError);

  alert("¡Registro exitoso! Bienvenido al Audi F1 Team.");
  document.getElementById("form-registro").reset();

  // Redirigir sutilmente al login
  window.location.href = "login.html";
}

// ================== VALIDACIÓN DE CONTACTO ==================
function validarContacto(evento) {
  evento.preventDefault();

  const nombreInput = document.getElementById("nombre-contacto").value.trim();
  const correoInput = document.getElementById("correo-contacto").value.trim();
  const comentarioInput = document.getElementById("comentario-contacto").value.trim();
  const mensajeError = document.getElementById("contacto-error-msg");

  mensajeError.textContent = "";
  mensajeError.classList.add("d-none");

  // 1. Validar Nombre
  if (!nombreInput || nombreInput.length > 100) return mostrarError("El nombre es obligatorio (Máx. 100 caracteres).", mensajeError);

  // 2. Validar Correo
  if (!correoInput || correoInput.length > 100) return mostrarError("El correo es obligatorio y máximo 100 caracteres.", mensajeError);
  const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const tieneDominioValido = dominiosValidos.some((dominio) => correoInput.endsWith(dominio));
  if (!tieneDominioValido) return mostrarError("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.", mensajeError);

  // 3. Validar Comentario
  if (!comentarioInput || comentarioInput.length > 500) return mostrarError("El comentario es obligatorio (Máx. 500 caracteres).", mensajeError);

  // Éxito
  alert("¡Mensaje enviado a pits! El equipo de soporte te responderá a la brevedad.");
  document.getElementById("form-contacto").reset();
}

// Función auxiliar unificada para inyectar textos de error
function mostrarError(mensaje, elementoHtml) {
  elementoHtml.textContent = mensaje;
  elementoHtml.classList.remove("d-none");
}
