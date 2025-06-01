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
  patchTeamScore,
} = require("./controllers/app.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ msg: "Api connected successfully" });
});

app.get("/api/teamnames", getAllTeamNames);
app.get("/api/teams", getAllTeams);
app.post("/api/teams", postTeam);
app.patch("/api/teams/:team_id", patchTeamScore);

app.use("/*splat", badPathCatcher);

app.use(PSQLErrorCatcher);

app.use(customErrorCatcher);

app.use(error500Catcher);

module.exports = app;
