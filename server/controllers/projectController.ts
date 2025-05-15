import { Request, Response } from 'express';
import * as memoryStore from '../utils/memoryStore';

// Get all projects
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await memoryStore.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a project
export const createProject = async (req: Request, res: Response) => {
  try {
    const project = await memoryStore.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await memoryStore.updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const success = await memoryStore.deleteProject(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 