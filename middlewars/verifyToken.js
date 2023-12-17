const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  console.log("token", token);
  next();
};

module.exports = verifyToken;
