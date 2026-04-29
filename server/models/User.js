const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{7,15}$/;

const UserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    default:Date.now
  },

  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age:{
    type:String,
  },
 phone: {
  type: String,
  required: false,
  validate: {
    validator: function (v) {
      if (!v) return true;
      return phoneRegex.test(v);
    },
    message: props => `${props.value} n'est pas un numéro.`
  }
},

  email: {
    type: String,
    required: true,
    unique:true,
    validate: {
      validator: function (v) {
        return  emailRegex.test(v);
      },
      message: props => `${props.value} n'est pas un numéro ou un email valide.`
    }
  },
  emailVerificationExpires: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  location: {
    /*latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    zone: { type: String }*/
    type:String
  },

  address: {
    type: String
  },

  password: {
    type: String,
    required: true,
    minlength: 8
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userRole: {
    type: String,
    default: "USER",
    enum: ["USER","ADMIN"],

  }
});

module.exports = mongoose.model('User', UserSchema);
