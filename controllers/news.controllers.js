const {
  selectTopics,
  findArticlesById,
  findArticles,
  findCommentsByArticleId,
  findCommentToAdd,
  setVotes,
  findCommentByCommentId,
  selectUsers,
} = require("../models/news.models");
const {
  checkTopicExists,
  checkCategoryExists,
} = require("../check-topic-exists");
const fs = require("fs/promises");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  const endpoints = require("../endpoints.json");
  res.status(200).send(endpoints);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  findArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by, topic, order } = req.query;
  const fetchArticleQuery = findArticles(sort_by, topic, order);
  let queries = [fetchArticleQuery];

  if (topic) {
    const topicExistence = checkTopicExists(topic);
    queries.push(topicExistence);
  }

  Promise.all(queries)
    .then((response) => {
      const articles = response[0];
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  findCommentsByArticleId(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  findCommentToAdd(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  setVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;

  findCommentByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
