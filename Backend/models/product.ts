import mongoose, { Document, Schema } from "mongoose";

// --- Interfaces ---

export interface IReview {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

export interface IImage {
  public_id: string;
  url: string;
}

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  ratings: number;
  images: IImage[];
  category: string;
  seller: string;
  stock: number;
  NumOfReviews: number;
  reviews: IReview[];
  user?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// --- Schema ---

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      maxLength: [200, "Product name cannot exceed 200 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please enter product price"],
      maxLength: [5, "Product price cannot exceed 5 digits"],
    },

    description: {
      type: String,
      required: [true, "Please enter product description"],
    },

    ratings: {
      type: Number,
      default: 0,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    category: {
      type: String,
      required: [true, "Please enter product category"],
      enum: {
        values: [
          "Laptops",
          "Cameras",
          "Electronics",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message: "Please select correct category for product",
      },
    },

    seller: {
      type: String,
      required: [true, "Please enter product seller"],
    },

    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
    },

    NumOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", productSchema);
