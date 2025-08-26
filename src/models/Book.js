import mongoose from "mongoose";

//create a schema for our books
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date, required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true }
});
//create a model for our books
const Book = mongoose.model('books', bookSchema)

export default Book