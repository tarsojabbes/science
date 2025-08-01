import { Router } from "express";
import { PaperController } from "../controllers/paperController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Papers
 *   description: Endpoints related to academic paper management
 *   components:
 *      schemas:
 *        Paper:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *            name:
 *              type: string
 *            url:
 *              type: string
 *            submissionDate:
 *              type: string
 *              format: date
 *            publishedDate:
 *              type: string
 *              format: date
 *            journalId:
 *              type: integer
 *            issueId:
 *              type: integer
 *            researchers:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *          required:
 *            - name
 *            - journalId
 *      
 *        PaperInput:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            url:
 *              type: string
 *            journalId:
 *              type: integer
 *            issueId:
 *              type: integer
 *            researchers:
 *              type: array
 *              items:
 *                type: integer
 *          required:
 *            - name
 *            - journalId
 *            - researchers
 *      
 *        User:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *            name:
 *              type: string
 *            email:
 *              type: string
 *          required:
 *            - id
 *            - name
 *            - email
 */

/**
 * @swagger
 * /papers:
 *   post:
 *     summary: Create a new paper
 *     tags: [Papers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               journalId:
 *                 type: integer
 *               researchers:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Paper created successfully
 *       500:
 *         description: Server error
 */
router.post("/", PaperController.create);

/**
 * @swagger
 * /papers:
 *   get:
 *     summary: Retrieve a list of all papers
 *     tags: [Papers]
 *     responses:
 *       200:
 *         description: A list of papers
 *       500:
 *         description: Server error
 */
router.get("/", PaperController.list);

/**
 * @swagger
 * /papers/{id}:
 *   get:
 *     summary: Get paper details by ID
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paper ID
 *     responses:
 *       200:
 *         description: Paper found
 *       404:
 *         description: Paper not found
 *       500:
 *         description: Server error
 */
router.get("/:id", PaperController.findById);

/**
 * @swagger
 * /papers/{id}:
 *   delete:
 *     summary: Delete a paper by ID
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paper ID
 *     responses:
 *       204:
 *         description: Paper deleted
 *       404:
 *         description: Paper not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", PaperController.delete);

/**
 * @swagger
 * /papers/{id}:
 *   put:
 *     summary: Update a paper by ID
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paper ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               url:
 *                 type: string
 *               journalId:
 *                 type: integer
 *               researchers:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Paper updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paper'
 *       404:
 *         description: Paper not found
 *       500:
 *         description: Server error
 */
router.put("/:id", PaperController.update);

/**
 * @swagger
 * /papers/{paperId}/researcher/{researcherId}:
 *   post:
 *     summary: Add a researcher to a paper
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paper ID
 *       - in: path
 *         name: researcherId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Researcher ID
 *     responses:
 *       200:
 *         description: Researcher added to paper
 *       404:
 *         description: Paper or researcher not found
 *       500:
 *         description: Server error
 */
router.post("/:paperId/researcher/:researcherId", PaperController.addResearcher);

/**
 * @swagger
 * /papers/{paperId}/researcher/{researcherId}:
 *   delete:
 *     summary: Remove a researcher from a paper
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: paperId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Paper ID
 *       - in: path
 *         name: researcherId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Researcher ID
 *     responses:
 *       204:
 *         description: Researcher removed from paper
 *       404:
 *         description: Paper or researcher not found
 *       500:
 *         description: Server error
 */
router.delete("/:paperId/researcher/:researcherId", PaperController.removeResearcher);

/**
 * @swagger
 * /papers/researchers/{researcherId}:
 *   get:
 *     summary: Get all papers by a specific researcher
 *     tags: [Papers]
 *     parameters:
 *       - in: path
 *         name: researcherId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Researcher ID
 *     responses:
 *       200:
 *         description: List of papers by the researcher
 *       404:
 *         description: Researcher not found
 *       500:
 *         description: Server error
 */
router.get("/researchers/:researcherId", PaperController.getPaperByResearcher);

export default router;