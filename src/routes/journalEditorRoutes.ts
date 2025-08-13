import { Router } from 'express';
import { JournalEditorController } from '../controllers/journalEditorController';

const router = Router();
const journalEditorController = new JournalEditorController();

// Add editor to journal
router.post('/journals/editors', journalEditorController.addEditorToJournal.bind(journalEditorController));

// Remove editor from journal
router.delete('/journals/:journalId/editors/:userId', journalEditorController.removeEditorFromJournal.bind(journalEditorController));

// Get all editors of a journal
router.get('/journals/:journalId/editors', journalEditorController.getJournalEditors.bind(journalEditorController));

// Get all journals where a user is an editor
router.get('/users/:userId/journals', journalEditorController.getUserJournals.bind(journalEditorController));

// Check if user is editor of journal
router.get('/journals/:journalId/editors/:userId/permission', journalEditorController.checkEditorPermission.bind(journalEditorController));

export default router; 