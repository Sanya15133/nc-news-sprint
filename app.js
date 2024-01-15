const express = require("express");
const app = express();
const { getTopics } = require("./controllers/news.controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index");

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.get("/api/topics", getTopics);

module.exports = app;
