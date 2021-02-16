const express = require("express");
const cors = require("cors");
const {join} = require("path");
const listEndPoints = require("express-list-endpoints");
const mongoose = require("mongoose");

const usersRouter = require("./services/users");

const {
    badRequestHandler,
    forbiddenHandler,
    notFoundHandler,
    genericErrorHandler,
} = require("./error");

const server = express();

server.use(cors());
const port = process.env.PORT;
const staticFolderPath = join(__dirname,"../public");
server.use(express.static(staticFolderPath));
server.use(express.json());

server.use("/users", usersRouter);

server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.log(listEndPoints(server));

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch(err => console.log(err));