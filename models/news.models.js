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
