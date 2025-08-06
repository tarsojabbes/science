import { Request, Response } from "express";
import { PaperService } from "../services/paperService";
import { PaginationQueryPaper, PaperFilters } from "../types/pagination.types";

const service = new PaperService();

const parsePaginationOptions = (query: PaginationQueryPaper) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  const offset = (page - 1) * limit;
  
  const order: [string, string][] = [];
  if (query.sortBy) {
    const allowedSortFields = ['id', 'name', 'publishedDate', 'submissionDate'];
    if (allowedSortFields.includes(query.sortBy)) {
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      order.push([query.sortBy, sortOrder]);
    }
  } else {
    order.push(['id', 'DESC']);
  }

  return {
    page,
    limit,
    offset,
    order
  };
};

const parseFilters = (query: PaginationQueryPaper): PaperFilters => {
  const filters: PaperFilters = {};

  if (query.name) {
    filters.name = query.name;
  }

  if (query.journalId) {
    filters.journalId = parseInt(query.journalId, 10);
  }

  if (query.issueId) {
    filters.issueId = parseInt(query.issueId, 10);
  }

  if (query.publishedAfter) {
    filters.publishedAfter = new Date(query.publishedAfter);
  }

  if (query.publishedBefore) {
    filters.publishedBefore = new Date(query.publishedBefore);
  }

  return filters;
};

export const PaperController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { researchers, ...rest } = req.body;

            const data = {
            ...rest,
            submissionDate: new Date(),
            researcherIds: researchers
            };
            const paper = await service.createPaper(data);
            res.status(201).json(paper);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { researchers, ...rest } = req.body;
            const data = {
                ...rest,
                researcherIds: researchers
            };
            const paper = await service.updatePaper(Number(req.params.id), data);
        
            if (!paper) {
                res.status(404).json({message: "Paper not found"});
                return;
            }
            res.json(paper);
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
            res.sendStatus(204);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async addResearcher(req: Request, res: Response): Promise<void> {
        try {
            const paper = await service.addResearcher(Number(req.params.paperId), Number(req.params.researcherId));
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
            const paper = await service.removeResearcher(Number(req.params.paperId), Number(req.params.researcherId));
            if (!paper) {
                res.status(404).json({message: "User or paper invalid"});
                return;
            }
            res.sendStatus(204);
        } catch (err: any) {
            res.status(500).json({error: err.message})
        }
    },

    async getPaperByResearcher(req: Request, res: Response): Promise<void> {
        try {
            const papers = await service.getPapersByResearcher(Number(req.params.researcherId));
            if (!papers) {
                res.status(404).json({message: "User invalid"});
                return;
            }
            res.json(papers)
        } catch (err: any) {
            res.status(500).json({error: err.message})
        }
    },

    async listWithPagination(req: Request, res: Response): Promise<void> {
        try {
            const paginationOptions = parsePaginationOptions(req.query as PaginationQueryPaper);
            const filters = parseFilters(req.query as PaginationQueryPaper);
            
            const result = await service.getAllPapersWithPagination(paginationOptions, filters);
            res.json(result);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async getPaperByResearcherPaginated(req: Request, res: Response): Promise<void> {
        try {
            const researcherId = Number(req.params.researcherId);
            const paginationOptions = parsePaginationOptions(req.query as PaginationQueryPaper);
            
            const result = await service.getPapersByResearcherWithPagination(researcherId, paginationOptions);
            res.json(result);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    },

    async getPapersByJournalPaginated(req: Request, res: Response): Promise<void> {
        try {
            const journalId = Number(req.params.journalId);
            const paginationOptions = parsePaginationOptions(req.query as PaginationQueryPaper);
            
            const result = await service.getPapersByJournalWithPagination(journalId, paginationOptions);
            res.json(result);
        } catch (err: any) {
            res.status(500).json({error: err.message});
        }
    }
}