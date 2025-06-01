const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
require("jest-sorted");

// require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Non-existant path", () => {
  test("404: path not found", () => {
    return request(app)
      .get("/notAPath")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not found");
      });
  });
});

describe("200 GET /teamnames", () => {
  test("200: returns all team names", () => {
    return request(app)
      .get("/teamnames")
      .then(({ body: { teamnames } }) => {
        expect(teamnames.length).toBeGreaterThan(0);
        teamnames.forEach((teamName) => {
          expect(teamName).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
          });
        });
      });
  });
});

describe("200 GET /teams", () => {
  test("200: returns all teams, sorted by score ascending", () => {
    return request(app)
      .get("/teams")
      .then(({ body: { teams } }) => {
        expect(teams.length).toBeGreaterThan(0);
        teams.forEach((team) => {
          expect(team).toMatchObject({
            name_id: expect.any(Number),
            team_id: expect.any(Number),
            team_name: expect.any(String),
            score: expect.any(Number),
          });
        });
        expect(teams).toBeSorted({ key: "score", descending: true });
      });
  });
});

describe("201 POST /teams", () => {
  test("201: add a team to the list of teams, ", () => {
    const unusedNameId = 2;
    return request(app)
      .post("/teams")
      .send({ name_id: unusedNameId })
      .expect(201)
      .then(({ body: { addedTeam } }) => {
        expect(addedTeam).toMatchObject({
          team_id: expect.any(Number),
          name_id: unusedNameId,
          score: 0,
        });
      });
  });

  test("400: Can't post an existing teamname to the list of teams", () => {
    return request(app)
      .post("/teams")
      .send({ name_id: 1 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("That teamname has been taken");
      });
  });

  test("404: when provided with id for non-existant name_id", () => {
    return request(app)
      .post("/teams")
      .send({ name_id: 1000 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No teamname exists with that id");
      });
  });
  test("400: when provided with invalid name_id", () => {
    return request(app)
      .post("/teams")
      .send({ name_id: "katherine" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: when provided body with missing properties", () => {
    return request(app)
      .post("/teams")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("PATCH /teams/:team_id", () => {
  test("201: should return team with score updated by provided increment", () => {
    return request(app)
      .patch("/teams/1")
      .send({ score_increment: 1000 })
      .expect(201)
      .then(({ body: { updatedTeam } }) => {
        expect(updatedTeam.score).toBeGreaterThan(1000);
      });
  });
  test("400: return 400 bad request when invalid id provided", () => {
    return request(app)
      .patch("/teams/katherine")
      .send({ score_increment: 1000 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("404: return 404 if valid but non-existent team id provided", () => {
    return request(app)
      .patch("/teams/3000")
      .send({ score_increment: 1000 })
      .expect(404)
      .then(({ body: response }) => {
        console.log(response);
        // expect(msg).toBe("No team exists with that id");
      });
  });

  // 400 nonexistant keys
});

describe("GET /api", () => {
  test("200: should return healthcheck message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Api connected successfully");
      });
  });
});
