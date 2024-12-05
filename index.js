const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const baseURL = "https://pokeapi.co/api/v2/pokemon";

const PORT = process.env.PORT || 3000;

const app = express();

let pokemonList = [];

app.set("view engine", "pug"); //manejador de plantillas html
app.set("views", path.join(__dirname, "views")); //path añade correctamente separator, funciona sin importar pplataforma
app.use(express.static("public")); // Para servir archivos estáticos (CSS, JS)
app.use(bodyParser.json()); // Para manejar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { pokemonList: pokemonList });
});

app.post("/search", async (req, res) => {
  const { name } = req.body;

  // Verifica si el Pokémon ya está en la lista
  if (pokemonList.find((pokemon) => pokemon.name === name)) {
    return res.render("index", {
      pokemonList: pokemonList,
      error: "El Pokémon ya se encuentra en la lista",
    });
  }

  try {
    const response = await fetch(`${baseURL}/${name}`);
    const data = await response.json();

    let id = data.id;
    let img = data.sprites.other["official-artwork"].front_default;
    const types = [];
    data.types.forEach((element) => {
      types.push(element.type.name);
    });

    pokemonList.push({ id, name: data.name, img, types });
    return res.render("index", { pokemonList: pokemonList });
  } catch (error) {
    return res.render("index", {
      pokemonList: pokemonList,
      error: "No se encontró ningún Pokémon con ese nombre",
    });
  }
});

app.put("/edit", async (req, res) => {
  const { name, newName } = req.body;
  console.log("edit");


  let pokemon = pokemonList.find((pok) => pok.name === name.name);
  console.log(pokemon);

  if (pokemon) {
    try {
      const response = await fetch(`${baseURL}/${newName}`);
      const data = await response.json();

      let id = data.id;
      let img = data.sprites.other["official-artwork"].front_default;
      const types = [];
      data.types.forEach((element, index) => {
        types.push(element.type.name);
      });

      pokemonList.push({ id, name: data.name, img, types }); //agregando nuevo
      pokemonList = [
        ...pokemonList.filter((pok) => pok.name !== pokemon.name), //borrando antiguo
      ];

      return res.render("index", { pokemonList: pokemonList, error: null });
    } catch (error) {
      console.log(error);
      return res.render("index", {
        pokemonList: pokemonList,
        error: "No se encontró ningún Pokémon con ese nombre",
      });
    }
  } else{
    return res.render("index", {
      pokemonList: pokemonList,
      error: "No se encontró ningún Pokémon con ese nombre en la lista",
    });
  }
});

app.delete("/delete", async (req, res) => {
  const { id } = req.body;
  let pokemon = pokemonList.find((pok) => pok.id === id);
  try {
    
    pokemonList = [
      ...pokemonList.filter((pok) => pok.name !== pokemon.name), //borrando antiguo
    ];

    return res.render("index", { pokemonList: pokemonList, error: null });
  } catch (error) {
    return res.render("index", {
      pokemonList: pokemonList,
      error: "No se encontró ningún Pokémon con ese nombre",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
