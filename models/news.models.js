const db = require("../db/connection");

exports.selectTopics = () => {
  const query = `SELECT * FROM topics;`;
  return db.query(query).then((res) => {
    return res.rows;
  });
};

exports.findArticlesById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return article;
    });
};

exports.findArticles = () => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      const article = rows[0];
      return article;
    });
};

exports.findArticles = (sort_by = "created_at") => {
  const query = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id):: INT as comment_count FROM articles
  JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY ${sort_by} DESC;`;
  return db.query(query).then(({ rows }) => {
    const articles = rows;
    return articles;
  });
};
