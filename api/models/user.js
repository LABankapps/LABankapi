const mongoose = require('mongoose'),
      bcrypt = require('bcrypt-nodejs');

// Define user schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'O'],
      default: 'M'
    }
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    enum: ['Member', 'Dev', 'Admin'],
    default: 'Member'
  },
  },
  {
  timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const user = this,
        SALT_FACTOR = 5;

  //capitalize
  this.profile.firstName = this.profile.firstName.charAt(0).toUpperCase() + this.profile.firstName.slice(1);
  this.profile.lastName = this.profile.lastName.charAt(0).toUpperCase() + this.profile.lastName.slice(1);

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}
// Export Mongoose model
module.exports = mongoose.model('user', UserSchema);
