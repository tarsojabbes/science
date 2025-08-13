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
 *         paperId:
 *           type: integer
 *           example: 10
 *         approved:
 *           type: boolean
 *           example: false
 *         requesterId:
 *           type: integer
 *           example: 5
 *         firstReviewerId:
 *           type: integer
 *           example: 7
 *         secondReviewerId:
 *           type: integer
 *           example: 8
 *         requestDate:
 *           type: string
 *           format: date-time
 *           example: "2025-07-17T12:00:00Z"
 *         peerReviewResults:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReviewResult'
 *     ReviewResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 100
 *         firstReviewerNote:
 *           type: string
 *           example: "Detailed review from the first reviewer"
 *         secondReviewerNote:
 *           type: string
 *           example: "Detailed review from the second reviewer"
 *         resultDate:
 *           type: string
 *           format: date-time
 *           example: "2025-07-20T15:00:00Z"
 *         approval:
 *           type: boolean
 *           example: true
 * 
 * /reviews:
 *   post:
 *     summary: Create a new review request for an paper
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paperId
 *               - requesterId
 *               - firstReviewerId
 *               - secondReviewerId
 *             properties:
 *               paperId:
 *                 type: integer
 *                 example: 10
 *               requesterId:
 *                 type: integer
 *                 example: 5
 *               firstReviewerId:
 *                 type: integer
 *                 example: 7
 *               secondReviewerId:
 *                 type: integer
 *                 example: 8
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
// Request a review for a paper
router.post('/request', authenticateJWT, reviewController.requestReview.bind(reviewController));

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
// Get review by ID
router.get('/:id', authenticateJWT, reviewController.getReviewById.bind(reviewController));


/**
 * @swagger
 * /reviews/paper/{paperId}:
 *   get:
 *     summary: Get all review requests from an paper
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
// Get reviews by paper
router.get('/paper/:paperId', authenticateJWT, reviewController.getReviewsByPaper.bind(reviewController));

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all review requests
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of all review requests
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
// Get reviews by reviewer
router.get('/my-reviews', authenticateJWT, reviewController.getReviewsByReviewer.bind(reviewController));

// Get pending reviews for reviewer
router.get('/pending', authenticateJWT, reviewController.getPendingReviews.bind(reviewController));

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review by its id
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
 *             properties:
 *               paperId:
 *                 type: integer
 *                 example: 10
 *               approved:
 *                 type: boolean
 *                 example: true
 *               firstReviewerId:
 *                 type: integer
 *                 example: 7
 *               secondReviewerId:
 *                 type: integer
 *                 example: 8
 *     responses:
 *       200:
 *         description: Review successfully updated
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
// Submit review result
router.post('/:reviewId/submit', authenticateJWT, reviewController.submitReviewResult.bind(reviewController));

// Update review status (for editors)
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
// Note: Delete functionality removed as it's not needed for the peer-review process

export default router;
