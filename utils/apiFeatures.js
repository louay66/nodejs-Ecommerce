class apiFeatures {
  constructor(MongoosQuery, queryString) {
    this.MongoosQuery = MongoosQuery;
    this.queryString = queryString;
  }

  filter() {
    const SringQueryObj = { ...this.queryString };
    const execludsParam = ['page', 'limit', 'sort', 'fields'];
    execludsParam.forEach((parms) => delete SringQueryObj[parms]);
    // filter by greter than , greter than or equal , less then , less then or equal
    let queryFilter = JSON.stringify(SringQueryObj);
    queryFilter = queryFilter.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.MongoosQuery = this.MongoosQuery.find(JSON.parse(queryFilter));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.MongoosQuery = this.MongoosQuery.sort(sortBy);
    } else {
      this.MongoosQuery = this.MongoosQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldBy = this.queryString.fields.split(',').join(' ');
      this.MongoosQuery = this.MongoosQuery.select(fieldBy);
    } else {
      this.MongoosQuery = this.MongoosQuery.select('-__v');
    }
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === 'Products') {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } }
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }

      this.MongoosQuery = this.MongoosQuery.find(query);
    }
    return this;
  }

  pagenate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    const pagenation = {};
    pagenation.curentPage = page;
    pagenation.limit = limit;
    pagenation.numberOfPages = Math.ceil(countDocuments / limit);

    if (endIndex < countDocuments) {
      pagenation.next = page + 1;
    }
    if (skip > 0) {
      pagenation.prev = page - 1;
    }

    this.MongoosQuery = this.MongoosQuery.skip(skip).limit(limit);
    this.pagenationResult = pagenation;
    return this;
  }
}

module.exports = apiFeatures;
