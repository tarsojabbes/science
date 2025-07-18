import { Router } from "express";
import { JournalController } from "../controllers/journalController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Journals
 *     description: Endpoints related to scientific journals management
 *
 * components:
 *   schemas:
 *     Journal:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         issn:
 *           type: string
 *       required:
 *         - id
 *         - name
 *         - issn
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

router.post('/',  JournalController.create);

/**
 * @swagger
 * /journals:
 *   get:
 *     tags:
 *       - Journals
 *     summary: Get all journals
 *     description: Retrieves a list of all journals.
 *     responses:
 *       200:
 *         description: List of journals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Journal'
 *       500:
 *         description: Server error
 */
router.get('/', JournalController.getAll);

/**
 * @swagger
 * /journals/{id}:
 *   get:
 *     tags:
 *       - Journals
 *     summary: Get journal by ID
 *     description: Retrieves a journal by its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Journal found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.get('/:id', JournalController.getById);

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
router.put('/:id', JournalController.update);

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
 *       200:
 *         description: Journal successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Journal'
 *       404:
 *         description: Journal not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', JournalController.delete);

export default router;