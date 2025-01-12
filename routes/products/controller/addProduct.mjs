import communicator from "../../../communicator/index.mjs";

async function addProductController(req,res,next){
    try {
        const {title, description, price, stock_quantity, category} = req.body;
        const seller_id = req.user.userID;
        if(!title || !description || !price || !stock_quantity || !category){
            return res.status(400).send({msg: "Please provide all the details"});
        }
        const image = req.file;
        if(!image) return res.status(400).send({msg: "Please provide an image"});
        const newProduct = await communicator.addProduct(seller_id, title, description, price, stock_quantity, category,image);
        const date = new Date(newProduct.createdAt);
        const formattedDateTime = date.toLocaleString();
        const message = await communicator.sendNotification(seller_id, "Product added successfully", `Hello ${req.user.name},\n\nYour product:\n${title}\n${description}\nprice: ${price}\nquantity: ${stock_quantity}\nHas been added successfully to the inventory at ${formattedDateTime}\n\nThank you,\n Multi-vendor-platform team`);
        res.status(200).send(newProduct);
    } catch (error) {
        res.status(500).send({msg: `Error: ${error.message}`})
        
    }
}

export default addProductController