// sanitizeMiddleware.js

const sanitizeHtml = require("sanitize-html");

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: ["b", "i", "em", "strong", "a"],
          allowedAttributes: {
            a: ["href"],
          },
        });
      }
    }
  }
  next();
};

module.exports = sanitizeMiddleware;
