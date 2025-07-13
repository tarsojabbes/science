import { Router } from "express";
import { PaperController } from "../controllers/paperController";

const router = Router();

router.post("/", PaperController.create);
router.get("/", PaperController.list);
router.get("/:id", PaperController.findById);
router.delete("/:id", PaperController.delete);
router.post("/:paperId/researcher/:researcherId", PaperController.addResearcher);
router.delete("/:paperId/researcher/:researcherId", PaperController.removeResearcher);
router.get("/researchers/:researcherId", PaperController.getPaperByResearcher);