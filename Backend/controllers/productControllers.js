import Product from "../models/product.js";


// Get all products => /api/v1/products

export const getProducts = async (req, res) => {

    const products = await Product.find();

    res.status(200).json({ 
        products
    });
};


// Create New Products => /api/v1/admin/products

export const newProduct = async (req, res) => {
    const product = await Product.create (req.body);

    res.status(200).json({
        product,
    });
};

// Get single product details  => /api/v1/products/:id

export const getProductDetails = async (req, res) => {
    const product = await Product.findById(req.params?.id);

    if (!product) {
        return res.status(404).json ({
            error: "Product not found"
        });
    }

    res.status(200).json({
        product,
    });
};

// Update product details  => /api/v1/products/:id

export const updateProduct = async (req, res) => {
    let product = await Product.findById(req.params?.id);

    if (!product) {
        return res.status(404).json ({
            error: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true });

    res.status(200).json({
        product,
    });
};