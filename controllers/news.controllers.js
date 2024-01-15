const { selectTopics } = require("../models/news.models");
const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
      console.log(topics);
    })
    .catch((err) => {
      console.log(err, "<<<<<");
      next(err);
    });
};
