const Route = require('../models/schemas/routeSchema');
const Bus = require('../models/schemas/busSchema');

const createRoute = async (req, res, next) => {
  try {
    let { source, destination, distance, eta, busIds } = req.body;
    source = source.toLowerCase();
    destination = destination.toLowerCase();
    // Check if the source and destination are the same
    if (source === destination) {
      return res.status(400).json({ message: 'Source and destination cannot be the same' });
    }

    // Check if the user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin access required' });
    }

    // Check if the route already exists
    const existingRoute = await Route.findOne({ source, destination });
    if (existingRoute) {
      return res.status(400).json({ message: 'Route already exists' });
    }

    // Check if busIds are valid
    const buses = await Bus.find({ _id: { $in: busIds } });
    if (buses.length !== busIds.length) {
      return res.status(400).json({ message: 'Invalid busIds provided' });
    }

    // Create a new route
    const newRoute = new Route({
      source,
      destination,
      distance,
      eta,
      buses: busIds,
    });

    await newRoute.save();

    // Update buses with the new route
    await Bus.updateMany({ _id: { $in: busIds } }, { $push: { routes: newRoute._id } });

    return res.status(201).json({ message: 'Route created successfully', route: newRoute });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRoute };
