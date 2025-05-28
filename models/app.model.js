const db = require("../db/connection");

exports.selectAllTeamNames = () => {
  return db
    .query(`SELECT * FROM teamnames;`)
    .then(({ rows: teamnames }) => teamnames);
};

exports.addTeam = (teamnameId) => {
  return db
    .query(
      `
    INSERT INTO teams
    (name_id)  
    VALUES
    ($1)
    RETURNING *;`,
      [teamnameId]
    )
    .then(({ rows: [addedTeam] }) => {
      return addedTeam;
    });
};
