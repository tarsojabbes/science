import { Router } from "express";
import { JournalController } from "../controllers/journalController";
import { authenticateJWT } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Journals
 *     description: Endpoints related to scientific journals management
 *
 * components:
 *   schemas:
 *     Issue:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         number:
 *           type: integer
 *         volume:
 *           type: integer
 *         publishedDate:
 *           type: string
 *           format: date
 *         journalId:
 *           type: integer
 *         papers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Paper'
 *       required:
 *         - id
 *         - number
 *         - volume
 *         - publishedDate
 *         - journalId
 *
 *     Paper:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         publishedDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         submissionDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         url:
 *           type: string
 *           nullable: true
 *         journalId:
 *           type: integer
 *         issueId:
 *           type: integer
 *           nullable: true
 *         researchers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *       required:
 *         - id
 *         - name
 *         - journalId
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         institution:
 *           type: string
 *         orcid:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - id
 *         - name
 *         - email
 *         - password
 *         - roles
 *
 *     Journal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         issn:
 *           type: string
 *         issues:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Issue'
 *           description: List of all issues published in this journal
 *       required:
 *         - id
 *         - name
 *         - issn
 *         - issues
 *
 *     JournalInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         issn:
 *           type: string
 *       required:
 *         - name
 *         - issn
 */

/**
 * @swagger
 * /journals:
 *   post:
 *     tags:
 *       - Journals
 *     summary: Create a new journal
 *     description: Adds a new journal to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalInput'
 *     responses:
 *       201:
 *         description: Journal successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       500:
 *         description: Server error
 */
router.post('/', JournalController.create);

/**
 * @swagger
 * /journals:
 *   get:
 *     tags:
 *       - Journals
 *     summary: Get all journals
 *     description: Retrieves a list of all journals with their associated issues and papers.
 *     responses:
 *       200:
 *         description: List of journals with their issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journal'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateJWT, JournalController.getAll);

/**
 * @swagger
 * /journals/{id}:
 *   get:
 *     tags:
 *       - Journals
 *     summary: Get journal by ID
 *     description: Retrieves a journal by its unique ID, including all its issues and associated papers.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Journal found with its issues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateJWT, JournalController.getById);

/**
 * @swagger
 * /journals/{id}:
 *   put:
 *     tags:
 *       - Journals
 *     summary: Update a journal
 *     description: Updates an existing journal by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JournalInput'
 *     responses:
 *       200:
 *         description: Journal successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateJWT, JournalController.update);

/**
 * @swagger
 * /journals/{id}:
 *   delete:
 *     tags:
 *       - Journals
 *     summary: Delete a journal
 *     description: Deletes a journal by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Journal successfully deleted
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateJWT, JournalController.delete);

export default router;