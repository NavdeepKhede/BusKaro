const express = require('express');
const { body } = require('express-validator');
const RouteController = require('../controllers/routeController');
const { validate } = require('../middlewares/validationMiddleware');
const { checkAdminRole, authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a Route
router.post(
  '/create',
  [
    body('source').notEmpty(),
    body('destination').notEmpty(),
    body('distance').isInt({ min: 1 }),
    body('eta').isInt({ min: 1 }),
    body('busIds').isArray({ min: 1 }),
  ],
  validate,
  authenticateUser,
  checkAdminRole,
  RouteController.createRoute
);

module.exports = router;
