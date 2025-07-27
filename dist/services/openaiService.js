"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIService = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIService {
    static initializeOpenAI() {
        if (this.openai)
            return this.openai;
        try {
            if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
                this.openai = new openai_1.default({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                return this.openai;
            }
        }
        catch (error) {
            console.log('OpenAI not initialized - using mock recommendations');
        }
        return null;
    }
    static async getCarRecommendation(answers) {
        try {
            // If no OpenAI API key is configured, return mock data
            const openai = this.initializeOpenAI();
            if (!openai) {
                return this.getMockRecommendation(answers);
            }
            const prompt = this.buildPrompt(answers);
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are a knowledgeable car expert who provides personalized car recommendations based on user preferences. Provide detailed, practical advice with specific car models and reasoning."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from OpenAI');
            }
            // Parse the response to extract structured data
            return this.parseRecommendation(response);
        }
        catch (error) {
            console.error('Error getting car recommendation:', error);
            // Fallback to mock data if API call fails
            return this.getMockRecommendation(answers);
        }
    }
    static getMockRecommendation(answers) {
        // Extract key preferences from answers
        const budget = answers.find(a => a.questionId === 'budget')?.answer;
        const usage = answers.find(a => a.questionId === 'usage')?.answer;
        const fuelPreference = answers.find(a => a.questionId === 'fuel_preference')?.answer;
        const features = answers.find(a => a.questionId === 'features')?.answer;
        const brand = answers.find(a => a.questionId === 'brand_preference')?.answer;
        // Defaults
        let car = 'טויוטה קורולה 2022';
        let reasoning = 'הרכב מתאים לשוק הישראלי, אמין, חסכוני ומבוקש מאוד.';
        let estimatedPrice = '₪110,000 - ₪130,000';
        let featuresList = ['חיסכון בדלק', 'מערכות בטיחות מתקדמות', 'תחזוקה זולה'];
        let pros = ['שמירת ערך גבוהה', 'אמינות', 'נפוצה בארץ'];
        let cons = ['עיצוב שמרני', 'ביצועים ממוצעים'];
        // Budget-based
        if (budget?.includes('עד 40,000')) {
            car = 'קיה פיקנטו 2017';
            estimatedPrice = '₪30,000 - ₪40,000';
            reasoning = 'רכב מיני פופולרי, חסכוני ומתאים לעיר.';
            featuresList = ['קומפקטי', 'חיסכון בדלק', 'תחזוקה זולה'];
            pros = ['קל לחניה', 'עלויות אחזקה נמוכות'];
            cons = ['מרווח פנימי קטן', 'ביצועים בסיסיים'];
        }
        else if (budget?.includes('40,000 - 70,000')) {
            car = 'יונדאי i20 2019';
            estimatedPrice = '₪55,000 - ₪70,000';
            reasoning = 'רכב סופר מיני אמין, מרווח יחסית וחסכוני.';
            featuresList = ['מרווח', 'אמינות', 'חיסכון בדלק'];
            pros = ['תחזוקה זולה', 'שמירת ערך טובה'];
            cons = ['אבזור בסיסי', 'מנוע לא חזק במיוחד'];
        }
        else if (budget?.includes('70,000 - 110,000')) {
            car = 'מאזדה 3 2020';
            estimatedPrice = '₪90,000 - ₪110,000';
            reasoning = 'רכב משפחתי פופולרי, נוח לנסיעות ארוכות.';
            featuresList = ['נוחות', 'מערכות בטיחות', 'עיצוב מודרני'];
            pros = ['אמינות', 'נוחות נסיעה'];
            cons = ['צריכת דלק בינונית', 'מחיר חלפים גבוה'];
        }
        else if (budget?.includes('110,000 - 160,000')) {
            car = 'טויוטה קורולה 2022';
            estimatedPrice = '₪110,000 - ₪130,000';
            reasoning = 'הרכב מתאים לשוק הישראלי, אמין, חסכוני ומבוקש מאוד.';
            featuresList = ['חיסכון בדלק', 'מערכות בטיחות מתקדמות', 'תחזוקה זולה'];
            pros = ['שמירת ערך גבוהה', 'אמינות', 'נפוצה בארץ'];
            cons = ['עיצוב שמרני', 'ביצועים ממוצעים'];
        }
        else if (budget?.includes('160,000 - 220,000')) {
            car = 'יונדאי איוניק 5 חשמלית';
            estimatedPrice = '₪180,000 - ₪220,000';
            reasoning = 'רכב חשמלי מתקדם, טווח נסיעה גבוה, מתאים למשפחות.';
            featuresList = ['חשמלי', 'טווח נסיעה ארוך', 'טכנולוגיה מתקדמת'];
            pros = ['חיסכון בדלק', 'אבזור עשיר', 'ידידותי לסביבה'];
            cons = ['מחיר גבוה', 'תשתית טעינה מוגבלת'];
        }
        else if (budget?.includes('מעל 220,000')) {
            car = 'וולוו XC60 פלאג-אין';
            estimatedPrice = '₪250,000 - ₪320,000';
            reasoning = 'רכב יוקרה עם ביצועים גבוהים, בטיחות ונוחות.';
            featuresList = ['פלאג-אין', 'מערכות בטיחות', 'נוחות יוקרתית'];
            pros = ['יוקרה', 'ביצועים', 'בטיחות'];
            cons = ['עלויות אחזקה גבוהות', 'מחיר רכישה גבוה'];
        }
        // Usage-based
        if (usage?.includes('משפחתיות')) {
            car = 'סקודה קודיאק 7 מושבים';
            estimatedPrice = '₪160,000 - ₪200,000';
            reasoning = 'רכב פנאי מרווח, מתאים למשפחות גדולות.';
            featuresList = ['7 מושבים', 'מרווח', 'בטיחות'];
            pros = ['מרווח', 'נוחות', 'בטיחות'];
            cons = ['צריכת דלק גבוהה', 'מחיר יחסית גבוה'];
        }
        else if (usage?.includes('ספורטיבית')) {
            car = 'מאזדה MX-5';
            estimatedPrice = '₪180,000 - ₪220,000';
            reasoning = 'רכב קבריולה ספורטיבי, חווית נהיגה ייחודית.';
            featuresList = ['ביצועים', 'גג נפתח', 'עיצוב ספורטיבי'];
            pros = ['כיף לנהיגה', 'עיצוב', 'אמינות'];
            cons = ['לא פרקטי למשפחה', 'מרווח קטן'];
        }
        else if (usage?.includes('שטח')) {
            car = 'סוזוקי ויטרה 4X4';
            estimatedPrice = '₪120,000 - ₪150,000';
            reasoning = 'ג׳יפון קומפקטי, מתאים לטיולים ושטח קל.';
            featuresList = ['הנעה כפולה', 'מרווח גחון', 'אמינות'];
            pros = ['מתאים לשטח', 'תחזוקה זולה'];
            cons = ['ביצועים בינוניים', 'אבזור בסיסי'];
        }
        // Fuel preference
        if (fuelPreference?.includes('חשמלי')) {
            car = 'MG ZS EV';
            estimatedPrice = '₪130,000 - ₪150,000';
            reasoning = 'רכב פנאי חשמלי משתלם, טווח נסיעה טוב.';
            featuresList = ['חשמלי', 'טווח 263 ק"מ', 'אבזור עשיר'];
            pros = ['חיסכון בדלק', 'ידידותי לסביבה'];
            cons = ['תשתית טעינה מוגבלת', 'שמירת ערך לא ברורה'];
        }
        else if (fuelPreference?.includes('היברידי')) {
            car = 'טויוטה פריוס היברידית';
            estimatedPrice = '₪120,000 - ₪140,000';
            reasoning = 'רכב היברידי חסכוני, אמין ומוכר בישראל.';
            featuresList = ['היברידי', 'חיסכון בדלק', 'אמינות'];
            pros = ['חיסכון משמעותי', 'תחזוקה זולה'];
            cons = ['ביצועים בינוניים', 'עיצוב שנוי במחלוקת'];
        }
        // Features
        if (Array.isArray(features) && features.length > 0) {
            const selectedFeatures = features;
            if (selectedFeatures.includes('בטיחות')) {
                featuresList.push('מערכות בטיחות מתקדמות');
                pros.push('רמת בטיחות גבוהה');
            }
            if (selectedFeatures.includes('טכנולוגיה/מולטימדיה')) {
                featuresList.push('מערכת מולטימדיה מתקדמת');
                pros.push('חווית נהיגה מודרנית');
            }
            if (selectedFeatures.includes('ביצועים')) {
                featuresList.push('מנוע חזק');
                pros.push('האצה מהירה');
            }
            if (selectedFeatures.includes('הנעה כפולה')) {
                featuresList.push('הנעה 4X4');
                pros.push('יציבות ובטיחות');
            }
        }
        // Brand preference
        if (brand && typeof brand === 'string' && brand.trim().length > 0) {
            reasoning += `
בהתאם להעדפתך, נבחר דגם של ${brand}.`;
        }
        return {
            car,
            reasoning,
            features: featuresList,
            estimatedPrice,
            pros,
            cons
        };
    }
    static buildPrompt(answers) {
        const answersText = answers.map(answer => {
            const answerValue = Array.isArray(answer.answer)
                ? answer.answer.join(', ')
                : answer.answer;
            return `Question: ${answer.questionText}\nAnswer: ${answerValue}`;
        }).join('\n\n');
        return `בהתבסס על ההעדפות הבאות, המלץ על רכב שמתאים לשוק הישראלי. התשובה צריכה להיות בפורמט JSON:

{
  "car": "דגם ושנה (למשל, 'טויוטה קורולה 2022')",
  "reasoning": "הסבר מפורט מדוע הרכב מתאים",
  "features": ["מאפיין 1", "מאפיין 2", "מאפיין 3"],
  "estimatedPrice": "טווח מחירים (למשל, '₪110,000 - ₪130,000')",
  "pros": ["יתרון 1", "יתרון 2", "יתרון 3"],
  "cons": ["חיסרון 1", "חיסרון 2"]
}

העדפות המשתמש:
${answersText}

ההמלצה צריכה להיות רלוונטית, מעשית, ובטווח התקציב.`;
    }
    static parseRecommendation(response) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    car: parsed.car || 'Car recommendation',
                    reasoning: parsed.reasoning || 'Based on your preferences',
                    features: parsed.features || [],
                    estimatedPrice: parsed.estimatedPrice || 'Price not specified',
                    pros: parsed.pros || [],
                    cons: parsed.cons || []
                };
            }
        }
        catch (error) {
            console.error('Error parsing JSON response:', error);
        }
        // Fallback if JSON parsing fails
        return {
            car: 'Car recommendation',
            reasoning: response,
            features: [],
            estimatedPrice: 'Price not specified',
            pros: [],
            cons: []
        };
    }
}
exports.OpenAIService = OpenAIService;
OpenAIService.openai = null;
//# sourceMappingURL=openaiService.js.map