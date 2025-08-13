import { Router } from 'express';
import { JournalReviewerController } from '../controllers/journalReviewerController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();
const journalReviewerController = new JournalReviewerController();

/**
 * @swagger
 * /journals/reviewers:
 *   post:
 *     tags:
 *       - Journal Reviewers
 *     summary: Add a reviewer to a journal
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
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Reviewer added
 *       400:
 *         description: Bad request
 */
// Add reviewer to journal
router.post('/journals/reviewers', authenticateJWT, journalReviewerController.addReviewerToJournal.bind(journalReviewerController));

/**
 * @swagger
 * /journals/{journalId}/reviewers/{userId}:
 *   delete:
 *     tags:
 *       - Journal Reviewers
 *     summary: Remove a reviewer from a journal
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
 *         description: Reviewer removed
 *       400:
 *         description: Bad request
 */
// Remove reviewer from journal
router.delete('/journals/:journalId/reviewers/:userId', authenticateJWT, journalReviewerController.removeReviewerFromJournal.bind(journalReviewerController));

/**
 * @swagger
 * /journals/{journalId}/reviewers:
 *   get:
 *     tags:
 *       - Journal Reviewers
 *     summary: List reviewers of a journal
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviewers
 */
// Get all reviewers of a journal
router.get('/journals/:journalId/reviewers', authenticateJWT, journalReviewerController.getJournalReviewers.bind(journalReviewerController));

/**
 * @swagger
 * /users/{userId}/reviewer-journals:
 *   get:
 *     tags:
 *       - Journal Reviewers
 *     summary: List journals where a user is a reviewer
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
// Get all journals where a user is a reviewer
router.get('/users/:userId/reviewer-journals', authenticateJWT, journalReviewerController.getUserReviewerJournals.bind(journalReviewerController));

/**
 * @swagger
 * /journals/{journalId}/reviewers/{userId}/expertise:
 *   put:
 *     tags:
 *       - Journal Reviewers
 *     summary: Update reviewer expertise
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [expertise]
 *             properties:
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Expertise updated
 *       400:
 *         description: Bad request
 */
// Update reviewer expertise
router.put('/journals/:journalId/reviewers/:userId/expertise', authenticateJWT, journalReviewerController.updateReviewerExpertise.bind(journalReviewerController));

/**
 * @swagger
 * /journals/{journalId}/reviewers/{userId}/deactivate:
 *   put:
 *     tags:
 *       - Journal Reviewers
 *     summary: Deactivate reviewer
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
 *         description: Reviewer deactivated
 */
// Deactivate reviewer
router.put('/journals/:journalId/reviewers/:userId/deactivate', authenticateJWT, journalReviewerController.deactivateReviewer.bind(journalReviewerController));

/**
 * @swagger
 * /journals/{journalId}/reviewers/{userId}/activate:
 *   put:
 *     tags:
 *       - Journal Reviewers
 *     summary: Activate reviewer
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
 *         description: Reviewer activated
 */
// Activate reviewer
router.put('/journals/:journalId/reviewers/:userId/activate', authenticateJWT, journalReviewerController.activateReviewer.bind(journalReviewerController));

/**
 * @swagger
 * /journals/{journalId}/reviewers/{userId}/permission:
 *   get:
 *     tags:
 *       - Journal Reviewers
 *     summary: Check if a user is a reviewer of a journal and list expertise
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
 *         description: Permission and expertise
 */
// Check if user is reviewer of journal
router.get('/journals/:journalId/reviewers/:userId/permission', authenticateJWT, journalReviewerController.checkReviewerPermission.bind(journalReviewerController));

export default router; 