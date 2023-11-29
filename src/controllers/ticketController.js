const Ticket = require('../models/schemas/ticketSchema');
const Bus = require('../models/schemas/busSchema');
const { checkAdminRole } = require('../middlewares/authMiddleware');

const bookTicket = async (req, res, next) => {
  try {
    // TODO: get date of journey and use it
    let { userId, busId, seatNumber, journeyDate } = req.body;

    // Check if the user has admin role
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin cannot book tickets' });
    }

    // Check if the seat is available
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    journeyDate = new Date(journeyDate);
    journeyweekday = journeyDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if(!bus.availableDays.includes(journeyweekday)){
      return res.status(400).json({ message: 'Bus not available on this day' });
    }
    journeyDate = journeyDate.toLocaleDateString();
    let occupiedSeatsOnDate =[];
    if (bus.occupiedSeats){
      occupiedSeatsOnDate = bus.occupiedSeats.get(journeyDate) || [];
    }
    if (seatNumber > bus.totalSeats || occupiedSeatsOnDate.includes(seatNumber)) {
      return res.status(400).json({ message: 'Seat not available' });
    }

    // Book a new ticket
    const newTicket = new Ticket({
      user: userId,
      bus: busId,
      seatNumber,
      journeyDate
    });

    await newTicket.save();

    // Update bus with the booked seat
    occupiedSeatsOnDate.push(seatNumber);
    bus.occupiedSeats.set(journeyDate, occupiedSeatsOnDate);
    await bus.save();

    return res.status(201).json({ message: 'Ticket booked successfully', ticket: newTicket });
  } catch (error) {
    next(error);
  }
};

const cancelTicket = async (req, res, next) => {
  try {
    const { userId, ticketId } = req.body;

    // Check if the user has admin role
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin cannot cancel tickets' });
    }

    // Check if the ticket belongs to the user
    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this ticket' });
    }

    // Cancel the ticket
    await Ticket.findByIdAndUpdate(ticketId,{ $set: {status:'canceled'}});

    // Update bus to free up the seat
    // await Bus.findByIdAndUpdate(ticket.bus, { $pull: { occupiedSeats: ticket.seatNumber } });
     // Update bus to free up the seat
    const bus = await Bus.findById(ticket.bus);
    let ticketDate = new Date(ticket.journeyDate).toLocaleDateString();
    const occupiedSeatsOnDate = bus.occupiedSeats.get(ticketDate) || [];
    const seatIndex = occupiedSeatsOnDate.indexOf(ticket.seatNumber);
    if (seatIndex > -1) {
      occupiedSeatsOnDate.splice(seatIndex, 1);
      bus.occupiedSeats.set(ticketDate, occupiedSeatsOnDate);
      await bus.save();
    }

    return res.status(200).json({ message: 'Ticket canceled successfully' });
  } catch (error) {
    next(error);
  }
};

const getUserTickets = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Check if the user has admin role
    if (req.user.role === 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized. Admin cannot view other user tickets' });
    }

    // Get user's tickets
    const tickets = await Ticket.find({ user: userId }).populate('bus');

    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

module.exports = { bookTicket, cancelTicket, getUserTickets };
