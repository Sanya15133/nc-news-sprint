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
      .then(({ body }) => {
        expect(body.article).toMatchObject({
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
});
