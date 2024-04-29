import fs from 'fs';
import mongoose from 'mongoose';
import Cart from './models/cartModel.js';

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
        this.useFileSystem = false; // Indicador de si se está utilizando FileSystem o no
        this.carts = this.loadCarts();
        this.products = this.loadProducts();
    }

    async loadProducts() {
        if (!this.useFileSystem) {
            try {
                // Utilizar Mongoose para obtener todos los productos desde la base de datos
                return await Product.find();
            } catch (error) {
                console.error('Error al cargar los productos desde MongoDB:', error);
                return [];
            }
        } else {
            try {
                // Utilizar FileSystem para cargar los productos
                const data = fs.readFileSync('./src/dao/db/productos.json', 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                console.error('Error al cargar los productos desde FileSystem:', error);
                return [];
            }
        }
    }

    // Método para obtener un producto por su ID
    async getProductById(productId) {
        if (!this.useFileSystem) {
            try {
                // Utilizar Mongoose para buscar un producto por su ID
                return await Product.findById(productId);
            } catch (error) {
                console.error('Error al obtener el producto por ID desde MongoDB:', error);
                return null;
            }
        } else {
            try {
                // Utilizar FileSystem para buscar un producto por su ID
                return this.products.find(product => product.id === productId);
            } catch (error) {
                console.error('Error al obtener el producto por ID desde FileSystem:', error);
                return null;
            }
        }
    }


    async loadCarts() {
        if (!this.useFileSystem) {
            try {
                // Utilizar Mongoose para obtener todos los carritos desde la base de datos
                return await Cart.find();
            } catch (error) {
                console.error('Error al cargar los carritos desde MongoDB:', error);
                return [];
            }
        } else {
            try {
                // Utilizar FileSystem para cargar los carritos
                const data = fs.readFileSync(this.filePath, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                console.error('Error al cargar los carritos desde FileSystem:', error);
                return [];
            }
        }
    }

    async saveCarts() {
        if (!this.useFileSystem) {
            try {
                // No es necesario guardar los carritos en FileSystem si se está utilizando Mongoose
            } catch (error) {
                console.error('Error al guardar los carritos en MongoDB:', error);
            }
        } else {
            try {
                // Utilizar FileSystem para guardar los carritos
                fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
            } catch (error) {
                console.error('Error al guardar los carritos en FileSystem:', error);
            }
        }
    }

    async createCart() {
        if (!this.useFileSystem) {
            try {
                // Crear un nuevo carrito en la base de datos MongoDB
                const newCart = await Cart.create({ products: [] });
                return newCart;
            } catch (error) {
                console.error('Error al crear un nuevo carrito en MongoDB:', error);
                return null;
            }
        } else {
            try {
                // Crear un nuevo carrito en FileSystem
                const newCart = {
                    id: this.generateId(),
                    products: []
                };
                this.carts.push(newCart);
                this.saveCarts();
                return newCart;
            } catch (error) {
                console.error('Error al crear un nuevo carrito en FileSystem:', error);
                return null;
            }
        }
    }

    // Método para generar un ID único
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
