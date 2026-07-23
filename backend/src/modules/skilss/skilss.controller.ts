import type { Request, Response, NextFunction } from 'express';
import { createSkill, updateSkill, getSkill, getAllSkills, deleteSkill } from './skilss.service';

export const createSkillSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const result = await createSkill(data);
        return res.status(201).json({ message: "Skill created successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};

export const updateSkillSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID parameter." });
        }
        const data = req.body;
        const result = await updateSkill(id, data);
        if (result.length === 0) {
            return res.status(404).json({ message: "Skill section not found." });
        }
        return res.status(200).json({ message: "Skill updated successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};

export const getAllSkillSections = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getAllSkills();
        return res.status(200).json({ message: "Skills retrieved successfully.", data: result });
    } catch (error) {
        return next(error);
    }
};

export const getSkillSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID parameter." });
        }
        const result = await getSkill({ id });
        if (result.length === 0) {
            return res.status(404).json({ message: "Skill section not found." });
        }
        return res.status(200).json({ message: "Skill retrieved successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }
};

export const deleteSkillSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;  
        if (!id || typeof id !== 'string') {
            return res.status(400).json({ message: "Invalid ID parameter." });
        }   

        const result = await deleteSkill({ id });
        if (result.length === 0) {
            return res.status(404).json({ message: "Skill section not found." });
        }
        return res.status(200).json({ message: "Skill deleted successfully.", data: result[0] });
    } catch (error) {
        return next(error);
    }   
};