import express from 'express';
import productRouter from "../src/routes/productRoutes.js";
import cartRouter from "../src/routes/cartRoutes.js";

const app = express();
const PORT = 8080;

// Middleware para parsear el body como JSON
app.use(express.json());

app.use('/api/carts', cartRouter);

app.use('/api/products', productRouter);

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

export default app;

