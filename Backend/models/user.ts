import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ----- InterFaces -----
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    getJwtToken(): string;
}

// ------ Schema ------

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxLength: [50, "Your name cannot exceed 50 characters"]
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: [6, "Your password must be longer than 6 characters"],
            select: false
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true }
);

// Encrypting Password before saving user
userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// Return JWT token
userSchema.methods.getJwtToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRE,
    } as any);
}

export default mongoose.model<IUser>("User", userSchema);
