import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// PARA PELÍCULAS:
// Para procesar información del post:
app.get("/peliculas", (req, res) => {
    fs.readFile("peliculas.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer las películas."})
        }
        let peliculas = JSON.parse(data);
        res.json(peliculas);
    })
})


app.post("/peliculas", (req, res) => {
    let {nombre, director, añoestreno} = req.body;
    let peliculaNueva = {
        codigo: uuidv4().slice(0,6),
        nombre,
        director,
        añoestreno
    }
    fs.readFile("peliculas.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer las películas."})
        }
        let peliculas = JSON.parse(data);
        peliculas.peliculas.push(peliculaNueva);

        fs.writeFile("peliculas.json", JSON.stringify(peliculas, null, 4), "utf8", (error) => {
            if(error){
                return res.status(500).json({error:500, message:"Ha ocurrido un error al leer las películas."})
            }
            res.status(201).json(peliculaNueva);
        })
    })
})


// Para usarlo el valor :nombre debe ser escrito en la URL como, por ejemplo: /estudiantes/daniel
app.delete("/peliculas/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    console.log("Borrando película con nombre:", nombre);
    fs.readFile("peliculas.json", "utf8", (error, data) => {
      if (error) {
        return res.status(500).json({ error: 500, message: "Ha ocurrido un error al leer las películas." });
      }
  
      const peliculas = JSON.parse(data);
      console.log("Matriz de películas actuales:", peliculas);
      const peliculaIndex = peliculas.peliculas.findIndex(pelicula => pelicula.nombre === nombre);
  
      if (peliculaIndex === -1) {
        return res.status(404).json({ error: 404, message: "La película no ha sido encontrada." });
      }
  
      peliculas.peliculas.splice(peliculaIndex, 1);
  
      fs.writeFile("peliculas.json", JSON.stringify(peliculas, null, 4), "utf8", (error) => {
        if (error) {
          return res.status(500).json({ error: 500, message: "Ha ocurrido un error al escribir las películas." });
        }
        res.sendStatus(204);
      });
    });
});
  


// PARA SERIES:
app.get("/series", (req, res) => {
    fs.readFile("series.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer las series."})
        }
        let series = JSON.parse(data);
        res.json(series);
    })
})


app.post("/series", (req, res) => {
    let {nombre, director, añoestreno, temporadas} = req.body;
    let serieNueva = {
        codigo: uuidv4().slice(0,6),
        nombre,
        director,
        añoestreno,
        temporadas
    }
    fs.readFile("series.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer las series."})
        }
        let series = JSON.parse(data);
        series.series.push(serieNueva);

        fs.writeFile("series.json", JSON.stringify(series, null, 4), "utf8", (error) => {
            if(error){
                return res.status(500).json({error:500, message:"Ha ocurrido un error al leer las series."})
            }
            res.status(201).json(serieNueva);
        })
    })
})


// Para usarlo el valor :nombre debe ser escrito en la URL como, por ejemplo: /estudiantes/daniel
app.delete("/series/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    console.log("Borrando serie con nombre:", nombre);
    fs.readFile("series.json", "utf8", (error, data) => {
      if (error) {
        return res.status(500).json({ error: 500, message: "Ha ocurrido un error al leer las series." });
      }
  
      const series = JSON.parse(data);
      console.log("Matriz de series actuales:", series);
      const serieIndex = series.series.findIndex(serie => serie.nombre === nombre);
  
      if (serieIndex === -1) {
        return res.status(404).json({ error: 404, message: "La serie no ha sido encontrada." });
      }
  
      series.series.splice(serieIndex, 1);
  
      fs.writeFile("series.json", JSON.stringify(series, null, 4), "utf8", (error) => {
        if (error) {
          return res.status(500).json({ error: 500, message: "Ha ocurrido un error al escribir las series." });
        }
        res.sendStatus(204);
      });
    });
});





//
app.all("*", (req, res) => {
    res.status(404).send({code: 404, message: "Ruta no habilitada"});
})

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"))

