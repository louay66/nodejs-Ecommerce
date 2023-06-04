const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      tirm: true,
      required: [true, 'name must be exist ']
    },
    slug: {
      type: String,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'email must be exist'],
      unique: true,
      lowercase: true
    },
    phone: { type: String },
    profileImg: { type: String },

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'password must be at least 6 characters']
    },

    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    active: { type: Boolean, default: true },

    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
      }
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String
      }
    ]
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', UserSchema);
