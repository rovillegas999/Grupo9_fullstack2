/* =========================================================
   LÓGICA DE VALIDACIÓN EXCLUSIVA PARA EL MANTENEDOR ADMIN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const formProducto = document.getElementById("form-admin-producto");

  if (formProducto) {
    formProducto.addEventListener("submit", validarProductoAdmin);
  }
});

function validarProductoAdmin(evento) {
  evento.preventDefault();

  const inputNombre = document.getElementById("prod-nombre").value.trim();
  const inputPrecio = document.getElementById("prod-precio").value;
  const inputDescuento = document.getElementById("prod-descuento").value;
  const inputImagen = document.getElementById("prod-imagen").value;

  const cajaError = document.getElementById("admin-producto-error");

  cajaError.textContent = "";
  cajaError.classList.add("d-none");

  // 1. Validar Nombre
  if (!inputNombre || inputNombre.length > 100) {
    return mostrarErrorAdmin("El nombre del producto es obligatorio y no debe exceder los 100 caracteres.", cajaError);
  }

  // 2. Validar Precio (> 0)
  const precio = Number(inputPrecio);
  if (!inputPrecio || isNaN(precio) || precio <= 0) {
    return mostrarErrorAdmin("El precio es obligatorio y debe ser mayor a 0.", cajaError);
  }

  // 3. Validar Descuento (Mínimo 0, Máximo 100)
  if (inputDescuento) {
    // El descuento puede estar vacío, pero si tiene valor, se valida
    const descuento = Number(inputDescuento);
    if (isNaN(descuento) || descuento < 0 || descuento > 100) {
      return mostrarErrorAdmin("Si aplica un descuento, debe ser un valor entre 0 y 100.", cajaError);
    }
  }

  // 4. Validar Imagen
  if (!inputImagen) {
    return mostrarErrorAdmin("Debe adjuntar una imagen obligatoriamente para el producto.", cajaError);
  }

  // Éxito
  alert("¡Producto guardado exitosamente en el catálogo!");
  document.getElementById("form-admin-producto").reset();
}

// ---------------- VALIDACIONES USUARIO (ADMIN) ----------------
document.addEventListener("DOMContentLoaded", () => {
  const formUsuario = document.getElementById("form-admin-usuario");
  if (formUsuario) {
    formUsuario.addEventListener("submit", validarUsuarioAdmin);
  }
});

// Valida RUT chileno sin puntos ni guión (cuerpo + dígito verificador)
function rutEsValido(rut) {
  if (!/^[0-9]+[0-9K]$/.test(rut) || rut.length < 7 || rut.length > 9) return false;

  const cuerpo = rut.slice(0, -1);
  const dvIngresado = rut.slice(-1);

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : resto.toString();

  return dvEsperado === dvIngresado;
}

function validarUsuarioAdmin(evento) {
  evento.preventDefault();

  const rutInput = document.getElementById("usr-rut").value.trim().toUpperCase();
  const nombreInput = document.getElementById("usr-nombre").value.trim();
  const correoInput = document.getElementById("usr-correo").value.trim();
  const rolInput = document.getElementById("usr-rol").value;
  const passInput = document.getElementById("usr-pass").value.trim();

  const cajaError = document.getElementById("admin-usuario-error");

  cajaError.textContent = "";
  cajaError.classList.add("d-none");

  // Validar RUT (formato + dígito verificador)
  if (!rutInput || !rutEsValido(rutInput)) {
    return mostrarErrorAdmin("RUT inválido. Debe tener entre 7 y 9 caracteres, sin puntos ni guión, y un dígito verificador correcto (Ej: 19011022K).", cajaError);
  }

  // Validar Nombre
  if (!nombreInput || nombreInput.length > 100) {
    return mostrarErrorAdmin("El nombre es obligatorio (Máx. 100 caracteres).", cajaError);
  }

  // Validar Correo y Dominios
  const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  if (!correoInput || !dominiosValidos.some((dominio) => correoInput.endsWith(dominio))) {
    return mostrarErrorAdmin("Correo inválido. Solo dominios autorizados (@duoc.cl, @profesor.duoc.cl, @gmail.com).", cajaError);
  }

  // Validar Rol
  if (!rolInput || rolInput === "Selecciona el rol en el sistema...") {
    return mostrarErrorAdmin("Debe asignar obligatoriamente un nivel de acceso (Rol).", cajaError);
  }

  // Validar Contraseña (Como es nuevo usuario, debe tener password)
  if (!passInput || passInput.length < 4 || passInput.length > 10) {
    return mostrarErrorAdmin("La contraseña debe tener entre 4 y 10 caracteres.", cajaError);
  }

  alert("¡Usuario almacenado exitosamente en el directorio!");
  document.getElementById("form-admin-usuario").reset();
}

function mostrarErrorAdmin(mensaje, elemento) {
  // Le inyectamos icono de bootstrap para mantener el diseño
  elemento.innerHTML = `<i class="bi bi-exclamation-octagon-fill me-2"></i> ${mensaje}`;
  elemento.classList.remove("d-none");
}
