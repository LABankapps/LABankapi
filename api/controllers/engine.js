const Engine = require('../models/engine');
const checkOldReservation = require('../_helpers/checkOldReservation').checkOldReservation;
const record = require('./record');
var fs = require('fs');

//= =======================================
// Engine Routes
//= =======================================

exports.create = function(req, res, next){
  // Check for registration errors
  const name = req.body.name;
  const price = req.body.price;
  const level = req.body.level || 0;
  const img = './public/defaultEngine.png';
  const comments = req.body.comments;
  const location = req.body.location;

  // Return error if no email provided
  if (!name) {
    return res.status(422).send({ error: 'Veuillez nommer votre machine.'});//You must enter a name.
  }

  // Return error if no price provided
  if (!price) {
    return res.status(422).send({ error: 'Veuillez entrer un ordre de prix.'});//You must enter a price.
  }

  // Return error if no level provided
  if (!level) {
    return res.status(422).send({ error: 'Veuillez spécifier le niveau requis.'});//You must enter a level.
  }

  Engine.findOne({ name: name }, function(err, existingEngine) {
      if (err) { return next(err); }

      // If engine is not unique, return error
      if (existingEngine) {
        return res.status(422).send({ error: 'Cette machine existe déja.' });//That name is already in use.
      }

      // If name is unique create account
      let engine = new Engine({
        name: name,
        price: price,
        level: level,
        comments: comments,
        location: location
      });

      engine.img.data = fs.readFileSync(img);
      engine.img.contentType = 'image/png';

      engine.save(function(err, engine) {
        if (err) { return next(err); }

        //create an engine
        res.status(201).json({
          engine: engine
        });
      });
  });

};

exports.getImageById = function (req, res, next) {
  const engineId = req.params.id;

  Engine.findById(engineId, (err, engine) => {
    if (err || engine === null) {
      return res.status(400).json({ error: 'No engine could be found for this ID.' });
    }

    res.contentType(engine.img.contentType);
    return res.send(engine.img.data);
  });
};

exports.updateImageById = function (req, res, next) {
  const engineId = req.params.id;
  const img = req.file;

  if(typeof req.file === 'undefined' || img.mimetype !== 'image/jpeg' && img.mimetype !== 'image/png'){
    if(img.path){ fs.unlink(img.path) }
    return res.status(400).json({ error: 'Veuillez envoyer une image. (jpeg ou png)' });
  }

  Engine.findById(engineId, (err, engine) => {
    if (err || engine === null) {
      fs.unlink(img.path);
      return res.status(400).json({ error: 'No engine could be found for this ID.' });
    }
    engine.img.data = fs.readFileSync(img.path);
    engine.img.contentType = img.mimetype;

    fs.unlink(img.path);

    engine.save(function(err, engine) {
      if (err) { return res.status(400).json({ error: err }); }

      res.status(201).json({
        engine: engine
      });

    });
  });
};


exports.getAll = function (req, res, next) {
  Engine.find((err, engines) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    //temp
    let enginesRecords = engines.map(engine => engine = checkOldReservation(engine));

    return res.status(200).json({ engines: enginesRecords });
  });
};

exports.syncAll = function(req, res, next) {
  Engine.find((err, engines) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    //temp
    let enginesRecords = engines.map(engine => engine = checkOldReservation(engine));

    return res.json({ engines: enginesRecords });
  });
};

exports.delete = function (req, res, next) {
  if(req){
    Engine.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ msg: "done" });
    });
  }
};

exports.update = function (req, res, next) {
  delete req.body.img; // no img updated
  if(req){
    Engine.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, engine, engineUpdate) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ engine: engine });
    });
  }
};

exports.reservation = function (req, res, next) {
  if(req){
    const from = req.body.from;
    const date = req.body.date;
    const duration = req.body.duration;

    Engine.findOne({ _id: req.params.id }, function(err, existingEngine) {
        if (err) { return next(err); }

        if(typeof existingEngine.reserved[0] === 'undefined'){
          existingEngine.reserved.push({
            "from": from,
            "date": date,
            "duration": duration,
          });
          record.create(from, req.params.id, date, duration, existingEngine.price);
        }else{
          const before = existingEngine.reserved.length;

          let open = true;

          existingEngine.reserved.map(value => {
            const doc = value._doc;
            const dateDuration = new Date(new Date(doc.date).getTime() + (new Date(doc.duration).getHours() * 60 + new Date(doc.duration).getMinutes()) * 60000 ).toLocaleString();

            const dateDurationUser = new Date(new Date(date).getTime() + (new Date(duration).getHours() * 60 + new Date(duration).getMinutes()) * 60000 ).toLocaleString();

            if(new Date(doc.date).toLocaleString() < new Date(date).toLocaleString() && dateDuration <= new Date(date).toLocaleString()){
            }else{
              if(new Date(doc.date).toLocaleString() > new Date(date).toLocaleString() && new Date(doc.date).toLocaleString() >= dateDurationUser){

              }else{
                open = false;
              }
            }
          });

          if(open){
            existingEngine.reserved.push({
              "from": from,
              "date": date,
              "duration": duration,
            });
            record.create(from, req.params.id, date, duration, existingEngine.price);
          }

          if(before >= existingEngine.reserved.length){
            return res.status(400).json({ error: 'Date déjà prise.' });
          }
        }

        existingEngine.save(function(err, engine) {
          if (err) { return res.status(400).json({ error: err }); }

          //update
          res.status(201).json({
            engine: engine
          });
        });
    });
  }
};
