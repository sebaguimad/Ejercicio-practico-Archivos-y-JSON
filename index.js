import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


// Para procesar información del post:

app.get("/estudiantes", (req, res) => {
    fs.readFile("estudiantes.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los estudiantes."})
        }
        let estudiantes = JSON.parse(data);
        res.json(estudiantes);
    })
})



app.post("/estudiantes", (req, res) => {
    let {nombre, institucion} = req.body;
    let estudianteNuevo = {
        codigo: uuidv4().slice(0,6),
        nombre,
        institucion,
    }
    fs.readFile("estudiantes.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los estudiantes."})
        }
        let estudiantes = JSON.parse(data);
        estudiantes.estudiantes.push(estudianteNuevo);

        fs.writeFile("estudiantes.json", JSON.stringify(estudiantes, null, 4), "utf8", (error) => {
            if(error){
                return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los estudiantes."})
            }
            res.status(201).json(estudianteNuevo);
        })
    })
})


// Para usarlo el valor :nombre debe ser escrito en la URL como, por ejemplo: /estudiantes/daniel
app.delete("/estudiantes/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    console.log("Deleting student with name:", nombre);
    fs.readFile("estudiantes.json", "utf8", (error, data) => {
      if (error) {
        return res.status(500).json({ error: 500, message: "Ha ocurrido un error al leer los estudiantes." });
      }
  
      const estudiantes = JSON.parse(data);
      console.log("Current estudiantes array:", estudiantes);
      const estudianteIndex = estudiantes.estudiantes.findIndex(estudiante => estudiante.nombre === nombre);
  
      if (estudianteIndex === -1) {
        return res.status(404).json({ error: 404, message: "El estudiante no ha sido encontrado." });
      }
  
      estudiantes.estudiantes.splice(estudianteIndex, 1);
  
      fs.writeFile("estudiantes.json", JSON.stringify(estudiantes, null, 4), "utf8", (error) => {
        if (error) {
          return res.status(500).json({ error: 500, message: "Ha ocurrido un error al escribir los estudiantes." });
        }
        res.sendStatus(204);
      });
    });
});
  



app.all("*", (req, res) => {
    res.status(404).send({code: 404, message: "Ruta no habilitada"});
})

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"))

