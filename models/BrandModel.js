const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand required'],
      unique: [true, 'Brand must be uniqe'],
      minlength: [3, 'too short Brand name'],
      maxlength: [32, 'too long Brand name']
    },
    slug: {
      type: String,
      lowercase: true
    },
    image: String
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BaseUrl}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// getAll , getOne, Put
BrandSchema.post('init', (doc) => {
  setImageUrl(doc);
});
// Post
BrandSchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('Brand', BrandSchema);
