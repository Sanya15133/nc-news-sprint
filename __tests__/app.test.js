const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  it("makes a successful get request to the data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});
it("returns topics table with correct array length", () => {
  return request(app)
    .get("/api/topics")
    .then((response) => {
      const {
        body: { topics },
      } = response;
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBe(3);
    });
});
it("returns correct keys in topics", () => {
  return request(app)
    .get("/api/topics")
    .then((response) => {
      const {
        body: { topics },
      } = response;
      topics.forEach((topic) => {
        expect(topic).toHaveProperty("slug");
        expect(topic).toHaveProperty("description");
      });
    });
});
describe("/api", () => {
  it("return object describing all endpoints on api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toHaveProperty("GET /api");
        expect(body).toHaveProperty("GET /api/topics");
        expect(body).toHaveProperty("GET /api/articles");
        expect(body).toHaveProperty("GET /api/articles/:article_id");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("returns article that matches id", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 6,
          title: "A",
          topic: "mitch",
          author: "icellusedkars",
          body: "Delicious tin of cat food",
          created_at: "2020-10-18T01:00:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  it("returns 404 msg for valid id but non-existent article", () => {
    return request(app)
      .get("/api/articles/67985986")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found");
      });
  });
  it("returns 400 msg for invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid request");
      });
  });
});

describe("GET /api/articles", () => {
  it("return array of articles with following properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const {
          body: { articles },
        } = response;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSorted({ descending: true });
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    it("returns article that matches id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const {
            body: { articles },
          } = response;
          articles.forEach((article) => {
            expect(Array.isArray(articles)).toBe(true);
            expect(article).toHaveProperty("comment_id");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("body");
            expect(article).toHaveProperty("article_id");
          });
        });
    });
    it("check property types of values", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          const {
            body: { articles },
          } = response;
          articles.forEach((article) => {
            expect(typeof article["comment_id"]).toBe("number");
            expect(typeof article.votes).toBe("number");
            expect(typeof article["created_at"]).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.body).toBe("string");
            expect(typeof article["article_id"]).toBe("number");
          });
        });
    });

    it("returns 404 msg for valid id but non-existent article", () => {
      return request(app)
        .get("/api/articles/67985986/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article not found");
        });
    });
    it("returns 400 msg for invalid id", () => {
      return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid request");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    it("check property types of posted values", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "this is a comment" })
        .expect(201)
        .then((response) => {
          const {
            body: { comment },
          } = response;
          expect(comment).toMatchObject({
            author: "butter_bridge",
            body: "this is a comment",
          });
        });
    });
    it("POST / returns 404 msg for valid id but non-existent article", () => {
      return request(app)
        .post("/api/articles/67985986/comments")
        .send({ username: "butter_bridge", body: "this is a comment" })
        .expect(404) // here // here
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    it("POST / returns 400 msg for invalid id", () => {
      return request(app)
        .post("/api/articles/not-an-id/comments")
        .send({ username: "butter_bridge", body: "this is a comment" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid request");
        });
    });
    it("POST / returns 400 error if username is not given", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "this is a comment" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    it("POST / returns 404 error if username does not exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "heyfjv", body: "this is a comment" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    it("POST / returns 400 error if body is not given", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    it(" PATCH /updates vote property by article_id", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 6 })
        .expect(200)
        .then((response) => {
          const {
            body: { article },
          } = response;
          expect(article).toMatchObject({
            votes: 6,
          });
        });
    });
    it(" PATCH /updates vote property by article_id for minus numbers", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: -15 })
        .expect(200)
        .then((response) => {
          const {
            body: { article },
          } = response;
          expect(article).toMatchObject({
            votes: -15,
          });
        });
    });

    it("PATCH / returns 404 msg for valid id but non-existent article", () => {
      return request(app)
        .patch("/api/articles/67985986")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not found");
        });
    });
    it("PATCH/ returns 400 msg for invalid id", () => {
      return request(app)
        .patch("/api/articles/not-an-id")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Invalid request");
        });
    });
    it("PATCH / returns 400 error if votes is empty", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    it("PATCH / returns 400 error if votes is not the property being sent", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ orange: 7 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    describe("DELETE /api/comments/:comment_id", () => {
      it("DELETE / deletes comment by comment id", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      it("DELETE / returns 400 for invalid comment id", () => {
        return request(app)
          .delete("/api/comments/not-an-id")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid request");
          });
      });
      it("DELETE / returns 404 not found for valid but non-existant comment id", () => {
        return request(app)
          .delete("/api/comments/875")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Comment not found");
          });
      });
    });
    describe("/api/users", () => {
      it("returns users table with correct array length and properties", () => {
        return request(app)
          .get("/api/users")
          .then((response) => {
            const {
              body: { users },
            } = response;
            expect(Array.isArray(users)).toBe(true);
            expect(users.length).toBe(4);
            expect(response.status).toBe(200);
            users.forEach((user) => {
              expect(user).toHaveProperty("username");
              expect(user).toHaveProperty("name");
              expect(user).toHaveProperty("avatar_url");
            });
          });
      });
    });
  });
});
