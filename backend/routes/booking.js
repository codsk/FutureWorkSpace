import express from "express";
import { bookingModel } from "../model/bookingModel.js";
const bookingRouter = express.Router();

// Create a new booking
bookingRouter.post("/newBooking", async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = new bookingModel(bookingData);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
});
// Get all bookings
bookingRouter.get("/getAllBookings", async (req, res) => {
  try {
    const bookings = await bookingModel.find().populate('user space'); 
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
});
// Get a booking by ID
bookingRouter.get("/getBooking/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id).populate('user space');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
});
// Update a booking
bookingRouter.put("/updateBooking/:id", async (req, res) => {
  try {
    const updatedBooking = await bookingModel.findByIdAndUpdate(req
.params.id, req.body, { new: true }).populate('user space');
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  }
    catch (error) {
        res.status(500).json({ message: "Error updating booking", error });
    }
}
);
// Delete a booking
bookingRouter.delete("/deleteBooking/:id", async (req, res) => {
  try {
    const deletedBooking = await bookingModel.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
});

// Cancel a booking
bookingRouter.post("/cancleBooking/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling booking", error });
  }
});

// Confirm a booking
bookingRouter.post("/confirmBooking/:id", async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    booking.status = 'confirmed';
    await booking.save();
    res.status(200).json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error confirming booking", error });
  }
});

// Get bookings by user ID
bookingRouter.get("/getBookingsByUser/:userId", async (req, res) => {
  try {
    const bookings = await bookingModel.find({ user: req.params.userId }).populate('space');
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
  }
    catch (error) {
        res.status(500).json({ message: "Error fetching bookings for user", error });
    }
});

// Get bookings by space ID
bookingRouter.get("/getBookingsBySpace/:spaceId", async (req, res) => {
  try {
    const bookings = await bookingModel.find({ space: req.params.spaceId }).populate('user');
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this space" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings for space", error });
  }
});
// Get bookings by status
bookingRouter.get("/getBookingsByStatus/:status", async (req, res) => {
  try {
    const bookings = await bookingModel.find({ status: req.params.status }).populate('user space');
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found with this status" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings by status", error });
  }
});

// Get bookings by payment status
bookingRouter.get("/getBookingsByPaymentStatus/:paymentStatus", async (req, res) => {
  try {
    const bookings = await bookingModel.find({ paymentStatus: req.params.paymentStatus }).populate('user space');
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found with this payment status" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings by payment status", error });
  }
});

// Update payment status
bookingRouter.put("/updatePaymentStatus/:id", async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('user space');
    
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment status", error });
  }
});

// Get bookings within a date range
bookingRouter.get("/getBookingsByDateRange", async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const bookings = await bookingModel.find({
        dateFrom: { $gte: new Date(startDate) },
        dateTo: { $lte: new Date(endDate) }
        }).populate('user space');
        
        if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found in this date range" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings by date range", error });
    }
});

// Get bookings by slot type
bookingRouter.get("/getBookingsBySlotType/:slotType", async (req, res) => {
  try {
    const bookings = await bookingModel.find({ slotType: req.params.slotType }).populate('user space');
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this slot type" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings by slot type", error });
  }
});
// Get bookings by user and space
bookingRouter.get("/getBookingsByUserAndSpace/:userId/:spaceId", async (
    req, res) => {
    try {
        const bookings = await bookingModel.find({ user: req.params.userId, space: req.params.spaceId }).populate('user space');
        if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user and space" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings by user and space", error });
    }
});

// Get bookings by user, space, and status
bookingRouter.get("/getBookingsByUserSpaceAndStatus/:userId/:spaceId/:status", async (req, res) => {
  try {
    const bookings = await bookingModel.find({
      user: req.params.userId,
      space: req.params.spaceId,
      status: req.params.status
    }).populate('user space');
    
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user, space, and status" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings by user, space, and status", error });
  }
});




export default bookingRouter;