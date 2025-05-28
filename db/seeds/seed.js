const format = require("pg-format");
const db = require("../connection");

const seed = ({ teamnames }) => {
  return db
    .query(`DROP TABLE IF EXISTS teams;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS teamnames;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE teamnames (
        id SERIAL PRIMARY KEY,
        name VARCHAR,
        used BOOLEAN
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
        return [teamName.name, teamName.used];
      });
      const insertTeamNamesQuery = format(
        `
        INSERT INTO teamnames 
        (name, used)
        VALUES
        %L
        `,
        formattedTeamNamesCopy
      );
      return db.query(insertTeamNamesQuery);
    });
};

module.exports = seed;
