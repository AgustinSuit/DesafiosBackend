import express from 'express';
import ProductManager from '../productManager.js';


const app = express();
const PUERTO = 8080;

// Ruta para acceder a todos los productos
app.get('/products', async (req, res) => {
    try {
        const productManager = new ProductManager('./productos.json');
        let products = await productManager.getProducts();

        // Si se proporciona un query param "limit", limitar el número de productos devueltos
        const limit = req.query.limit;
        if (limit) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        res.status(500).send('Error al obtener los productos.');
    }
});

// Ruta para acceder a un producto específico por su ID
app.get('/products/:pid', async (req, res) => {
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

// Ruta para actualizar un producto por su ID
app.put('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const updatedFields = req.body; // Los campos actualizados del producto
        
        const productManager = new ProductManager('./productos.json');
        
        // Actualizar el producto con el ID especificado
        productManager.updateProduct(productId, updatedFields);
        
        res.send(`Producto con ID ${productId} actualizado correctamente.`);
    } catch (error) {
        res.status(500).send('Error al actualizar el producto.');
    }
});


// Ruta para eliminar un producto por ID
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productManager = new ProductManager('./productos.json');

        // Eliminar el producto con el ID especificado
        productManager.deleteProduct(productId);

        res.send(`Producto con ID ${productId} eliminado correctamente.`);
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
});



app.listen(PUERTO, () => {
    console.log(`Servidor Express escuchando en el puerto ${PUERTO}`);
});
