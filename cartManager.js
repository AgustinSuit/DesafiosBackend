import fs from 'fs';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los carritos:', error);
            return [];
        }
    }

    saveCarts() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }

    createCart() {
        const newCart = {
            id: this.generateId(),
            products: []
        };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    generateId() {
        // Obtenemos la fecha actual en milisegundos
        const timestamp = new Date().getTime();
        // Creamos un ID único concatenando el timestamp con un número aleatorio
        const uniqueId = timestamp.toString() + Math.floor(Math.random() * 1000);
        return uniqueId;
    }
    

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado.');
        }

        const productIndex = cart.products.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementar la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no existe en el carrito, agregarlo
            cart.products.push({ id: productId, quantity });
        }

        this.saveCarts();
    }

    removeProductFromCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado.');
        }

        const productIndex = cart.products.findIndex(item => item.id === productId);
        if (productIndex !== -1) {
            // Eliminar el producto del carrito
            cart.products.splice(productIndex, 1);
            this.saveCarts();
        } else {
            throw new Error('Producto no encontrado en el carrito.');
        }
    }
    
}

export default CartManager;

