import { Answer, CarRecommendation } from '../types';
export declare class OpenAIService {
    private static openai;
    private static initializeOpenAI;
    static getCarRecommendation(answers: Answer[]): Promise<CarRecommendation>;
    private static getMockRecommendation;
    private static buildPrompt;
    private static parseRecommendation;
}
//# sourceMappingURL=openaiService.d.ts.map