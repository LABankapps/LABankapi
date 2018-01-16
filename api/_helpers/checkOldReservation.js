exports.checkOldReservation = function(engine){
  if(typeof engine.reserved[0] !== 'undefined'){
    const dateNow = new Date().toLocaleString();
    engine.reserved.map((value, key) => {
      const doc = value._doc;
      const dateDuration = new Date(new Date(doc.date).getTime() + (new Date(doc.duration).getHours() * 60 + new Date(doc.duration).getMinutes()) * 60000 ).toLocaleString();

      if(dateDuration <= dateNow){
        //clean
        engine.reserved.splice(key, 1);
      }
    })
    engine.save(function(err, engine) {
      if (err) {  return next(err); }
      return engine;
    });
  }
  return engine;
}
