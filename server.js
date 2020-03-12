const express = require('express');

const usersRouter = require("./users/userRouter.js");
const postsRouter = require("./posts/postRouter.js");

const server = express();

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
  const environment = process.env;
  const port = process.env.PORT || 5000;

  res.status(200).json({api: "up", port, environment})
 // res.send(`<h2>Let's write some middleware!</h2>`);
});

//routers to handle endpoints
server.use("/api/users", usersRouter)
//server.use("/api/users/posts", postsRouter)

//custom middleware
function logger(req, res, next) {
  const method = req.method;
  const endpoint = req.originalUrl;
  const date = new Date;

  console.log(`${method} to ${endpoint} at ${date.toLocaleString()}`);
  next();
}

module.exports = server;
