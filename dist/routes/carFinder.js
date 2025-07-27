"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carFinderRouter = void 0;
const express_1 = require("express");
const questions_1 = require("../data/questions");
const openaiService_1 = require("../services/openaiService");
const router = (0, express_1.Router)();
exports.carFinderRouter = router;
// Get all questions
router.get('/questions', (req, res) => {
    try {
        res.json({ questions: questions_1.questions });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});
// Get car recommendation based on answers
router.post('/recommendation', async (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'Answers are required' });
        }
        const recommendation = await openaiService_1.OpenAIService.getCarRecommendation(answers);
        res.json({ recommendation });
    }
    catch (error) {
        console.error('Error getting recommendation:', error);
        res.status(500).json({
            error: 'Failed to get car recommendation',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
//# sourceMappingURL=carFinder.js.map