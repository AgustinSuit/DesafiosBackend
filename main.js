import ProductManager from './productManager.js';
import path from 'path';


const fileProducts = "./productos.json";
const manager = new ProductManager(path.join(__dirname, fileProducts));

manager.addProduct({ title: "Producto 1", description: "Descripción del producto 1", price: 520, img: "sin img", code: "COD1", stock: 45 });
manager.addProduct({ title: "Producto 2", description: "Descripción del producto 2", price: 718, img: "sin img", code: "COD2", stock: 62 });
manager.addProduct({ title: "Producto 3", description: "Descripción del producto 3", price: 279, img: "sin img", code: "COD3", stock: 83 });

console.log(manager.getProducts());

manager.getProductById(2);

manager.updateProduct(2, { price: 800 });

manager.deleteProduct(1);
