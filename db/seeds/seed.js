const format = require("pg-format");
const db = require("../connection");

const seed = ({ teamnames, teams }) => {
  return db
    .query(`DROP TABLE IF EXISTS teams;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS teamnames;`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE teamnames (
      id SERIAL PRIMARY KEY,
      name VARCHAR
    );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE teams (
      team_id SERIAL PRIMARY KEY,
      name_id INT REFERENCES teamnames(id) NOT NULL,
      score INT DEFAULT 0
    );`);
    })
    .then(() => {
      const teamNamesCopy = structuredClone(teamnames);
      const formattedTeamNamesCopy = teamNamesCopy.map((teamName) => {
        return [teamName.name];
      });
      const insertTeamNamesQuery = format(
        `
      INSERT INTO teamnames
      (name)
      VALUES
      %L
      `,
        formattedTeamNamesCopy
      );
      return db.query(insertTeamNamesQuery);
    })
    .then(() => {
      const teamsCopy = structuredClone(teams);
      const formattedTeamsCopy = teamsCopy.map((team) => {
        return [team.name_id, team.score];
      });
      const insertTeamsQuery = format(
        `
      INSERT INTO teams
      (name_id, score)
      VALUES
      %L
      `,
        formattedTeamsCopy
      );
      return db.query(insertTeamsQuery);
    });
};

module.exports = seed;
