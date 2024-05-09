import express from 'express';
import productRouter from "../src/routes/productRoutes.js";
import cartRouter from "../src/routes/cartRoutes.js";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import Message from './dao/models/messageModel.js';
import Product from './dao/models/productModel.js';

const app = express();
const PORT = 8080;


//Middleware
app.use(express.static("./src/public"));

import fs from 'fs';

// Configurando HandleBars
import exphbs from "express-handlebars";
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para parsear el body como JSON
app.use(express.json());

app.get("/", async (req, res) => {
    // Carga los productos usando ProductManager
    const products = await productManager.getProducts();
    res.render("home", { products, titulo: "Inicio" });
});

app.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts")
})

app.get("/chat", (req, res) => {
    res.render("chat");
});

app.get("/products", async (req, res) => {
    const page = req.query.page || 1;
    let limit = 2;
    try {
        const productos = await Product.paginate({}, { limit, page });

        // Forma rustica de arreglarlo (sin el lean())
        const productosResultadoFinal = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        })

        res.render("products", {
            productos: productosResultadoFinal,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });
    } catch (error) {
        res.status(500).send("Error en el servidor, en la UTN enseñan diseño")
    }
})


app.use('/api/carts', cartRouter);

app.use('/api/products', productRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// Configurando Socket.io
const io = new Server(httpServer);

// Array de productos:

import ProductManager from './dao/productManager.js';
const productManager = new ProductManager("./src/dao/db/productos.json");

io.on("connection", async (socket) => {
    console.log("Cliente conectado");

    // Array de productos enviar:
    socket.emit("productos", await productManager.getProducts());
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

    // Manejar el evento 'message'
    socket.on('message', async (message) => {
        // Guardar el mensaje en la base de datos MongoDB
        try {
            await Message.create({ user: socket.id, message });
            // Emitir el mensaje a todos los clientes conectados
            io.emit('message', message);
        } catch (error) {
            console.error('Error al guardar el mensaje en MongoDB:', error);
        }
    });

})

// URL de conexión a tu base de datos MongoDB
const DB_URI = "mongodb+srv://AgustinSuit:PruebaCoder@cluster0.bm7895k.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

// Conexión a la base de datos
mongoose.connect(DB_URI)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((error) => console.error('Error de conexión a MongoDB:', error));

export default app;

