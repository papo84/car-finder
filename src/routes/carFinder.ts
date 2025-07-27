import { Router, Request, Response } from 'express';
import { questions } from '../data/questions';
import { OpenAIService } from '../services/openaiService';
import { Answer } from '../types';

const router = Router();

// Get all questions
router.get('/questions', (req: Request, res: Response) => {
  try {
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get car recommendation based on answers
router.post('/recommendation', async (req: Request, res: Response) => {
  try {
    const { answers }: { answers: Answer[] } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    const recommendation = await OpenAIService.getCarRecommendation(answers);
    res.json({ recommendation });
  } catch (error) {
    console.error('Error getting recommendation:', error);
    res.status(500).json({ 
      error: 'Failed to get car recommendation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as carFinderRouter }; 