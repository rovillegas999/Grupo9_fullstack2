const datosUbicacion = [
  {
    region: "Región Metropolitana",
    comunas: ["Santiago", "Providencia", "Maipú", "Puente Alto"],
  },
  {
    region: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué"],
  },
  {
    region: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Los Ángeles"],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const selectRegion = document.getElementById("regionRegistro");
  const selectComuna = document.getElementById("comunaRegistro");
  const formRegistro = document.getElementById("form-registro");

  if (selectRegion && selectComuna) {
    datosUbicacion.forEach((dato) => {
      const opcion = document.createElement("option");
      opcion.value = dato.region;
      opcion.textContent = dato.region;
      selectRegion.appendChild(opcion);
    });

    selectRegion.addEventListener("change", (evento) => {
      const regionSeleccionada = evento.target.value;

      selectComuna.innerHTML =
        '<option value="">-- Seleccione comuna --</option>';

      if (regionSeleccionada === "") {
        selectComuna.disabled = true;
      } else {
        selectComuna.disabled = false;
        const datosRegion = datosUbicacion.find(
          (d) => d.region === regionSeleccionada,
        );

        datosRegion.comunas.forEach((comuna) => {
          const opcion = document.createElement("option");
          opcion.value = comuna;
          opcion.textContent = comuna;
          selectComuna.appendChild(opcion);
        });
      }
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const passInput = document.getElementById("passRegistro");
      const passConfirmaInput = document.getElementById("passConfirma");
      const passError = document.getElementById("passError");
      const passConfirmaError = document.getElementById("passConfirmaError");

      let esValido = true;

      passError.classList.add("d-none");
      passConfirmaError.classList.add("d-none");

      if (passInput.value.length < 4 || passInput.value.length > 10) {
        passError.textContent = "Debe tener entre 4 y 10 caracteres.";
        passError.classList.remove("d-none");
        esValido = false;
      }

      if (passInput.value !== passConfirmaInput.value) {
        passConfirmaError.textContent = "Las contraseñas no coinciden.";
        passConfirmaError.classList.remove("d-none");
        esValido = false;
      }

      if (esValido) {
        alert("¡Registro validado exitosamente!");
      }
    });
  }
});
