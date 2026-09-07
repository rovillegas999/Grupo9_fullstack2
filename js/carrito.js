/* =========================================================
   CARRITO DE COMPRAS
   Guarda los productos en localStorage y arma el HTML del
   catálogo, la burbuja y la página del carrito.
========================================================= */

// Listado de productos de la tienda (datos fijos para el front)
const productos = [
  { id: 1, nombre: "Chaqueta Oficial F1", categoria: "Chaquetas", precio: 120000, archivo: "Chaqueta_1.jpeg" },
  { id: 2, nombre: "Conjunto Deportivo F1", categoria: "Ropa", precio: 85000, archivo: "Conjunto_1.jpeg" },
  { id: 3, nombre: "Gorra Negra Audi F1", categoria: "Gorras", precio: 35000, archivo: "Gorra1.jpeg" },
  { id: 4, nombre: "Gorra Edición Especial", categoria: "Gorras", precio: 40000, archivo: "Gorra2.jpeg" },
  { id: 5, nombre: "Gorra Clásica Audi F1", categoria: "Gorras", precio: 35000, archivo: "Gorra3.jpeg" },
  { id: 6, nombre: "Llavero Metálico F1", categoria: "Accesorios", precio: 15000, archivo: "Llavero_1.jpeg" },
  { id: 7, nombre: "Polera Tipo 1 - A", categoria: "Poleras", precio: 45000, archivo: "Polera_Tipo1_1.jpeg" },
  { id: 8, nombre: "Polera Tipo 1 - B", categoria: "Poleras", precio: 45000, archivo: "Polera_Tipo1_2.jpeg" },
  { id: 9, nombre: "Polera Tipo 1 - C", categoria: "Poleras", precio: 45000, archivo: "Polera_Tipo1_3.jpeg" },
  { id: 10, nombre: "Polera Tipo 2 - A", categoria: "Poleras", precio: 50000, archivo: "Polera_Tipo2_1.jpeg" },
  { id: 11, nombre: "Polera Tipo 2 - B", categoria: "Poleras", precio: 50000, archivo: "Polera_Tipo2_2.jpeg" },
  { id: 12, nombre: "Polera Tipo 2 - C", categoria: "Poleras", precio: 50000, archivo: "Polera_Tipo2_3.jpeg" },
];

let carrito = JSON.parse(localStorage.getItem("carritoTienda")) || [];

// Cupones válidos y su porcentaje de descuento
const CUPONES = { F1AUDI: 10, NEUBURG2026: 15 };
let descuentoActivo = 0;

// Ajusta la ruta de las imágenes según si la página está en la raíz o en views_tienda/
const esSubcarpeta = window.location.pathname.includes("views_tienda");
const imgPath = esSubcarpeta ? "../img/" : "img/";

document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();
  actualizarContadorCarrito();
  renderizarPaginaCarrito();

  // Delegación de eventos: cubre botones estáticos y los generados dinámicamente
  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;

    switch (boton.dataset.accion) {
      case "agregar":
        agregarAlCarrito(Number(boton.dataset.id));
        break;
      case "eliminar":
        eliminarDelCarrito(Number(boton.dataset.index));
        break;
      case "aplicar-cupon":
        aplicarCupon();
        break;
      case "pagar":
        pagarCarrito();
        break;
    }
  });
});

function renderizarProductos() {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  productos.forEach((producto) => {
    // Construimos la ruta dinámica de la imagen
    const rutaImagen = imgPath + producto.archivo;
    const base = esSubcarpeta ? "detalle_producto.html" : "views_tienda/detalle_producto.html";
    const linkDetalle = `${base}?id=${producto.id}`;

    const tarjetaHTML = `
            <div class="col-12 col-md-6 col-lg-3">
                <article class="card h-100 border-0 shadow-sm rounded-0">
                    <a href="${linkDetalle}">
                      <img src="${rutaImagen}" class="card-img-top rounded-0 border-bottom" alt="${producto.nombre}">
                    </a>
                    <div class="card-body d-flex flex-column text-center p-4">
                        <a href="${linkDetalle}" class="text-decoration-none">
                          <h5 class="card-title text-dark text-uppercase fw-bold producto-card-title">${producto.nombre}</h5>
                        </a>
                        <p class="card-text text-muted mb-2">${producto.categoria}</p>
                        <p class="fw-bold text-danger mb-3 producto-card-precio">$${producto.precio.toLocaleString("es-CL")}</p>
                        <button class="btn btn-dark w-100 mt-auto rounded-0 fw-bold" data-accion="agregar" data-id="${producto.id}">AÑADIR AL CARRITO</button>
                    </div>
                </article>
            </div>
        `;
    contenedor.innerHTML += tarjetaHTML;
  });
}

