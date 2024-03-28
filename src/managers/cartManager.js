import fs from 'fs';

export class InvalidProductError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidProductError';
    }
}

export class InvalidCartError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidCartError';
    }
}

export class InsufficientStockError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientStockError';
    }
}

export class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = this.loadCarts();
        this.products = this.loadProducts(); 

    }

    loadProducts() {
        try {
            const data = fs.readFileSync('./src/db/productos.json', 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            return [];
        }
    }

    // Método para obtener un producto por su ID
    getProductById(productId) {
        return this.products.find(product => product.id === productId);
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
        const timestamp = new Date().getTime();
        const uniqueId = timestamp.toString() + Math.floor(Math.random() * 1000);
        return uniqueId;
    }


    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new InvalidCartError('Carrito no encontrado.');
        }

        // Verificar si la cantidad es válida
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error('La cantidad del producto debe ser un número entero positivo.');
        }
        // Verificar si el producto existe en la base de datos antes de agregarlo al carrito
        const product = this.getProductById(productId);
        if (!product) {
            throw new InvalidProductError('Producto no encontrado');
        }


        // Verificar si hay suficiente stock del producto
        if (product.stock < quantity) {
            throw new InsufficientStockError('No hay suficiente stock del producto.');
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
