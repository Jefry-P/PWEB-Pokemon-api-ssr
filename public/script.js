
(function () {
  const appState = {
    form: document.querySelector("#search-form"),
    currentEditingName: null,
    isEditing: false,
  };

    window.deletePokemon = async (id) => {

      if (confirm("Are you sure you want to delete this Pokémon?")) {
        try {
          const response = await fetch("/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
          });

          // Verificar si la respuesta fue exitosa
          if (response.ok) {
            // Obtener la nueva versión del HTML
            const html = await response.text();

            // Reemplazar el contenido actual del documento con el nuevo HTML
            document.open();
            document.write(html);
            document.close();
          } else {
            console.error("Error al eliminar el Pokémon:", response.statusText);
          }
        } catch (err) {
          console.error("Error en la solicitud de eliminación:", err);
        }
      }
    };

  window.editMode = (name) => {
    document.getElementById("name").value = name;
    appState.isEditing = true;
    appState.currentEditingName = { name };
    appState.form.querySelector('input[type="submit"]').value =
      "Find and replace";
  };

  const resetForm = () => {
    document.getElementById("name").value = "";
    appState.isEditing = false;
    appState.currentEditingName = null;
    appState.form.querySelector('input[type="submit"]').value = "Search";
  };

appState.form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  const inputs = appState.form.elements;
  const nameInput = inputs["name"];
  const nameValue = nameInput.value.trim(); // Eliminar espacios en blanco

  if (appState.isEditing) {
    console.log("edit")
    try {
      const response = await fetch("/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: appState.currentEditingName,
          newName: nameValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la actualización del Pokémon");
      }

      const html = await response.text();
      document.open();
      document.write(html); // Reemplaza el contenido de la página con la respuesta del servidor
      document.close();
    } catch (e) {
      console.error("Error en la edición:", e);
    }
  } else {
    try {
      const response = await fetch("/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameValue }),
      });

      if (!response.ok) {
        throw new Error("Error en la búsqueda del Pokémon");
      }

      const html = await response.text();
      document.open();
      document.write(html); // Reemplaza el contenido de la página con la respuesta del servidor
      document.close();
    } catch (e) {
      console.error("Fetch error:", e);
    }
  }
  resetForm();
});
})();
