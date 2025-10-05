import express from 'express';
import { availabilityModel } from '../model/availabilityModel';
import { spaceModel } from '../model/spaceModel';
const spaceRouter = express.Router();
// add new space review 
spaceRouter.post('/addReview/:spaceId', async (req, res) => {
  const { spaceId } = req.params;
  const { user, rating, comment } = req.body;

  try {
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const newReview = {
      user,
      rating,
      comment
    };

    space.reviews.push(newReview);
    await space.save();

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all reviews for a space
spaceRouter.get('/getReviews/:spaceId', async (req, res) => {
  const { spaceId } = req.params;

  try {
    const space = await spaceModel.findById(spaceId).populate('reviews.user');
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    res.status(200).json({
      message: 'Reviews fetched successfully',
      reviews: space.reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Update a review
spaceRouter.put('/updateReview/:spaceId/:reviewId', async (req, res) => {
  const { spaceId, reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const review = space.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await space.save();

    res.status(200).json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a review
spaceRouter.delete('/deleteReview/:spaceId/:reviewId', async (req, res) => {
  const { spaceId, reviewId } = req.params;

  try {
    const space = await spaceModel.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    const review = space.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.remove();
    await space.save();

    res.status(200).json({ message: "Review deleted successfully" });
  }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default spaceRouter;