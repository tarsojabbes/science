import { Router } from 'express';
import { ReviewResultController } from '../controllers/reviewResultController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ReviewResults
 *   description: Management of review results (comments and approvals)
 *
 * components:
 *   schemas:
 *     ReviewResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 100
 *         firstReviewerNote:
 *           type: string
 *           example: "Detailed note from the first reviewer"
 *         secondReviewerNote:
 *           type: string
 *           example: "Comments from the second reviewer"
 *         resultDate:
 *           type: string
 *           format: date-time
 *           example: "2025-07-20T15:00:00Z"
 *         approval:
 *           type: boolean
 *           example: true
 *         reviewId:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /review-results:
 *   post:
 *     summary: Create a new review result for a review
 *     tags: [ReviewResults]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewId
 *               - firstReviewerNote
 *               - secondReviewerNote
 *               - approval
 *             properties:
 *               reviewId:
 *                 type: integer
 *                 example: 1
 *               firstReviewerNote:
 *                 type: string
 *                 example: "Detailed note from the first reviewer"
 *               secondReviewerNote:
 *                 type: string
 *                 example: "Comments from the second reviewer"
 *               approval:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Review result created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResult'
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
router.post('/', authenticateJWT, ReviewResultController.create);

/**
 * @swagger
 * /review-results/{id}:
 *   get:
 *     summary: Get a review result by its ID
 *     tags: [ReviewResults]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the review result
 *     responses:
 *       200:
 *         description: Review result found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResult'
 *       404:
 *         description: Review result not found
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
router.get('/:id', authenticateJWT, ReviewResultController.getById);

/**
 * @swagger
 * /review-results/review/{reviewId}:
 *   get:
 *     summary: Get all review results for a specific review
 *     tags: [ReviewResults]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the review
 *     responses:
 *       200:
 *         description: List of review results for the review
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReviewResult'
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
router.get('/review/:reviewId', authenticateJWT, ReviewResultController.getByReview);

/**
 * @swagger
 * /review-results/{id}:
 *   put:
 *     summary: Update a review result by its ID
 *     tags: [ReviewResults]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the review result
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstReviewerNote:
 *                 type: string
 *                 example: "Updated note from the first reviewer"
 *               secondReviewerNote:
 *                 type: string
 *                 example: "Updated comments from the second reviewer"
 *               approval:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Review result successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewResult'
 *       404:
 *         description: Review result not found
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
router.put('/:id', authenticateJWT, ReviewResultController.update);

/**
 * @swagger
 * /review-results/{id}:
 *   delete:
 *     summary: Delete a review result by its ID
 *     tags: [ReviewResults]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the review result to delete
 *     responses:
 *       204:
 *         description: Review result deleted successfully
 *       404:
 *         description: Review result not found
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
router.delete('/:id', authenticateJWT, ReviewResultController.delete);

export default router;
