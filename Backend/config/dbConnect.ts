import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  let DB_URI = "";

  if (process.env.NODE_ENV === "development")
    DB_URI = process.env.DB_LOCAL_URI as string;

  if (process.env.NODE_ENV === "production")
    DB_URI = process.env.DB_URI as string;

  const con = await mongoose.connect(DB_URI);
  console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
};
