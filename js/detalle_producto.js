/* =========================================================
   FICHA DE DETALLE DE PRODUCTO
   Toma el id del parámetro ?id= de la URL y rellena la vista
   con los datos del arreglo "productos" definido en carrito.js.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"), 10);
  const producto = productos.find((prod) => prod.id === id) || productos[0];

  document.getElementById("det-img").src = imgPath + producto.archivo;
  document.getElementById("det-img").alt = producto.nombre;
  document.getElementById("det-nombre").textContent = producto.nombre;
  document.getElementById("det-breadcrumb-nombre").textContent = producto.nombre;
  document.getElementById("det-categoria").textContent = producto.categoria;
  document.getElementById("det-precio").textContent = "$" + producto.precio.toLocaleString("es-CL");
  document.title = producto.nombre + " - Audi F1 Store";

  const botonComprar = document.getElementById("det-btn");
  botonComprar.dataset.accion = "agregar";
  botonComprar.dataset.id = producto.id;
});
