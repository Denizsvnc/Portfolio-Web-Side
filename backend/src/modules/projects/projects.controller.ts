import type { Request, Response, NextFunction } from 'express';
import * as ProjectsService from './projects.service';

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProjectsService.createProject(req.body);
        return res.status(201).json({ message: "Project created successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID parameter." });
        }
        const result = await ProjectsService.updateProject({ id, ...req.body });
        if (result.length === 0) {
            return res.status(404).json({ message: "Project not found." });
        }
        return res.status(200).json({ message: "Project updated successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID parameter." });
        }
        const result = await ProjectsService.getProject({ id });
        if (result.length === 0) {
            return res.status(404).json({ message: "Project not found." });
        }
        return res.status(200).json({ message: "Project retrieved successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await ProjectsService.getAllProjects();
        return res.status(200).json({ message: "Projects retrieved successfully.", data: result });
    } catch (error) {
        return next(error);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID parameter." });
        }
        const result = await ProjectsService.deleteProject({ id });
        if (result.length === 0) {
            return res.status(404).json({ message: "Project not found." });
        }
        return res.status(200).json({ message: "Project deleted successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};