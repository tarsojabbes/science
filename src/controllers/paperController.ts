import { Request, Response } from "express";
import { PaperService } from "../services/paperService";

const service = new PaperService();

export const PaperController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const paper = await service.createPaper(req.body);
            res.status(201).json(paper);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const paper = await service.updatePaper(Number(req.params.id), req.body);
            res.status(204);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async list(req: Request, res: Response): Promise<void> {
        try {
            const papers = await service.getAllPapers();
            res.json(papers);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const paper = await service.getPaperById(Number(req.params.id));
            if (!paper) {
                res.status(404).json({message: "Paper not found"});
                return;
            }
            res.json(paper);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const deleted = await service.deletePaper(Number(req.params.id));
            if (!deleted) {
                res.status(404).json({message: "Paper not found"});
                return;
            }
            res.json(deleted);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async addResearcher(req: Request, res: Response): Promise<void> {
        try {
            const paper = service.addResearcher(Number(req.params.paperId), Number(req.params.researcherId));
            if (!paper) {
                res.status(404).json({message: "User or paper invalid"});
                return;
            }
            res.json(paper)
        } catch (err: any) {
            res.status(500).json({error: err.message})
        }
    },

    async removeResearcher(req: Request, res: Response): Promise<void> {
        try {
            const paper = service.removeResearcher(Number(req.params.paperId), Number(req.params.researcherId));
            if (!paper) {
                res.status(404).json({message: "User or paper invalid"});
                return;
            }
            res.json(paper)
        } catch (err: any) {
            res.status(500).json({error: err.message})
        }
    },

    async getPaperByResearcher(req: Request, res: Response): Promise<void> {
        try {
            const papers = service.getPapersByResearcher(Number(req.params.researcherId));
            if (!papers) {
                res.status(404).json({message: "User invalid"});
                return;
            }
            res.json(papers)
        } catch (err: any) {
            res.status(500).json({error: err.message})
        }
    }
}