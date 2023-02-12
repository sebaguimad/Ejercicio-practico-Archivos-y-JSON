import express from 'express';
import fs from 'fs';
import cors from 'cors';


const app = express();
app.use(cors())



app.get("/productos", (req, res)=>{
    fs.readFile("productos.json", "utf8", (error, data)=>{
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los productos."})
        }
        let productos = JSON.parse(data);
        res.json(productos);
    })
})


app.all("*", (req,res)=>{
    res.status(404).send({code: 404, message: "Ruta no habilitada"});
})


app.listen(3000, ()=>console.log("Servidor escuchando en http://localhost:3000"))

