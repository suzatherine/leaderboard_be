const badPathCatcher = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

const PSQLErrorCatcher = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503"|| err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

const customErrorCatcher = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const error500Catcher = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = {
  badPathCatcher,
  PSQLErrorCatcher,
  customErrorCatcher,
  error500Catcher,
};