function agregarAlCarrito(idProducto) {
  const productoSeleccionado = productos.find((prod) => prod.id === idProducto);
  carrito.push(productoSeleccionado);
  localStorage.setItem("carritoTienda", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarPaginaCarrito();

  alert(`¡${productoSeleccionado.nombre} añadido al carrito!`);
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  const burbuja = document.getElementById("lista-carrito-burbuja");
  if (contador) contador.textContent = carrito.length;

  if (burbuja) {
    burbuja.innerHTML = "";
    if (carrito.length === 0) {
      burbuja.innerHTML = `<p class="text-muted text-center mt-4">Tu canasta está vacía</p>`;
    } else {
      carrito.forEach((prod) => {
        const rutaImagen = imgPath + prod.archivo;
        burbuja.innerHTML += `
          <div class="d-flex align-items-center mb-3">
            <img src="${rutaImagen}" alt="${prod.nombre}" class="img-thumbnail bg-dark border-secondary me-3 carrito-burbuja-img">
            <div>
              <h6 class="mb-0 text-white carrito-burbuja-title text-uppercase">${prod.nombre}</h6>
              <span class="text-danger fw-bold">$${prod.precio.toLocaleString("es-CL")}</span>
            </div>
          </div>
        `;
      });
    }
  }
}

function renderizarPaginaCarrito() {
  const contenedor = document.getElementById("items-carrito-page");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-secondary text-center p-5 rounded-0 border-0">
        <h4 class="text-uppercase fw-bold mb-3">Tu carrito está vacío</h4>
        <p class="mb-4">Aún no has agregado merchandising de Audi F1 a tu orden.</p>
        <a href="productos.html" class="btn btn-dark rounded-0 fw-bold px-4 py-2">VER CATÁLOGO</a>
      </div>
    `;
    document.getElementById("subtotal-carrito").textContent = "$0";
    document.getElementById("total-carrito").textContent = "$0";
    return;
  }

  carrito.forEach((prod, index) => {
    total += prod.precio;
    const rutaImagen = imgPath + prod.archivo;

    contenedor.innerHTML += `
      <div class="d-flex align-items-center mb-3 p-3 bg-white shadow-sm border border-light">
        <img src="${rutaImagen}" alt="${prod.nombre}" class="me-4 border carrito-tabla-img">
        <div class="flex-grow-1">
          <h5 class="mb-1 text-uppercase fw-bold">${prod.nombre}</h5>
          <p class="text-muted mb-0">${prod.categoria}</p>
        </div>
        <div class="text-end me-4">
          <h5 class="fw-bold mb-0 text-danger">$${prod.precio.toLocaleString("es-CL")}</h5>
        </div>
        <button class="btn btn-outline-danger border-0 fw-bold" data-accion="eliminar" data-index="${index}">
          🗑️ ELIMINAR
        </button>
      </div>
    `;
  });

  const totalConDescuento = total - Math.round((total * descuentoActivo) / 100);

  document.getElementById("subtotal-carrito").textContent = `$${total.toLocaleString("es-CL")}`;
  document.getElementById("total-carrito").textContent = `$${totalConDescuento.toLocaleString("es-CL")}`;
}

function aplicarCupon() {
  const input = document.getElementById("cupon");
  if (!input) return;

  const codigo = input.value.trim().toUpperCase();

  if (carrito.length === 0) {
    alert("Agrega productos al carrito antes de aplicar un cupón.");
    return;
  }

  if (CUPONES[codigo]) {
    descuentoActivo = CUPONES[codigo];
    alert(`Cupón "${codigo}" aplicado: ${descuentoActivo}% de descuento.`);
  } else {
    descuentoActivo = 0;
    alert("El cupón ingresado no es válido.");
  }

  renderizarPaginaCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carritoTienda", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarPaginaCarrito();
}

function pagarCarrito() {
  if (carrito.length === 0) {
    alert("¡Tu carrito está vacío! Agrega productos antes de pagar.");
    return;
  }
  alert("¡Compra exitosa! Gracias por apoyar al Audi F1 Team.");
  carrito = [];
  descuentoActivo = 0;
  localStorage.removeItem("carritoTienda");
  actualizarContadorCarrito();
  renderizarPaginaCarrito();
}
