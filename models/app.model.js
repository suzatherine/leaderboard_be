const db = require("../db/connection");

exports.selectAllTeamNames = () => {
  return db
    .query(`SELECT * FROM teamnames;`)
    .then(({ rows: teamnames }) => teamnames);
};

exports.selectAllTeams = () => {
  return db
    .query(
      `
   SELECT teams.team_id,teams.name_id, teamnames.name AS team_name, teams.score
   FROM teams
   JOIN teamnames ON teams.name_id = teamnames.id
   ORDER BY score DESC;
    `
    )
    .then(({ rows: teams }) => {
      return teams;
    });
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

exports.checkTeamDoesNotExistWithName = (teamNameId) => {
  return db
    .query(`SELECT * FROM teams WHERE name_id = $1`, [teamNameId])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return Promise.reject({
          status: 400,
          msg: "That teamname has been taken",
        });
      }
    });
};
