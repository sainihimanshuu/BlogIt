import mongoose from "mongoose";
import { DB_name } from "../../constants.js";

const connectToDatabase = async () => {
    try {
        const connectionResponse = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_name}`
        );
        console.log(`DB is connected to ${connectionResponse.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to database", error);
        process.exit(1);
    }
};

export default connectToDatabase;
