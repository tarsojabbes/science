import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();
const reviewController = new ReviewController();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Manage paper peer-reviews
 *
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         requestDate:
 *           type: string
 *           format: date-time
 *           example: "2025-07-17T12:00:00Z"
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *           example: pending
 *         paperId:
 *           type: integer
 *           example: 10
 *         requesterId:
 *           type: integer
 *           example: 5
 *         firstReviewerId:
 *           type: integer
 *           example: 7
 *         secondReviewerId:
 *           type: integer
 *           example: 8
 *         assignedDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         completedDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         finalDecision:
 *           type: string
 *           enum: [approved, rejected, needs_revision]
 *           nullable: true
 *         editorNotes:
 *           type: string
 *           nullable: true
 *     ReviewResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 100
 *         resultDate:
 *           type: string
 *           format: date-time
 *         reviewerId:
 *           type: integer
 *         reviewId:
 *           type: integer
 *         recommendation:
 *           type: string
 *           enum: [approve, reject, major_revision, minor_revision, not_reviewed]
 *         comments:
 *           type: string
 *         overallScore:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         isSubmitted:
 *           type: boolean
 * 
 * /reviews/request:
 *   post:
 *     summary: Create a new review request for a paper
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *             properties:
 *               paperId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Review successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 */

router.post('/request', authenticateJWT, reviewController.requestReview.bind(reviewController));

/**
 * @swagger
 * /reviews/my-reviews:
 *   get:
 *     summary: Get all review requests for the authenticated reviewer
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of all review requests for the reviewer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/my-reviews', authenticateJWT, reviewController.getReviewsByReviewer.bind(reviewController));

/**
 * @swagger
 * /reviews/pending:
 *   get:
 *     summary: Get pending review requests for the authenticated reviewer
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of pending review requests for the reviewer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/pending', authenticateJWT, reviewController.getPendingReviews.bind(reviewController));

/**
 * @swagger
 * /reviews/paper/{paperId}:
 *   get:
 *     summary: Get all review requests from a paper
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: paperId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Paper Id
 *     responses:
 *       200:
 *         description: List of review requests for the paper
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/paper/:paperId', authenticateJWT, reviewController.getReviewsByPaper.bind(reviewController));

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a review by its id
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review Id
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/:id', authenticateJWT, reviewController.getReviewById.bind(reviewController));

/**
 * @swagger
 * /reviews/{reviewId}/submit:
 *   post:
 *     summary: Submit a review result for a specific review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recommendation
 *               - comments
 *               - overallScore
 *             properties:
 *               recommendation:
 *                 type: string
 *                 enum: [approve, reject, major_revision, minor_revision]
 *                 example: "approve"
 *               comments:
 *                 type: string
 *                 example: "This is a well-written paper with solid methodology."
 *               overallScore:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *     responses:
 *       200:
 *         description: Review result submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reviewResult:
 *                   type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post('/:reviewId/submit', authenticateJWT, reviewController.submitReviewResult.bind(reviewController));

/**
 * @swagger
 * /reviews/{id}/status:
 *   put:
 *     summary: Update a review status by its id
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Review Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 example: "completed"
 *               editorNotes:
 *                 type: string
 *                 example: "Review completed successfully"
 *     responses:
 *       200:
 *         description: Review status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.put('/:id/status', authenticateJWT, reviewController.updateReviewStatus.bind(reviewController));

/**
 * 
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review by its id
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Id of the review to be deleted
 *     responses:
 *       204:
 *         description: Review deleted sucessfully
 *       404:
 *         description: Review not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


export default router;
