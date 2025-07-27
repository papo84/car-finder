export interface Question {
    id: string;
    text: string;
    type: 'multiple-choice' | 'multiple-select' | 'text' | 'number' | 'range';
    options?: string[];
    min?: number;
    max?: number;
    required: boolean;
    allowCustom?: boolean;
    conditional?: {
        dependsOn: string;
        showWhen: string[];
    };
}
export interface Answer {
    questionId: string;
    questionText: string;
    answer: string | number | string[];
}
export interface CarRecommendation {
    car: string;
    reasoning: string;
    features: string[];
    estimatedPrice: string;
    pros: string[];
    cons: string[];
}
export interface WizardState {
    currentStep: number;
    answers: Answer[];
    isComplete: boolean;
}
//# sourceMappingURL=index.d.ts.map