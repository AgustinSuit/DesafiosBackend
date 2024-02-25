class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            throw new Error('El código del producto ya está en uso.');
        }

        const id = this.generateId();
        const newProduct = new Product(title, description, price, thumbnail, code, stock, id);
        this.products.push(newProduct);
        return newProduct;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        return product;
    }

    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}

const manager = new ProductManager();

console.log(manager.getProducts()); 

const product1 = manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
console.log(manager.getProducts()); 

try {
    manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
    console.error(error.message);
}

try {
    manager.getProductById('invalidId');
} catch (error) {
    console.error(error.message);
}
