import mongoose from "mongoose";
// import logger from '..//logger/Logger';

// logger.info();
console.log(
  `MONGO # Connecting to ${process.env.MONGO_URL}/${process.env.MONGO_DB}`
);

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      return console.log(
        `MONGO # Successfully connected to ${process.env.MONGO_URL}/${process.env.MONGO_DB}`
      );
    })
    .catch((error) => {
      console.log(
        `MONGO # Error connecting to ${process.env.MONGO_URL}/${process.env.MONGO_DB}`,
        error
      );
      return process.exit(1);
    });
};
connect();

mongoose.connection.on("disconnected", connect);
