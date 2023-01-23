var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/user");
const user = require("../models/user");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500)
        .send({
          message: err
        });
      return;
    } else {
      res.status(200)
        .send({
          message: "User Registered..."
        })
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
      email: req.body.email
    })
    .exec((err, user) => {
      if (err) {
        res.status(500)
          .send({
            message: err
          });
        return;
      }
      if (!user) {
        return res.status(404)
          .send({
            message: "User Not found..."
          });
      }

    
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
     
      if (!passwordIsValid) {
        return res.status(401)
          .send({
            accessToken: null,
            message: "Invalid Password!"
          });
      }
    
      var token = jwt.sign({
        id: user.id
      }, process.env.API_SECRET, {
        expiresIn: 86400
      });

      res.status(200)
        .send({
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
          },
          message: "Login successfull",
          accessToken: token,
        });
    });
};


exports.signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization fail!' });
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter(t => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.json({ success: true, message: 'Sign out successfully!' });
  }
};

