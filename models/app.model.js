const db = require("../db/connection");

exports.selectAllTeamNames = (used) => {
  console.log(used, "used");
  let usedClause = "";
  if (used) {
    usedClause = `WHERE used = ${used}`;
  }
  return db
    .query(`SELECT * FROM teamnames ${usedClause};`)
    .then(({ rows: teamnames }) => teamnames)
    .catch((err) => {
      console.log(err);
    });
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
  const insertTeamPromise = db.query(
    `
    INSERT INTO teams
    (name_id)  
    VALUES
    ($1)
    RETURNING *;`,
    [teamnameId]
  );
  const updateTeamNameTablePromise = db.query(
    `
    UPDATE teamnames
    SET used = true
    WHERE id = $1
    RETURNING *;
        `,
    [teamnameId]
  );
  return Promise.all([insertTeamPromise, updateTeamNameTablePromise]).then(
    ([insertTeamResponse]) => {
      const { rows } = insertTeamResponse;
      const addedTeam = rows[0];
      return addedTeam;
    }
  );
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

exports.updateTeamScore = (team_id, score_increment) => {
  return db
    .query(
      `
    UPDATE teams
    SET score = score + $1
    WHERE team_id = $2
    RETURNING *;
    `,
      [score_increment, team_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No teams exist with that id",
        });
      } else {
        return rows[0];
      }
    });
};
