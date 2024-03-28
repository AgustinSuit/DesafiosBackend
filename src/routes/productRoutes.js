import express from 'express';
import ProductManager from '../managers/productManager.js';

// Manejo de productos
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
        const productManager = new ProductManager('./src/db/productos.json');
        let products = await productManager.getProducts();

        const limit = req.query.limit;
        if (limit) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});

productRouter.get('/:pid', async (req, res) => {
    try {
        const productManager = new ProductManager('./src/db/productos.json');
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            res.status(404).send('Producto no encontrado.');
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).send('Error al obtener el producto.');
    }
});

productRouter.post('/', async (req, res, next) => {
    try {
        const newProduct = req.body;
        console.log('Nuevo producto recibido:', newProduct); // Verifica los datos recibidos desde la solicitud

        const productManager = new ProductManager('./src/db/productos.json');
        const respuesta = productManager.addProduct(newProduct);

        if (respuesta.status) {
            console.log('Producto agregado correctamente con id:', respuesta.msg); // Confirmar que se agregó el producto correctamente
            return res.status(201).json({ status: true, msg: `Producto agregado correctamente con id ${respuesta.msg}` });
        } else {
            console.error('Error al agregar el producto:', respuesta.msg); // Imprime cualquier error que ocurra
            return res.status(400).json({ status: false, msg: respuesta.msg });
        }
    } catch (error) {
        next(error); // Pasar el error al middleware de manejo de errores global
    }
});


productRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;

        const productManager = new ProductManager('./src/db/productos.json');
        productManager.updateProduct(productId, updatedFields);

        res.send(`Producto con ID ${productId} actualizado correctamente.`);
    } catch (error) {
        res.status(500).send('Error al actualizar el producto.');
    }
});

productRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const productManager = new ProductManager('./src/db/productos.json');
        productManager.deleteProduct(productId);
        res.send(`Producto con ID ${productId} eliminado correctamente.`);
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
});

export default productRouter;