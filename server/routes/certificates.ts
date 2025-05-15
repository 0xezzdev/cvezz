import express from 'express';
import Certificate from '../models/Certificate';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 });
    res.json(certificates);
  } catch (error: any) {
    console.error('Error in GET /certificates:', error);
    res.status(500).json({ 
      message: 'خطأ في جلب الشهادات',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name
      } : undefined
    });
  }
});

// Create a new certificate (protected)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const certificate = new Certificate(req.body);
    await certificate.save();
    res.status(201).json(certificate);
  } catch (error: any) {
    console.error('Error in POST /certificates:', error);
    res.status(400).json({ 
      message: 'خطأ في إضافة الشهادة',
      error: error.message,
      validation: error.errors
    });
  }
});

// Update a certificate (protected)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!certificate) {
      return res.status(404).json({ message: 'لم يتم العثور على الشهادة' });
    }
    res.json(certificate);
  } catch (error: any) {
    console.error('Error in PUT /certificates/:id:', error);
    res.status(400).json({ 
      message: 'خطأ في تحديث الشهادة',
      error: error.message,
      validation: error.errors
    });
  }
});

// Delete a certificate (protected)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: 'لم يتم العثور على الشهادة' });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error in DELETE /certificates/:id:', error);
    res.status(400).json({ 
      message: 'خطأ في حذف الشهادة',
      error: error.message
    });
  }
});

export default router; 