import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    img: String,
    stock: Number,
    code: String,
    status: Boolean,
    category: String
});

schema.plugin(mongoosePaginate);

const Product = mongoose.model('products', schema);

export default Product;
