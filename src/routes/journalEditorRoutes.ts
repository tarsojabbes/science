import { Router } from 'express';
import { JournalEditorController } from '../controllers/journalEditorController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();
const journalEditorController = new JournalEditorController();

/**
 * @swagger
 * /journals/editors:
 *   post:
 *     tags:
 *       - Journal Editors
 *     summary: Add an editor to a journal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [journalId, userId]
 *             properties:
 *               journalId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Editor added
 *       400:
 *         description: Bad request
 */
// Add editor to journal
router.post('/journals/editors', authenticateJWT, journalEditorController.addEditorToJournal.bind(journalEditorController));

/**
 * @swagger
 * /journals/{journalId}/editors/{userId}:
 *   delete:
 *     tags:
 *       - Journal Editors
 *     summary: Remove an editor from a journal
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Editor removed
 *       400:
 *         description: Bad request
 */
// Remove editor from journal
router.delete('/journals/:journalId/editors/:userId', authenticateJWT, journalEditorController.removeEditorFromJournal.bind(journalEditorController));

/**
 * @swagger
 * /journals/{journalId}/editors:
 *   get:
 *     tags:
 *       - Journal Editors
 *     summary: List editors of a journal
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of editors
 */
// Get all editors of a journal
router.get('/journals/:journalId/editors', authenticateJWT, journalEditorController.getJournalEditors.bind(journalEditorController));

/**
 * @swagger
 * /users/{userId}/journals:
 *   get:
 *     tags:
 *       - Journal Editors
 *     summary: List journals where a user is an editor
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of journals
 */
// Get all journals where a user is an editor
router.get('/users/:userId/journals', authenticateJWT, journalEditorController.getUserJournals.bind(journalEditorController));

/**
 * @swagger
 * /journals/{journalId}/editors/{userId}/permission:
 *   get:
 *     tags:
 *       - Journal Editors
 *     summary: Check if a user is an editor of a journal
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permission status
 */
// Check if user is editor of journal
router.get('/journals/:journalId/editors/:userId/permission', authenticateJWT, journalEditorController.checkEditorPermission.bind(journalEditorController));

export default router; 