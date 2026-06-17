import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config({ path:"Backend/config/config.env" });

app.listen(process.env.PORT, () => {
    console.log(`server is running on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});  