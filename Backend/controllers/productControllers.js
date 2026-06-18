import Product from "../models/product.js";


// Create New Products => /api/v1/products

export const getProducts = async (req, res) => {
    res.status(200).json({ 
        message: 'Gett all products',
    });
};


// Create New Products => /api/v1/admin/products

export const newProduct = async (req, res) => {
    const product = await Product.create (req.body);

    res.status(200).json({
        product,
    });
};