import express from 'express';
import Registration from '../models/Registration.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register for an event
router.post('/', authenticate, async (req, res) => {
  try {
    const { noticeId } = req.body;

    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      notice: noticeId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    const registration = new Registration({
      user: req.user._id,
      notice: noticeId
    });

    await registration.save();
    res.status(201).json({ message: 'Successfully registered for event', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for event', error: error.message });
  }
});

// Get user's registrations
router.get('/my-registrations', authenticate, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('notice')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
});

// Get registrations for a specific notice (Admin or to check if registered)
router.get('/notice/:noticeId', authenticate, async (req, res) => {
  try {
    const registrations = await Registration.find({ notice: req.params.noticeId })
      .populate('user', 'name email');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations', error: error.message });
  }
});

// Leaderboard: Top users by registrations
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Registration.aggregate([
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$user._id', name: '$user.name', email: '$user.email', count: 1 } }
    ]);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

export default router;
