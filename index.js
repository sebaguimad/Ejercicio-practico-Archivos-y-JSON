const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const { response } = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));


// PARA CLIENTES:
// Para procesar información del post:
app.get("/clientes", (req, res) => {
    fs.readFile("clientes.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los clientes."})
        }
        let clientes = JSON.parse(data);
        res.json(clientes);
    })
})


app.post("/clientes", (req, res) => {
    let {id, nombre, apellido, cuentaahorro} = req.body;
    let clienteNuevo = {
        codigo: uuidv4().slice(0,6),
        id,
        nombre,
        apellido,
        cuentaahorro
    }
    fs.readFile("clientes.json", "utf8", (error, data) => {
        if(error){
            return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los clientes."})
        }
        let clientes = JSON.parse(data);
        clientes.clientes.push(clienteNuevo);

        fs.writeFile("clientes.json", JSON.stringify(clientes, null, 4), "utf8", (error) => {
            if(error){
                return res.status(500).json({error:500, message:"Ha ocurrido un error al leer los clientes."})
            }
            res.status(201).json(clienteNuevo);
        })
    })
})

app.delete("/clientes/:id", (req, res) => {
    const id = req.params.id;
    console.log("Borrando cliente con id:", id);
    fs.readFile("clientes.json", "utf8", (error, data) => {
      if (error) {
        return res.status(500).json({ error: 500, message: "Ha ocurrido un error al leer los clientes." });
      }
  
      const clientes = JSON.parse(data);
      console.log("Matriz de clientes actuales:", clientes);
      const clienteIndex = clientes.clientes.findIndex(cliente => cliente.id === id);
  
      if (clienteIndex === -1) {
        return res.status(404).json({ error: 404, message: "El cliente no ha sido encontrado." });
      }
  
      const cliente = clientes.clientes[clienteIndex];
      clientes.clientes.splice(clienteIndex, 1);
  
      fs.writeFile("clientes.json", JSON.stringify(clientes, null, 4), "utf8", (error) => {
        if (error) {
          return res.status(500).json({ error: 500, message: "Ha ocurrido un error al escribir los clientes." });
        }
        console.log("Cliente eliminado:", cliente);
        res.json(cliente);
      });
    });
});
  

app.delete('/clientes/:id/cuentaahorro', (req, res) => {
  const id = req.params.id;
  console.log("Eliminando cuenta de ahorro del cliente con id:", id);
  fs.readFile("clientes.json", "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ error: 500, message: "Ha ocurrido un error al leer los clientes." });
    }

    const clientes = JSON.parse(data);
    console.log("Matriz de clientes actuales:", clientes);
    const cliente = clientes.clientes.find(cliente => cliente.id === id);

    if (!cliente) {
      return res.status(404).json({ error: 404, message: "El cliente no ha sido encontrado." });
    }

    cliente.cuentaahorro = "";
    fs.writeFile("clientes.json", JSON.stringify(clientes, null, 4), "utf8", (error) => {
      if (error) {
        return res.status(500).json({ error: 500, message: "Ha ocurrido un error al escribir los clientes." });
      }
      console.log("Cuenta de ahorro eliminada del cliente con id:", id);
      res.redirect('/clientes');
    });
  });
});



  
  
  


//
app.all("*", (req, res) => {
    res.status(404).send({code: 404, message: "Ruta no habilitada"});
})

app.listen(3000, () => console.log("Servidor escuchando en http://localhost:3000"))

