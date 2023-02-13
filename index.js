import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());


// Para procesar información del post:

app.get("/productos", (req, res) => {
    fs.readFile("productos.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los productos."})
        }
        let productos = JSON.parse(data);
        res.json(productos);
    })
})

app.post("/productos", (req, res) => {
    let {nombre, existencias, precio, imagen} = req.body;
    let productoNuevo = {
        codigo: uuidv4().slice(0,6),
        nombre,
        existencias,
        precio,
        imagen
    }
    fs.readFile("productos.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los productos."})
        }
        let productos = JSON.parse(data);
        productos.productos.push(productoNuevo);

        fs.writeFile("productos.json", JSON.stringify(productos, null, 4), "utf8", (error) => {
            if(error){
                return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los productos."})
            }
            res.status(201).json(productoNuevo);
        })
    })

})

app.all("*", (req, res) => {
    res.status(404).send({code: 404, message: "Ruta no habilitada"});
})

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"))

