import fs from 'fs';
import mongoose from 'mongoose';
import Product from './models/productModel.js';

class ProductManager {

    generateRandomId() {
        let randomId;
        do {
            randomId = Math.floor(Math.random() * 100).toString();
        } while (this.products.some(product => product.id === randomId));
        return randomId;
    }

    constructor(filePath) {
        this.path = filePath;
        this.useFileSystem = false; // Indicador de si se está utilizando FileSystem o no
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
                const data = fs.readFileSync(this.filePath, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                console.error('Error al cargar los productos desde FileSystem:', error);
                return [];
            }
        }
    }

    async getProducts() {
        if (!this.useFileSystem) {
            try {
                // Utilizar Mongoose para obtener todos los productos desde la base de datos
                return await Product.find().lean();
            } catch (error) {
                console.error('Error al cargar los productos desde MongoDB:', error);
                return [];
            }
        } else {
            try {
                // Utilizar FileSystem para cargar los productos
                const data = fs.readFileSync(this.path, 'utf-8');
                return JSON.parse(data);
            } catch (error) {
                console.error('Error al cargar los productos desde FileSystem:', error);
                return [];
            }
        }
    }


    async saveProducts() {
        if (!this.useFileSystem) {
            try {
                // No es necesario guardar los productos en FileSystem si se está utilizando Mongoose
            } catch (error) {
                console.error('Error al guardar los productos en MongoDB:', error);
            }
        } else {
            try {
                // Utilizar FileSystem para guardar los productos
                fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
            } catch (error) {
                console.error('Error al guardar los productos en FileSystem:', error);
            }
        }
    }
    async addProduct(product) {
        try {
            if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
                throw new Error("Todos los campos son obligatorios.");
            }

            const existingProduct = await Product.findOne({ code: product.code });
            if (existingProduct) {
                throw new Error("El código del producto ya existe.");
            }

            const newProduct = await Product.create({
                title: product.title,
                description: product.description,
                price: product.price,
                code: product.code,
                stock: product.stock,
                category: product.category,
                status: true
            });

            this.products.push(newProduct);
            this.saveProducts();

            return { status: true, msg: newProduct.id };
        } catch (error) {
            return { status: false, msg: error.message };
        }
    }


    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            console.error('Error al obtener el producto por ID desde MongoDB:', error);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            if (updatedProduct) {
                return { status: true, msg: 'Producto actualizado correctamente.' };
            } else {
                return { status: false, msg: 'Producto no encontrado.' };
            }
        } catch (error) {
            return { status: false, msg: 'Error al actualizar el producto.' };
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            if (deletedProduct) {
                return { status: true, msg: 'Producto eliminado correctamente.' };
            } else {
                return { status: false, msg: 'Producto no encontrado.' };
            }
        } catch (error) {
            return { status: false, msg: 'Error al eliminar el producto.' };
        }
    }


}

export default ProductManager;

