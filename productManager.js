import fs from "fs";

class ProductManager {
    static ultId = 0;

    constructor(filePath) {
        this.path = filePath;
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            return [];
        }
    }

    getProducts() {
        return this.products;
    }


    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.img || !product.code || !product.stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(item => item.code === product.code)) {
            console.log("El código debe ser único.");
            return;
        }

        product.id = ++ProductManager.ultId;
        this.products.push(product);
        this.saveProducts();
    }

    getProductById(id) {
        const product = this.products.find(item => item.id === id);

        if (!product) {
            console.log("Producto no encontrado.");
        } else {
            return product;
        }
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
            this.saveProducts();
        } else {
            console.log("Producto no encontrado.");
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts(); 
        } else {
            console.log("Producto no encontrado.");
        }
    }

}

export default ProductManager
