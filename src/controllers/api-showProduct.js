
const Product = require("../models/product");
class APIshow{

    //đọc tất cả các product
    async ShowMen(req,res){
        const category = "Men";
        const page = req.query.page;
        const pageNumber = parseInt(page);
        const limitNumber = 4; 
        const skip = (pageNumber - 1) * limitNumber;
        console.log(category)
        try {
            const product = await Product.find({ category: category }).skip(skip).limit(limitNumber);
            const totalProducts = await Product.countDocuments();
            const totalPage = Math.ceil(totalProducts/limitNumber)
            console.log(totalPage)
            res.status(200).json({product,totalPage});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
}
module.exports =  new APIshow;