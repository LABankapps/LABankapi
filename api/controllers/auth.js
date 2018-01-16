const jwt = require('jsonwebtoken'),
      config = require('../../config/main'),
      User = require('../models/user'),
      setUserInfo = require('../_helpers/setUserInfo').setUserInfo;

function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10000, // in seconds
  });
}

//========================================
// Authorization Middleware
//========================================

// Role authorization check
exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'Utilisateur introuvable' });//No user was found.
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'Vous n\'avez pas l\'autorisation nécéssaire.'});//You are not authorized to view this content.
      return next('Non autorisé');//Unauthorized
    })
  }
}

//========================================
// Login Route
//========================================
exports.login = function(req, res, next) {
  let userInfo = setUserInfo(req);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
}

//========================================
// Registration Route
//========================================
exports.register = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const role = req.body.role || "Member";

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'Veuillez rentrer une adresse email.'});//You must enter an email address.
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'Veuillez rentrer un nom et prénom.'});//You must enter your full name.
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'Veuillez rentrer un mot de passe.' });//You must enter your full name.
  }

  // Return error if role is not valid{
  if (role != "Admin" && role != "Member" &&  role != "Dev") {
    return res.status(422).send({ error: role + ', le role n\'existe pas.' }); //is not a valid role.
  }

  User.findOne({ email: email }, function(err, existingUser) {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'Cette email existe déja.' });//That email address is already in use.
      }

      // If email is unique and password was provided, create account
      let user = new User({
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName },
        role : role
      });

      user.save(function(err, user) {
        if (err) { return next(err); }

        // Respond with JWT if user was created

        let userInfo = setUserInfo(user);

        res.status(201).json({
          user: userInfo
        });
      });
  });
}
