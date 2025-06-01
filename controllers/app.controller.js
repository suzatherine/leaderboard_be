const {
  selectAllTeamNames,
  addTeam,
  checkTeamDoesNotExistWithName,
  selectAllTeams,
  updateTeamScore,
} = require("../models/app.model");

exports.getAllTeamNames = (req, res, next) => {
  return selectAllTeamNames()
    .then((teamnames) => {
      res.status(200).send({ teamnames });
    })
    .catch(next);
};

exports.getAllTeams = (req, res, next) => {
  return selectAllTeams()
    .then((teams) => {
      res.status(200).send({ teams });
    })
    .catch(next);
};

exports.postTeam = (req, res, next) => {
  const { name_id } = req.body;
  if (!name_id) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return checkTeamDoesNotExistWithName(name_id)
    .then(() => {
      return addTeam(name_id);
    })
    .then((addedTeam) => {
      res.status(201).send({ addedTeam });
    })
    .catch(next);
};

exports.patchTeamScore = (req, res, next) => {
  const { team_id } = req.params;
  const { score_increment } = req.body;
  if (!score_increment) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return updateTeamScore(team_id, score_increment)
    .then((updatedTeam) => {
      res.status(201).send({ updatedTeam });
    })
    .catch(next);
};
