import { Query } from "mongoose";

class APIFilters {
  query: Query<any[], any>;
  queryStr: Record<string, any>;

  constructor(query: Query<any[], any>, queryStr: Record<string, any>) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filters() {
    const queryCopy = { ...this.queryStr };

    // Fields to remove from the query string (normalized to lowercase keys)
    const fieldsToRemove = ["keyword", "page", "limit", "sort"];
    fieldsToRemove.forEach((el) => {
      Object.keys(queryCopy).forEach((k) => {
        if (k.toLowerCase() === el) delete queryCopy[k];
      });
    });

    const normalized: Record<string, any> = {};
    Object.entries(queryCopy).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        normalized[key] = value;
        return;
      }

      const bracketMatch = key.match(/(.+)\[(.+)\]$/);
      if (bracketMatch) {
        const parent = bracketMatch[1];
        const child = bracketMatch[2];
        if (!normalized[parent]) normalized[parent] = {};
        if (typeof value === "string" && value.includes(",")) {
          normalized[parent][child] = value.split(",").map((v) => (isNaN(Number(v)) ? v : Number(v)));
        } else {
          normalized[parent][child] = isNaN(Number(value as string)) ? value : Number(value as string);
        }
      } else {
        if (Array.isArray(value)) {
          normalized[key] = { $in: value };
        } else if (typeof value === "string" && value.includes(",")) {
          normalized[key] = { $in: value.split(",").map((v) => (isNaN(Number(v)) ? v : Number(v)))};
        } else {
          normalized[key] = isNaN(Number(value as string)) ? value : Number(value as string);
        }
      }
    });

    // Advance filter for price, rating, etc. Convert gt/gte/lt/lte to $gt etc.
    let queryStr = JSON.stringify(normalized);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const sortBy = String(this.queryStr.sort || "");
    switch (sortBy) {
      case "priceAsc":
        this.query = this.query.sort("price _id");
        break;
      case "priceDesc":
        this.query = this.query.sort("-price -_id");
        break;
      case "ratings":
        this.query = this.query.sort("-ratings -_id");
        break;
      case "latest":
        this.query = this.query.sort("-createdAt -_id");
        break;
      default:
        this.query = this.query.sort("-createdAt -_id");
        break;
    }
    return this;
  }

  pagination(resPerPage: number) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
