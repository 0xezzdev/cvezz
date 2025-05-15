import { Request, Response } from 'express';
import Contact from '../models/Contact';
import nodemailer from 'nodemailer';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit contact form
export const submitContact = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all contact messages (for admin)
export const getContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Respond to contact message
export const respondToContact = async (req: Request, res: Response) => {
  try {
    const { response } = req.body;
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Send email response
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      text: response,
    });

    // Update contact status
    contact.status = 'responded';
    contact.response = response;
    contact.respondedAt = new Date();
    await contact.save();

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 