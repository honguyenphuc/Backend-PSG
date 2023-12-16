const Category = require("../models/category");
const paypal = require('paypal-rest-sdk');
paypal.configure({
    mode: 'sandbox',
    client_id: 'AZGyp3vp8umBqhFkpEAlqrmvZPPqRapRtyA2_5Up1S7DhPbycB3hAnStq3pQHNyFOYO3F7WTZlGQwSOD',
    client_secret: 'EB5UZU7s4d2U9DOC96x8WydReYOqGVVf-xVMksw5d-Q1LrL3Lqsc8OBKeUmkAtGbT4_ajGz1GlCBsB0V'
  });
class APIPaypal{

    //đọc tất cả các product
    async createPayment(req,res){
      const total = req.body.totalPrice
        const payment = {
            intent: 'sale',
            payer: {
              payment_method: 'paypal'
            },
            redirect_urls: {
              return_url: 'http://localhost:3001/api/success',
              cancel_url: 'http://localhost:3001/api/cancel'
            },
            transactions: [{
              amount: {
                total: total.toString(),
                currency: 'USD'
              },
              description: 'Payment description'
            }]
          };
        paypal.payment.create(payment, (error, payment) => {
            if (error) {
              console.error(error);
              res.sendStatus(500);
            } else {
                // for (let i = 0; i < payment.links.length; i++) {
                //     if (payment.links[i].rel === 'approval_url') {
                //       res.json(payment.links[i].href);
                //       break; // Exit the loop after finding the approval URL
                //     }
                //   }
                res.json({ approval_url: payment.links[1].href });
            }
          });
    }
    async executePayment(req,res){
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const executePayment = {
            payer_id: payerId
        };

        paypal.payment.execute(paymentId, executePayment, (error, payment) => {
            if (error) {
                console.error(error);
            } else {
                console.log(payment);
            }
        });

        res.redirect('/thank-you');
    }

    async cancelPayment(req, res) {
        res.redirect('/payment-cancelled');
      }
}
module.exports =  new APIPaypal;