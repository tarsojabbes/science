import { Router } from 'express';
import { JournalReviewerController } from '../controllers/journalReviewerController';

const router = Router();
const journalReviewerController = new JournalReviewerController();

// Add reviewer to journal
router.post('/journals/reviewers', journalReviewerController.addReviewerToJournal.bind(journalReviewerController));

// Remove reviewer from journal
router.delete('/journals/:journalId/reviewers/:userId', journalReviewerController.removeReviewerFromJournal.bind(journalReviewerController));

// Get all reviewers of a journal
router.get('/journals/:journalId/reviewers', journalReviewerController.getJournalReviewers.bind(journalReviewerController));

// Get all journals where a user is a reviewer
router.get('/users/:userId/reviewer-journals', journalReviewerController.getUserReviewerJournals.bind(journalReviewerController));

// Update reviewer expertise
router.put('/journals/:journalId/reviewers/:userId/expertise', journalReviewerController.updateReviewerExpertise.bind(journalReviewerController));

// Deactivate reviewer
router.put('/journals/:journalId/reviewers/:userId/deactivate', journalReviewerController.deactivateReviewer.bind(journalReviewerController));

// Activate reviewer
router.put('/journals/:journalId/reviewers/:userId/activate', journalReviewerController.activateReviewer.bind(journalReviewerController));

// Check if user is reviewer of journal
router.get('/journals/:journalId/reviewers/:userId/permission', journalReviewerController.checkReviewerPermission.bind(journalReviewerController));

export default router; 