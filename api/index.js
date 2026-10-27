// api/index.js — Vercel Serverless Entry Point
// Vercel routes /api/* here, preserving the original request path.
// The Express app owns connection readiness and JSON error responses.
module.exports = require('../server/src/server');
