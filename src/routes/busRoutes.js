const express = require('express');
const { body, param, query } = require('express-validator');
const BusController = require('../controllers/busController');
const { authenticateUser, checkAdminRole } = require('../middlewares/authMiddleware'); // To be removed
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Get All Buses
router.get('/buses', BusController.getAllBuses);

// Get Bus by ID
router.get(
  '/buses/:id',
  [param('id').isMongoId()],
  validate,
  BusController.getBusById
);

// Add a New Bus
router.post(
  '/buses',
  [
    body('busName').notEmpty(),
    body('totalSeats').isInt({ min: 1 }),
    body('availableDays').isArray().notEmpty(),
    body('arrival').isISO8601(),
    body('departure').isISO8601(),
  ],
  validate,
  authenticateUser,
  checkAdminRole,
  BusController.addBus
);

// Update Bus by ID
router.put(
  '/buses/:id',
  [
    param('id').isMongoId(),
    body('busName').notEmpty(),
    body('totalSeats').isInt({ min: 1 }),
    body('availableDays').isArray().notEmpty(),
    body('arrival').isISO8601(),
    body('departure').isISO8601(),
  ],
  validate,
  authenticateUser,
  checkAdminRole,
  BusController.updateBus
);

// Delete Bus by ID
router.delete(
  '/buses/:id',
  [param('id').isMongoId()],
  validate,
  authenticateUser,
  checkAdminRole,
  BusController.deleteBus
);

router.get('/search',
[query('source').notEmpty(), query('destination').notEmpty(), query('date').isISO8601()], BusController.searchBuses);

module.exports = router;
