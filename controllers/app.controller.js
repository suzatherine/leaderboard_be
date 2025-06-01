const {
  selectAllTeamNames,
  addTeam,
  checkTeamDoesNotExistWithName,
  selectAllTeams,
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
  return checkTeamDoesNotExistWithName(name_id)
    .then(() => {
      return addTeam(name_id);
    })
    .then((addedTeam) => {
      res.status(201).send({ addedTeam });
    })
    .catch(next);
};
