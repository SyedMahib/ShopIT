import mongoose, { Document, Schema } from "mongoose";

// ----- Interfaces -----

export interface IShippingInfo {
  address: string;
  city: string;
  phoneNo: string;
  zipCode: string;
  country: string;
}

export interface IOrderItem {
  name: string;
  quantity: number;
  image: string;
  price: string;
  product: mongoose.Types.ObjectId;
}

export interface IPaymentInfo {
  id?: string;
  status?: string;
}

export interface IOrder extends Document {
  shippingInfo: IShippingInfo;
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  paymentMethod: "COD" | "Card";
  paymentInfo?: IPaymentInfo;
  itemsPrice: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  orderStatus: "Processing" | "Shipped";
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ----- Schema -----

const orderSchema = new Schema<IOrder>(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: [true, "Please select a payment method"],
      enum: {
        values: ["COD", "Card"],
        message: "Please select COD or Card",
      },
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Shipped"],
        message: "Please select correct order status.",
      },
      default: "Processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>("Order", orderSchema);
