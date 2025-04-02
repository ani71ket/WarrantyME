import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  console.log("Received Token:", token);

  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

export default protect;
