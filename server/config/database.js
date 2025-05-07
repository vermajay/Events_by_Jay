// Importing dependencies using ES6 syntax
import mongoose from "mongoose";
import dotenv from "dotenv";

// Configuring environment variables
dotenv.config();

// Exporting the dbConnect function as a named export
export const dbConnect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Connection with database successful`))
        .catch((error) => {
            console.error(error);
            console.log("Issue in connecting to database");
            process.exit(1);
        });
};
