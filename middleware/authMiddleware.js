import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // <- must attach `id` here
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
