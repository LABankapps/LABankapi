const express = require('express'),
      AuthenticationController = require('./controllers/auth'),
      UserController = require('./controllers/user.js'),
      EngineController = require('./controllers/engine.js'),
      RecordController = require('./controllers/record.js'),
      passportService = require('../config/passport'),
      passport = require('passport'),
      multer = require('multer'),
      upload = multer({ dest: './public/' });

      // Constants for role types
      const REQUIRE_ADMIN = "Admin",
            REQUIRE_DEV = "Dev",
            REQUIRE_MEMBER = "Member";

// Middleware to require login/auth
  const requireAuth = passport.authenticate('jwt', { session: false });
  const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router(),
        engineRoutes = express.Router(),
        recordRoutes = express.Router();

  // Uri page helper
  function index(uri, helpers, res){
    res.render('index', {title: uri, helpers: helpers})
  }

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes, function(req, res) { index('API - api/auth', [{ title: '/register', subtitle: 'Example :', line: ['{', '"email@gmail.com", // Must be unique', '"firstName": "MyFirstName",', '"lastName": "MyLastName",', '"password": "xxxxx",', '"role": "Member" // Optional', '}']}, {title: '/login', subtitle: 'Example :', line: [ '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}], res) });

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  //authRoutes.post('/login', requireLogin, AuthenticationController.login);
  authRoutes.post('/login', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.status(401).send({ error: info.error }) }
      if (!user) { return res.status(401).send({ error: info.error }) }
      AuthenticationController.login(user, res, next)
    })(req, res, next);
  });

  //=========================
  // Users Routes
  //=========================

  // Set users routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/users', userRoutes, function(req, res) { index('API - api/users', [{ title: '/all', subtitle: 'Example :', line: ['Return a list of users','{', '"users": [', '{', '"_id": "xxxx",', '}', '{', '"_id": "xxxx",', '}', '}', ']']}, {title: '/:id', subtitle: 'Example :', line: [ 'Return one user', '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}, {title: '/:id', subtitle: 'Example :', line: [ 'Delete one user', '{', '"email": "email@gmail.com"', '"password": "xxxxx",', '}' ]}], res) });

  //getAll user route
  userRoutes.get('/all', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }
      UserController.getAll(req, res, next);
    })(req, res, next);
  });

  //getById user route
  userRoutes.get('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }
      if(user._id != req.params.id){
        return res.status(401).send({ error: "Vous n'avez pas l'autorisation nécéssaire pour accéder à cette utilisateur" }) }

      UserController.getById(req, res, next);
    })(req, res, next);
  });

  //delete user route
  userRoutes.delete('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      UserController.delete(req, res, next);
    })(req, res, next);
  });

  //update user route
  userRoutes.put('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      UserController.update(req, res, next);
    })(req, res, next);
  });

  //resetPassword route
  userRoutes.post('/resetPassword', UserController.forgotPassword);

  //update user password route
  userRoutes.put('/password/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      UserController.updatePassword(req, res, next);
    })(req, res, next);
  });

  //=========================
  // Engines Routes
  //=========================

  // Set engines routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/engines', engineRoutes, function(req, res) { index('API - api/engines', [{ title: '/create', subtitle: 'Example :', line: ['{', '"Viseuses", // Must be unique', '"price": "100",', '"level": "Avanced",', '"comments": "xxxxxxx xxxx xxxx" // Optional', '}']}, {title: '/getAll', subtitle: 'Example :', line: [ 'return some engines' ]}], res) });

  //create engine route
  engineRoutes.post('/create', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.create(req, res, next);
    })(req, res, next);
  });

  //getAll engine route
  engineRoutes.get('/all', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.getAll(req, res, next);
    })(req, res, next);
  });

  //getAll without permissions
  engineRoutes.get('/syncAll', EngineController.syncAll);

  //getImageById engine route
  engineRoutes.get('/img/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.getImageById(req, res, next);
    })(req, res, next);
  });

  //updateImageById engine route
  engineRoutes.put('/img/:id', upload.single('file'), function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.updateImageById(req, res, next);
    })(req, res, next);
  });

  //delete engine route
  engineRoutes.delete('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.delete(req, res, next);
    })(req, res, next);
  });

  //update engine route
  engineRoutes.put('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.update(req, res, next);
    })(req, res, next);
  });

  //reservation engine route
  engineRoutes.put('/reservation/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      EngineController.reservation(req, res, next);
    })(req, res, next);
  });

  //=========================
  // Records Routes
  //=========================

  // Set records routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/records', recordRoutes, function(req, res) { index('API - api/records', [{ title: '/update', subtitle: 'Example :', line: ['{', '"from": "xxxx",', '"endDate": "xxxxxx",', '"stardDate": "xxxxxxx" // Optional', '}']}, {title: '/getByUserId', subtitle: 'Example :', line: [ 'return some records' ]}], res) });

  //updateRecord
  recordRoutes.put('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      RecordController.update(req, res, next);
    })(req, res, next);
  });

  //getbyUserId
  recordRoutes.get('/:id', function(req, res, next){
    passport.authenticate('jwt', function(err, user, info){
      if (!user) { return res.status(401).send({ error: info.error }) }

      RecordController.getByUserId(req, res, next);
    })(req, res, next);
  });


// Set url for API group routes
  app.use('/', apiRoutes, function(req, res) { index('API', [{ title: '/auth', subtitle: '', line: ['/register', '/login']},{ title: '/users', subtitle: '', line: ['/', '/+id']}], res) });
};
