import express from 'express';
import productRouter from "../src/routes/productRoutes.js";
import cartRouter from "../src/routes/cartRoutes.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;

//Middleware
app.use(express.static("./src/public"));

import fs from 'fs';

const obtenerProductosDesdeArchivo = () => {
    try {
        const data = fs.readFileSync('./src/db/productos.json', 'utf-8');
        const productos = JSON.parse(data);
        return productos;
    } catch (error) {
        console.error('Error al leer el archivo de productos:', error);
        return [];
    }
};


// Configurando HandleBars
import exphbs from "express-handlebars";
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para parsear el body como JSON
app.use(express.json());

app.get("/", (req, res) => {
    const products = obtenerProductosDesdeArchivo();
    res.render("home", { products, titulo: "Inicio" });
})

app.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts")
})


app.use('/api/carts', cartRouter);

app.use('/api/products', productRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// Configurando Socket.io
const io = new Server(httpServer);

// Array de productos:

import ProductManager from './managers/productManager.js';
const productManager = new ProductManager("./src/db/productos.json");

io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    // Array de productos enviar:
    socket.emit("productos", await productManager.getProducts());

    // Recibimos el evento "eliminarProducto" desde el cliente:
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        // Enviamos el array de productos actualizado
        socket.emit("productos", await productManager.getProducts());
    })
    // Recibimos el evento "agregarProducto" desde el cliente:
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        socket.emit("productos", await productManager.getProducts());
    })
})

export default app;

