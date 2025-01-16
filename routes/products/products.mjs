import { Router } from "express";
import communicator from "../../communicator/index.mjs";
import authorization from "../auth/controllers/authController.mjs";
import multer from "multer";
import addProductController from "./controller/addProduct.mjs";
const productRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: {fileSize: 10 *1024 *1024} });


productRouter.post('/product/add',authorization(['seller']) ,upload.single("image") ,addProductController)

productRouter.put('/product/update/:id',authorization(['seller']),upload.single("image"),async (req,res)=>{
    const product_id = req.params.id;
    const updateData = req.body;
    let product = {};
    Object.keys(updateData).forEach(key => {
        product[key] = updateData[key];
    });
    if(!product_id || !product){
        return res.status(400).send({msg: "Please provide all the details"});
    }
    const image = req.file
    if (image) {
        product.image_url = image;
    }
    try {
        
        const updatedProduct = await communicator.updateProduct(product_id, product);
        res.status(200).send(updatedProduct);
    } catch (error) {
        console.log(error)
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.delete('/product/delete/:id',authorization(['seller', 'admin']) ,async (req,res)=>{
    const product_id = req.params.id;
    if(!product_id){
        res.status(400).send({msg: "Please provide all the details"});
    }
    try {
        const deletedProduct = await communicator.deleteProduct(product_id);
        console.log(deletedProduct)
        res.status(200).send(deletedProduct);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/getAll',async (req,res)=>{
    const {category} = req.query;
    if(category){
        try {
            const products = await communicator.getProductsByCategory(category);
            return res.status(200).send(products);
        } catch (error) {
            return res.status(500).send({msg: `${error.message}`})
        }
    }

    
    else try {
        const products = await communicator.getProducts();
        console.log(products)
        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/seller',authorization(['seller']),async (req,res)=>{
    try {
        const seller_id = req.user.userID
        const products = await communicator.getProductsBySeller(seller_id);
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
    }
})

productRouter.get('/product/get/:id', async (req,res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).send({msg: "Please provide product id"});
    }
    try {
        const product = await communicator.getProduct(id);
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/image/:id', async (req,res)=>{
    const {id} = req.params;
    if(!id){
        res.status(400).send({msg: "Please provide image id"});
    }
    try {
        const image = await communicator.getProductImage(id);
        res.setHeader('Content-Type', 'image/jpeg')
        res.status(200).send(image);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/availableCategories', async (req,res)=>{
    try {
        console.log('Available categories route')
        const categories=  await communicator.getAvailableCategories()
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/allCategories', async (req,res)=>{
    try {
        const categories = await communicator.getAllCategories();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

productRouter.get('/product/top', async (req,res)=>{
    try {
        const products = await communicator.getTopProducts();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({msg: `${error.message}`})
        
    }
})

export default productRouter




