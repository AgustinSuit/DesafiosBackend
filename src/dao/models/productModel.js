import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    img: String,
    stock: Number,
    code: String,
    status: Boolean,
    category: String
});

const Product = mongoose.model('Product', productSchema);

export default Product;
