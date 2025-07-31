import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  console.log('Entered authMiddleware for', req.path); // Add this line to log entry
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log('No token provided'); // Log if token is missing
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach `id` to req.user
    console.log('Token verified successfully for user ID:', decoded.id); // Log success
    next();
  } catch (err) {
    console.error('Auth error:', err.message); // Log error details
    res.status(401).json({ error: "Invalid token" });
  }
}