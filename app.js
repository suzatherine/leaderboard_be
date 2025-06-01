const express = require("express");
const cors = require("cors");

const {
  badPathCatcher,
  PSQLErrorCatcher,
  customErrorCatcher,
  error500Catcher,
} = require("./controllers/errors.controller");
const {
  getAllTeamNames,
  postTeam,
  getAllTeams,
} = require("./controllers/app.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "Api connected successfully" });
});

app.get("/teamnames", getAllTeamNames);
app.get("/teams", getAllTeams);
app.post("/teams", postTeam);

app.use("/*splat", badPathCatcher);

app.use(PSQLErrorCatcher);

app.use(customErrorCatcher);

app.use(error500Catcher);

module.exports = app;
