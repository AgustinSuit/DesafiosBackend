import express from 'express';
import productRouter from "../src/routes/productRoutes.js";
import cartRouter from "../src/routes/cartRoutes.js";

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

app.use('/api/carts', cartRouter);

app.use('/api/products', productRouter);

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

export default app;

