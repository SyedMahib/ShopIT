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

export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// Only card orders have payment info. id is the Stripe PaymentIntent once paid,
// sessionId the latest Stripe Checkout Session started for the order.
export interface IPaymentInfo {
  id?: string;
  sessionId?: string;
  status?: PaymentStatus;
}

export const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

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
  orderStatus: OrderStatus;
  paidAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
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
      sessionId: String,
      status: {
        type: String,
        enum: [...PAYMENT_STATUSES],
      },
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
        values: [...ORDER_STATUSES],
        message: "Please select correct order status.",
      },
      default: "Processing",
    },
    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model<IOrder>("Order", orderSchema);
