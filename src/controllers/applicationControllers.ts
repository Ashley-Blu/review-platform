//controllers - middleman between routes and services
import { Request, Response } from "express";
import * as applicationService from "../service/applicationService";

export const addApplication = async (req: Request, res: Response) => {
    try {
        const newApplication = await applicationService.createApplication(req.body) // body request - application data
        res.status(201).json(newApplication)
    } catch (error) {
        res.status(500).json({message: "Error in creating application"})
    }
};

