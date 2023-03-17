import { connect } from "mongoose";
import { MONGO_URI } from './config.js';

export function dbConnect() {
  // Connecting to the database
  connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
}