const db = require("../db/connection");

exports.selectTopics = () => {
  const query = `SELECT * FROM topics;`;
  return db.query(query).then((res) => {
    console.log(res.rows, "<<<<<rows");
    return res.rows;
  });
};
