import express, { Router } from 'express';
import { protect } from '../controllers/authController';
import * as memoryStore from '../utils/memoryStore';
import certificatesRouter from './certificates';

const router: Router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Skills routes
router.get('/skills', async (req, res) => {
    try {
        const skills = await memoryStore.getAllSkills();
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ 
            message: 'فشل في جلب المهارات',
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
    }
});

router.post('/skills', protect, async (req, res) => {
    try {
        const skill = await memoryStore.createSkill(req.body);
        res.status(201).json(skill);
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ 
            message: 'فشل في إنشاء المهارة',
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
    }
});

router.put('/skills/:id', protect, async (req, res) => {
    try {
        const skill = await memoryStore.updateSkill(req.params.id, req.body);
        if (!skill) {
            return res.status(404).json({ message: 'المهارة غير موجودة' });
        }
        res.json(skill);
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ 
            message: 'فشل في تحديث المهارة',
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
    }
});

router.delete('/skills/:id', protect, async (req, res) => {
    try {
        const success = await memoryStore.deleteSkill(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'المهارة غير موجودة' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ 
            message: 'فشل في حذف المهارة',
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
        });
    }
});

// Use certificates router
router.use('/certificates', certificatesRouter);

// Contact routes
router.post('/contact', async (req, res) => {
    try {
        console.log('Creating new contact with data:', req.body);
        const contact = await memoryStore.createContact(req.body);
        console.log('Contact created successfully:', contact);
        res.status(201).json(contact);
    } catch (error) {
        console.error('Contact creation error:', error);
        res.status(500).json({ 
            message: 'Failed to create contact',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.get('/contact', protect, async (req, res) => {
    try {
        console.log('Attempting to fetch contacts...');
        const contacts = await memoryStore.getAllContacts();
        console.log('Successfully retrieved contacts:', contacts);
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            message: 'Failed to fetch contacts',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.delete('/contact/:id', protect, async (req, res) => {
    try {
        console.log('Attempting to delete contact:', req.params.id);
        const success = await memoryStore.deleteContact(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        console.log('Contact deleted successfully');
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ 
            message: 'Failed to delete contact',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Project routes
router.get('/projects', async (req, res) => {
    try {
        const projects = await memoryStore.getAllProjects();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ 
            message: 'Failed to fetch projects',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.post('/projects', protect, async (req, res) => {
    try {
        const project = await memoryStore.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ 
            message: 'Failed to create project',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.put('/projects/:id', protect, async (req, res) => {
    try {
        const project = await memoryStore.updateProject(req.params.id, req.body);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ 
            message: 'Failed to update project',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.delete('/projects/:id', protect, async (req, res) => {
    try {
        const success = await memoryStore.deleteProject(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ 
            message: 'Failed to delete project',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Personal Info routes
router.get('/personal-info', async (req, res) => {
    try {
        const personalInfo = await memoryStore.getPersonalInfo();
        res.json(personalInfo);
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({ 
            message: 'Failed to fetch personal info',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

router.put('/personal-info', protect, async (req, res) => {
    try {
        const personalInfo = await memoryStore.updatePersonalInfo(req.body);
        res.json(personalInfo);
    } catch (error) {
        console.error('Error updating personal info:', error);
        res.status(500).json({ 
            message: 'Failed to update personal info',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 