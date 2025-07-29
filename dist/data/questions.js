"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = void 0;
exports.questions = [
    {
        id: 'budget',
        text: 'מה התקציב שלך לרכב (בש"ח)?',
        type: 'multiple-choice',
        options: [
            'עד 40,000 ₪',
            '40,000 - 70,000 ₪',
            '70,000 - 110,000 ₪',
            '110,000 - 160,000 ₪',
            '160,000 - 220,000 ₪',
            'מעל 220,000 ₪',
            'טווח מותאם אישית'
        ],
        required: true,
        allowCustom: true
    },
    {
        id: 'usage',
        text: 'למה תשמש אותך המכונית?',
        type: 'multiple-select',
        options: [
            'נסיעות יומיומיות לעבודה/לימודים',
            'הסעות משפחתיות',
            'טיולים וסופי שבוע',
            'עסקים/מקצועי',
            'נהיגה ספורטיבית',
            'שטח והרפתקאות'
        ],
        required: true
    },
    {
        id: 'fuel_preference',
        text: 'מהי העדפת הדלק שלך?',
        type: 'multiple-choice',
        options: [
            'בנזין',
            'היברידי',
            'חשמלי',
            'דיזל',
            'אין העדפה'
        ],
        required: true
    },
    {
        id: 'parking',
        text: 'איפה אתה נוהג לרוב ואיך זה משפיע על גודל הרכב שאתה מחפש?',
        type: 'multiple-choice',
        options: [
            'בעיר – מעדיף רכב קטן וזריז',
            'בנסיעות ארוכות – חשוב לי מרחב ונוחות',
            'צריך מקום לציוד/משפחה – רכב מרווח עדיף לי'
        ],
        required: true
    },
    {
        id: 'features',
        text: 'אילו תכונות הכי חשובות לך? (ניתן לבחור יותר מאחת)',
        type: 'multiple-select',
        options: [
            'בטיחות',
            'טכנולוגיה/מולטימדיה',
            'חיסכון בדלק',
            'זול לאחזקה',
            'ביצועים',
            'נוחות',
            'תא מטען גדול',
            'גרירה',
            'הנעה כפולה'
        ],
        required: true
    },
    {
        id: 'mileage',
        text: 'כמה קילומטרים אתה נוסע בממוצע ביום או בשבוע?',
        type: 'multiple-choice',
        options: [
            'פחות מ-20 ק"מ ליום',
            '20-50 ק"מ ליום',
            '50-100 ק"מ ליום',
            'יותר מ-100 ק"מ ליום'
        ],
        required: false
    },
    {
        id: 'kids_seats',
        text: 'האם אתה צריך מקום לכסאות בטיחות לילדים?',
        type: 'multiple-choice',
        options: [
            'לא',
            'כן, 1',
            'כן, לפחות 2'
        ],
        required: true
    },
    {
        id: 'ownership_duration',
        text: 'לכמה זמן אתה מתכנן להחזיק את הרכב?',
        type: 'multiple-choice',
        options: [
            'שנה-שנתיים',
            '3-5 שנים',
            'יותר מ-5 שנים',
            'לא יודע בזמן זה'
        ],
        required: true
    },
    {
        id: 'used_car',
        text: 'האם אתה פתוח לרכב מיד שנייה?',
        type: 'multiple-choice',
        options: [
            'כן, עדיף',
            'כן, אם זה משתלם',
            'מעדיף רכב חדש בלבד'
        ],
        required: true
    },
    {
        id: 'car_kilometers',
        text: 'איזה טווח קילומטרים מקסימלי מקובל עליך ברכב משומש?',
        type: 'multiple-choice',
        options: [
            'עד 20,000 ק"מ',
            '20,000 - 50,000 ק"מ',
            '50,000 - 100,000 ק"מ',
            '100,000 - 150,000 ק"מ',
            '150,000 - 200,000 ק"מ',
            'מעל 200,000 ק"מ',
            'טווח מותאם אישית'
        ],
        required: true,
        conditional: {
            dependsOn: 'used_car',
            showWhen: ['כן, עדיף']
        },
        allowCustom: true
    },
    {
        id: 'previous_owners',
        text: 'מספר בעלים קודמים מקסימלי שמקובל עליך?',
        type: 'multiple-choice',
        options: [
            'יד ראשונה בלבד',
            'עד יד שנייה',
            'עד יד שלישית',
            'לא משנה לי'
        ],
        required: true,
        conditional: {
            dependsOn: 'used_car',
            showWhen: ['כן, עדיף']
        }
    },
    {
        id: 'popularity',
        text: 'כמה חשוב לך שהרכב יהיה דגם נפוץ בארץ?',
        type: 'multiple-choice',
        options: [
            'חשוב מאוד',
            'אין לי העדפה'
        ],
        required: true
    },
    {
        id: 'brand_preference',
        text: 'האם יש לך העדפה למותג מסוים?',
        type: 'text',
        required: false
    },
    {
        id: 'free_text',
        text: 'יש עוד משהו שחשוב לך שנדע כדי למצוא את הרכב המתאים לך?',
        type: 'text',
        required: false
    }
];
//# sourceMappingURL=questions.js.map