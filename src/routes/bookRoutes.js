import express from "express";

import { getAllBooks,getBook,createBook,updatedBook,deleteBook } from "../controllers/bookController.js";

const router = express.Router()

router.get('/',getAllBooks)
router.post('/',createBook)
router.get('/:id',getBook)
router.put('/:id',updatedBook)
router.delete('/:id',deleteBook)

export default router