
export default function authProtector(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  //store token in brearer token
  if (!token)
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "invalid or token expired." });
  }
}