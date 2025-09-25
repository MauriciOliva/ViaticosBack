import { initServer } from "./config/app.js";
import { connect } from "./config/mongo.js";

connect();
initServer();
