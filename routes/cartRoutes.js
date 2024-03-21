import express from 'express';
import CartManager from '../cartManager.js';

// Manejo de carritos
const cartRouter = express.Router();

cartRouter.post('/', async (req, res) => {
    try {
        const cartManager = new CartManager('./carritos.json');
        const newCart = cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        res.status(500).send('Error al crear el carrito.');
    }
});

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartManager = new CartManager('./carritos.json');
        const cart = cartManager.getCartById(cartId);
        if (!cart) {
            res.status(404).send('Carrito no encontrado.');
        } else {
            res.json(cart.products);
        }
    } catch (error) {
        res.status(500).send('Error al obtener el carrito.');
    }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cartManager = new CartManager('./carritos.json');
        cartManager.addProductToCart(cid, pid, quantity);

        res.send(`Producto con ID ${pid} agregado al carrito ${cid} correctamente.`);
    } catch (error) {
        res.status(500).send('Error al agregar el producto al carrito.');
    }
});

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cartManager = new CartManager('./carritos.json');
        cartManager.removeProductFromCart(cid, pid);

        res.send(`Producto con ID ${pid} eliminado del carrito ${cid} correctamente.`);
    } catch (error) {
        res.status(500).send('Error al eliminar el producto del carrito.');
    }
});

export default cartRouter;
