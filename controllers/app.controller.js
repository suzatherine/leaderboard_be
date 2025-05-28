const { selectAllTeamNames, addTeam } = require("../models/app.model");

exports.getAllTeamNames = (req, res, next) => {
  selectAllTeamNames()
    .then((teamnames) => {
      res.status(200).send({ teamnames });
    })
    .catch(next);
};

exports.postTeam = (req, res, next) => {
  const { id } = req.body;
  addTeam(id).then((addedTeam) => {
    res.status(201).send({ addedTeam });
  });
};
