const { response } = require("express");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const { PromiseProvider } = require("mongoose");
const jwt = require('jsonwebtoken');
class APIUser{
    async register(req,res){
        const newUser =  await new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,10),
            repeatPassword: bcrypt.hashSync(req.body.password,10),
        });
        console.log(newUser);
        if(newUser.name ==="" || newUser.email===""){
            res.status(400).send({message: "vui lòng nhập thông tin đầy đủ"})
        }else{
          newUser.save(err => {
              if (err) {
                res.status(500)
                  .send({
                    message: "tài khoản đã được sử dụng "
                  });
                return;
              } else {
                res.status(200)
                  .send({
                    message: "đăng kí thành công"
                  })
              }
            })
          }
      };
    async login (req,res){
        User.findOne({email: req.body.email},(err ,user)=>{
          if(err){ return res.status(500).json({
            message: "Lỗi server"
          })
        }
        console.log(user);
          if(!user){
            return res.status(400).json({
              message:"Tài khoản không tồn tại"
            })
          }
          if(!bcrypt.compareSync(req.body.password,user.password)){
            return res.status(401).json({
              message:"Mật khẩu không đúng"
            })
          }
          let token =  jwt.sign({UserId:user._id, role: user.role},'secret-key', { expiresIn: '30s' });
          // token =`Bearer ${token}`;
          console.log(token)
          console.log(user);
          return res.status(200).json({
            message:"Đăng nhập thành công",
            token,
            role: user.role
          })
        })
    }
    async authenticateToken(req, res, next) {
      const token = req.headers['authorization'];
      console.log(token)
      if (!token) {
        return res.status(401).json({ error: 'Authentication token required.' });
      }
    
      jwt.verify(token.split(' ')[1], 'secret-key', (err, decodedToken) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid token.' });
        }
        req.user = decodedToken;
        next();
      });
    }
    async checkadmin(req, res, next){
      if (req.user.role !== 'admin') {
        // Check if the user is an admin and deny access if not
        return res.status(403).json({ error: 'Access denied.' });
      }
      next();
    }
}
module.exports = new APIUser;