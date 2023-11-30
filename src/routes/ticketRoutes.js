const express = require('express');
const { body, param } = require('express-validator');
const TicketController = require('../controllers/ticketController');
const { validate } = require('../middlewares/validationMiddleware');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Book a Ticket
router.post(
  '/book',
  [
    body('userId').isMongoId(),
    body('busId').isMongoId(),
    body('seatNumber').isInt({ min: 1 }),
    body('journeyDate').isISO8601()
  ],
  validate,
  authenticateUser,
  TicketController.bookTicket
);


// Cancel a Ticket
router.post(
  '/cancel',
  [body('userId').isMongoId(), body('ticketId').isMongoId()],
  validate,
  authenticateUser,
  TicketController.cancelTicket
);

// Get User's Tickets
router.get(
  '/user/:userId',
  [param('userId').isMongoId()],
  validate,
  authenticateUser,
  TicketController.getUserTickets
);

module.exports = router;
