const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");

exports.selectTopics = () => {
  const query = `SELECT * FROM topics;`;
  return db.query(query).then((res) => {
    return res.rows;
  });
};

exports.findArticlesById = (id) => {
  let query = `SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id):: INT as comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const validSortBys = ["author", "title", "article_id", "topic"];
  let queryParams = [];
  if (id) {
    queryParams.push(id);
    query += ` WHERE articles.article_id = $1`;
  }

  query += ` GROUP BY articles.article_id;`;

  return db.query(query, queryParams).then(({ rows }) => {
    const article = rows[0];

    if (!article) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return article;
  });
};

exports.findArticles = (sort_by = "created_at", topic, order = "DESC") => {
  let query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id):: INT as comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const queryParams = [];

  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order request" });
  }

  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 404, msg: "Category not found" });
  }
  if (topic) {
    query += ` WHERE topic = $1`;
    queryParams.push(topic);
  }

  if (sort_by) {
    query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}
    `;
  }
  return db.query(query, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.findCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      const articles = rows;
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return articles;
    });
};

exports.findCommentToAdd = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.setVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
      SET votes = votes + $2
      WHERE article_id = $1 RETURNING *;`,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.findCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
