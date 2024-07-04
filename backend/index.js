import connectToDatabase from "./src/database.js";
import app from "./app.js";

connectToDatabase()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening to port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB connection error ${error}`);
    });
