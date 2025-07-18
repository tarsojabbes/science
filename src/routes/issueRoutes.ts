import { Router } from "express";
import { IssueController } from "../controllers/issueController";

const router = Router();

/**
 * @swagger
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
 *       required:
 *         - id
 *         - number
 *         - volume
 *         - publishedDate
 *         - journalId
 *
 *     IssueInput:
 *       type: object
 *       properties:
 *         number:
 *           type: integer
 *         volume:
 *           type: integer
 *         publishedDate:
 *           type: string
 *           format: date
 *         journalId:
 *           type: integer
 *       required:
 *         - number
 *         - volume
 *         - publishedDate
 *         - journalId
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
router.post('/',  IssueController.create);

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
router.get('/', IssueController.getAll);

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
router.get('/:id', IssueController.getById);

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
router.put('/:id', IssueController.update);

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
 *       200:
 *         description: Issue successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 *       404:
 *         description: Issue not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', IssueController.delete);

export default router;