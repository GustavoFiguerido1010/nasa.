document.addEventListener("DOMContentLoaded", function () {
  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");
  const btnBorrar = document.getElementById("btnBorrar");
  const contenedor = document.getElementById("contenedor");
  const listaImagenes = document.getElementById("listaImagenes");

  btnBuscar.addEventListener("click", function () {
    const query = inputBuscar.value.trim();

    if (query !== "") {
      const apiUrl = `https://images-api.nasa.gov/search?q=${query}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Limpia el contenedor antes de mostrar nuevos resultados
          listaImagenes.innerHTML = "";

          if (data.collection && data.collection.items.length > 0) {
            data.collection.items.forEach((item) => {
              if (item.links && item.links.length > 0) {
                const imageUrl = item.links[0].href;
                const title = item.data[0].title || "Sin título";
                const description = item.data[0].description || "Sin descripción";
                const dateCreated = item.data[0].date_created || "Sin fecha";

                const listItem = document.createElement("li"); // Crea un elemento de lista
                const img = document.createElement("img");
                img.src = imageUrl;

                // Crea un div para mostrar la información de la imagen
                const infoDiv = document.createElement("div");
                infoDiv.className = "imagen-info";
                infoDiv.innerHTML = `
                  <h2>${title}</h2>
                  <p>${description}</p>
                  <p>Fecha: ${dateCreated}</p>
                `;

                // Agrega el elemento de imagen y el div de información a la lista de imágenes
                listItem.appendChild(img);
                listItem.appendChild(infoDiv);
                listaImagenes.appendChild(listItem); // Agrega el elemento de lista a la lista ordenada
              }
            });
          } else {
            listaImagenes.innerHTML = "No se encontraron imágenes.";
          }
          
        })
        // Actualiza la URL para que aparezca el texto que se busca
        history.pushState({}, "", `?q=${query}`)

        .catch((error) => {
          console.error("Error al buscar imágenes:", error);
        });
    }
    function onBuscarClick() {
      const query = inputBuscar.value.trim();

      if (query !== "") {
          buscarYActualizarURL(query);
      }
  }

  // Agregar un evento click al botón de búsqueda
  btnBuscar.addEventListener("click", onBuscarClick);

  // Esto maneja el evento de navegación hacia atrás
  window.addEventListener("popstate", function () {
    
      // Obtiene el texto de búsqueda desde la URL al cargar la página
      const queryParams = new URLSearchParams(window.location.search);
      const queryParam = queryParams.get("q");
      if (queryParam) {
          inputBuscar.value = queryParam;
          buscarYActualizarURL(queryParam);
      }
  });

  });
  
// Borrar busqueda
  btnBorrar.addEventListener("click", function () {
    inputBuscar.value = "";
    listaImagenes.innerHTML = "";
    history.pushState({}, "", "/");
  });
});
 
  