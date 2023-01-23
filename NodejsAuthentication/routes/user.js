var User = require("../models/user");
var express = require("express"),
  router = express.Router(),
  verifyToken = require('../middlewares/authJWT'),
  {
    signup,
    signin,
    updateUser,
    signOut
  } = require("../controllers/auth.controller.js");

router.post("/register", signup);

router.post("/login", signin);
router.put("/update/:id", (req,res,next)=>{
  console.log(req.params.id)
  User.findOneAndUpdate({_id:req.params.id},{
    $set:{
      username: req.body.username,
      email: req.body.email,
      password:req.body.password
    }
  })
  .then(result=>{
    res.status(200).json({
      updated_user:result
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      error:err
    })
  })
  
});


module.exports = router;