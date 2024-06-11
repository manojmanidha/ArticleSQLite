const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  // console.log(token)

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  const regex = /^Bearer\s+(\S+)$/;
  const extracted_token = token.match(regex);

  try {
    const decoded = jwt.verify(extracted_token[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.adminMiddleware = (req, res, next) => {
  console.log(req.user.role)
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  next();
};
