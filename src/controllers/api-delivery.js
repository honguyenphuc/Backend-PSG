const Delivery = require("../models/delivery");
const Product = require("../models/product")
const { create } = require("./api-product");
class APIDelivery{

    //đọc tất cả các product
    // async Delivery(req,res){
    //     const newDelivery = new Delivery({
    //         hoten: 'John Doe',
    //         sdt: '123456789',
    //         email: 'john@example.com',
    //         diachi: '123 Main St',
    //         item: [
    //           { product: '649e6693d030fd47c42abdd3', soluong: 2 },
    //         ],
    //         totalPrice: 100,
    //       });
    //     try{
    //         for(const carts of newDelivery.item){
    //             const idDlivery = carts.product
    //             const soluong = carts.soluong
    //             const product =  await Product.find({_id: idDlivery})
    //             if(product[0].soluong >0){
    //                 product[0].soluong -= soluong
    //                 await Product.findByIdAndUpdate(product[0]._id, product[0]);
    //             }else{
    //                 res.status(404).json({message: "Hàng trong kho không đủ"});
    //             }
    //         }
    //         const delivery = await newDelivery.save()
    //         res.status(200).json({message:"Đặt hàng thành công"})
    //     }catch(err){
    //         console.log(err)
    //         // res.status(404).json({message: err.message});
    //     }
    // }
    async Delivery(req,res){
        const { hoten, sdt, email, diachi, item, totalPrice } = req.body;
        const newDelivery = new Delivery({
            hoten,
            sdt,
            email,
            diachi,
            item,
            totalPrice
          });
        try{
            for(const carts of newDelivery.item){
                const idDlivery = carts.product
                const soluong = carts.soluong
                const product =  await Product.find({_id: idDlivery})
                if(product[0].soluong >0){
                    product[0].soluong -= soluong
                    await Product.findByIdAndUpdate(product[0]._id, product[0]);
                }else{
                    res.status(404).json({message: "Hàng trong kho không đủ"});
                }
            }
            const delivery = await newDelivery.save()
            res.status(200).json({message:"Đặt hàng thành công"})
        }catch(err){
            console.log(err)
            // res.status(404).json({message: err.message});
        }
    }
    async updateSatus(req, res){
        const {id} = req.params;
        const {status} = req.body;
        try {
            const delivery = await Delivery.findByIdAndUpdate(id, {status},{new: true})
            console.log(delivery)
            if (!delivery) {
                return res.status(404).json({ error: 'Delivery not found' });
              }
            res.json(delivery);
            
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the delivery status' });
        }

    }

}
module.exports =  new APIDelivery;