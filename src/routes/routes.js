const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const io = require('socket.io')();
const product = require("../controllers/api-product");
const user = require("../controllers/api-user");
const category = require("../controllers/api-category");
const search = require("../controllers/api-search")
const delivery = require("../controllers/api-delivery")
const showProduct = require("../controllers/api-showProduct")
const paymentController = require("../controllers/api-paypal")

router.get("/",user.authenticateToken,user.checkadmin,product.show);
router.get("/danhmuc",category.showcategory);
router.get("/search",search.searchProduct);
router.get('/success', paymentController.executePayment);
router.get('/cancel', paymentController.cancelPayment);

router.get("/:id",product.detail);
router.get("/danhmuc/Men",showProduct.ShowMen);
// router.get("/danhmuc/Women",showProduct.ShowWomen);

router.post("/",product.create);
router.post("/delivery",delivery.Delivery);
router.put("/delivery/:id/status",delivery.updateSatus);
router.post('/create-payment', paymentController.createPayment);
router.patch("/:id",product.update);
router.delete("/:id",product.delete);
router.post("/danhmuc",category.createcategory);
router.patch("/danhmuc/:id",category.updatecategory);
router.delete("/danhmuc/:id",category.deletecategory);

router.post("/user/register",user.register);
router.post("/user/login",user.login);


module.exports = router;