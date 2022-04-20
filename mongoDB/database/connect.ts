import mongoose from 'mongoose';

let connectDB = (dbUrl: string) => {
    mongoose
        .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
        .then((res) => console.log("Connected to DB"))
        .catch((error) => console.log(error))
}

export default connectDB;