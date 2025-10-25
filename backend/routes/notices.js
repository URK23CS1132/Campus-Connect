import express from 'express';
import Notice from '../models/Notice.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all notices (Public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error: error.message });
  }
});

// Get single notice
router.get('/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('createdBy', 'name email');
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notice', error: error.message });
  }
});

// Create notice (Admin only)
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    
    const notice = new Notice({
      title,
      description,
      eventDate,
      createdBy: req.user._id
    });

    await notice.save();
    await notice.populate('createdBy', 'name email');
    
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notice', error: error.message });
  }
});

// Update notice (Admin only)
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, description, eventDate },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice updated successfully', notice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notice', error: error.message });
  }
});

// Delete notice (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice', error: error.message });
  }
});

export default router;
