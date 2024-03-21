import fs from 'fs';

class ProductManager {

    generateRandomId() {
        let randomId;
        do {
            randomId = Math.floor(Math.random() * 100);
        } while (this.products.some(product => product.id === randomId));
        return randomId;
    }

    constructor(filePath) {
        this.path = filePath;
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(data); // Parsear los datos a formato JSON
            console.log('Productos cargados correctamente:', products);
            return products;
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
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            throw new Error("Todos los campos son obligatorios.");
        }

        const existingProduct = this.products.find(item => item.code === product.code);
        if (existingProduct) {
            throw new Error("El código del producto ya existe.");
        }

        const newProduct = {
            ...product,
            id: this.generateRandomId(),
            status: true
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProductById(id) {
        return this.products.find(item => item.id === id);
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const updatedProduct = { ...this.products[productIndex] };

            // Evitar que se modifique el ID en la solicitud de actualización
            delete updatedFields.id;

            // Actualizar solo los campos permitidos enviados desde body
            Object.keys(updatedFields).forEach(key => {
                updatedProduct[key] = updatedFields[key];
            });

            this.products[productIndex] = updatedProduct;
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

export default ProductManager;

