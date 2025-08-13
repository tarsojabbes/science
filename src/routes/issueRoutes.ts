import { Router } from "express";
import { IssueController } from "../controllers/issueController";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { requireEditorPermission } from "../middlewares/editorMiddleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
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
 *       required:
 *         - id
 *         - name
 *         - email
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
 *         - papers
 *
 *     IssueInput:
 *       type: object
 *       properties:
 *         number:
 *           type: integer
 *         volume:
 *           type: integer
 *           format: date
 *         journalId:
 *           type: integer
 *         paperIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array of paper IDs to associate with this issue
 *       required:
 *         - number
 *         - volume
 *         - journalId
 *         - paperIds
 */

/**
 * @swagger
 * /issues:
 *   post:
 *     tags:
 *       - Issues
 *     summary: Create a new issue
 *     description: Adds a new issue to the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IssueInput'
 *     responses:
 *       201:
 *         description: Issue successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       500:
 *         description: Server error
 */
router.post('/', authenticateJWT, requireEditorPermission, IssueController.create);

/**
 * @swagger
 * /issues:
 *   get:
 *     tags:
 *       - Issues
 *     summary: Get all issues
 *     description: Retrieves a list of all issues in the system.
 *     responses:
 *       200:
 *         description: List of issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 *       500:
 *         description: Server error
 */
//router.get('/', IssueController.getAll); // DEPRECATED

/**
 * @swagger
 * /issues/{id}:
 *   get:
 *     tags:
 *       - Issues
 *     summary: Get issue by ID
 *     description: Retrieves an issue by its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Issue found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateJWT, IssueController.getById);

/**
 * @swagger
 * /issues/{id}:
 *   put:
 *     tags:
 *       - Issues
 *     summary: Update an issue
 *     description: Updates the details of an existing issue by ID.
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
 *             $ref: '#/components/schemas/IssueInput'
 *     responses:
 *       200:
 *         description: Issue successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateJWT, IssueController.update);

/**
 * @swagger
 * /issues/{id}:
 *   delete:
 *     tags:
 *       - Issues
 *     summary: Delete an issue
 *     description: Deletes an issue by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Issue successfully deleted
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateJWT, IssueController.delete);

router.get('/', authenticateJWT, IssueController.listWithPaginationAndFilter);

export default router;