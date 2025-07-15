import { Router } from "express";
import { IssueController } from "../controllers/issueController";

const router = Router();

router.post('/',  IssueController.create);
router.get('/', IssueController.getAll);
router.get('/:id', IssueController.getById);
router.put('/:id', IssueController.update);
router.delete('/:id', IssueController.delete);

export default router;