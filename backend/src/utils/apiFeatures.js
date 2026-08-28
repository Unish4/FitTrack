class APIFeatures {
  constructor(query, queryString) {
    this.query = query; 
    this.queryString = queryString; 
  }

  // FILTER: ?category=strength&difficulty=easy
  // Advanced: ?duration[gte]=30&duration[lte]=60
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert operators: gte → $gte, lte → $lte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // SEARCH: ?search=bench
  search(fields = []) {
    if (this.queryString.search && fields.length > 0) {
      const searchTerm = this.queryString.search;
      const searchRegex = { $regex: searchTerm, $options: "i" };

      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: searchRegex })),
      });
    }
    return this;
  }

  // SORT: ?sort=-date,name
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // LIMIT FIELDS: ?fields=name,category
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // PAGINATE: ?page=2&limit=10
  paginate(defaultLimit = 10) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
