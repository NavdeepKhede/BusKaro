const Bus = require('../models/schemas/busSchema');

const getAllBuses = async (req, res, next) => {
  try {
    // Get all buses
    const buses = await Bus.find();
    return res.status(200).json(buses);
  } catch (error) {
    next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    // Get bus by ID
    const busId = req.params.id;
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    return res.status(200).json(bus);
  } catch (error) {
    next(error);
  }
};

const addBus = async (req, res, next) => {
  try {
    const { busName, totalSeats, availableDays, arrival, departure } = req.body;

    // Create a new bus
    const newBus = new Bus({
      busName,
      totalSeats,
      availableDays,
      arrival,
      departure,
    });

    await newBus.save();

    return res.status(201).json({ message: 'Bus added successfully', bus: newBus });
  } catch (error) {
    next(error);
  }
};

const updateBus = async (req, res, next) => {
  try {
    const busId = req.params.id;
    const { busName, totalSeats, availableDays, arrival, departure } = req.body;

    // Update bus by ID
    const updatedBus = await Bus.findByIdAndUpdate(
      busId,
      {
        busName,
        totalSeats,
        availableDays,
        arrival,
        departure,
      },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    return res.status(200).json({ message: 'Bus updated successfully', bus: updatedBus });
  } catch (error) {
    next(error);
  }
};

const deleteBus = async (req, res, next) => {
  try {
    const busId = req.params.id;

    // Delete bus by ID
    const deletedBus = await Bus.findByIdAndDelete(busId);

    if (!deletedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    return res.status(200).json({ message: 'Bus deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBuses, getBusById, addBus, updateBus, deleteBus };

// TODO: Check if user if admin or not