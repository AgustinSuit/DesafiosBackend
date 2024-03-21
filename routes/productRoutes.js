import express from 'express';
import ProductManager from '../productManager.js';

// Manejo de productos
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
    try {
        const productManager = new ProductManager('./productos.json');
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
        const productManager = new ProductManager('./productos.json');
        const productId = parseInt(req.params.pid);
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

productRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        console.log('Nuevo producto recibido:', newProduct); // Verifica los datos recibidos desde la solicitud

        const productManager = new ProductManager('./productos.json');
        productManager.addProduct(newProduct);
        
        console.log('Producto agregado correctamente.'); // Confirmar que se agregó el producto correctamente
        res.send('Producto agregado correctamente.');
    } catch (error) {
        console.error('Error al agregar el producto:', error); // Imprime cualquier error que ocurra
        res.status(500).send('Error al agregar el producto.');
    }
});

productRouter.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;

        const productManager = new ProductManager('./productos.json');
        productManager.updateProduct(productId, updatedFields);

        res.send(`Producto con ID ${productId} actualizado correctamente.`);
    } catch (error) {
        res.status(500).send('Error al actualizar el producto.');
    }
});

productRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const productManager = new ProductManager('./productos.json');
        productManager.deleteProduct(productId);
        res.send(`Producto con ID ${productId} eliminado correctamente.`);
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
});

export default productRouter;