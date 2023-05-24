const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'category required'],
      unique: [true, 'category must be uniqe'],
      minlength: [3, 'too short category name'],
      maxlength: [32, 'too long category name']
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
    const imageUrl = `${process.env.BaseUrl}/categouies/${doc.image}`;
    doc.image = imageUrl;
  }
};
// getAll , getOne, Put
CategorySchema.post('init', (doc) => {
  setImageUrl(doc);
});
// Post
CategorySchema.post('save', (doc) => {
  setImageUrl(doc);
});

module.exports = mongoose.model('Category', CategorySchema);
