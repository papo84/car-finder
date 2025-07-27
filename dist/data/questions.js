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
        type: 'multiple-choice',
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
        id: 'passengers',
        text: 'כמה נוסעים בדרך כלל ברכב?',
        type: 'multiple-choice',
        options: [
            '1-2 אנשים',
            '3-4 אנשים',
            '5-6 אנשים',
            '7+ אנשים'
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
        id: 'driving_style',
        text: 'איך היית מתאר/ת את סגנון הנהיגה שלך?',
        type: 'multiple-choice',
        options: [
            'חסכוני וזהיר',
            'מאוזן',
            'ספורטיבי',
            'נוחות ויוקרה'
        ],
        required: true
    },
    {
        id: 'parking',
        text: 'מה מצב החניה שלך?',
        type: 'multiple-choice',
        options: [
            'חניה ברחוב',
            'חניה פרטית קטנה',
            'חניה פרטית גדולה',
            'חניה בבניין/חניון',
            'אין חניה קבועה'
        ],
        required: true
    },
    {
        id: 'maintenance',
        text: 'כמה חשוב לך שהרכב יהיה זול לאחזקה?',
        type: 'multiple-choice',
        options: [
            'חשוב מאוד',
            'די חשוב',
            'פחות חשוב',
            'לא חשוב בכלל'
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
        required: true
    },
    {
        id: 'intercity',
        text: 'כמה פעמים בשבוע אתה נוסע מחוץ לעיר?',
        type: 'multiple-choice',
        options: [
            'כמעט אף פעם',
            '1-2 פעמים בשבוע',
            '3-4 פעמים בשבוע',
            'כל יום'
        ],
        required: true
    },
    {
        id: 'kids_seats',
        text: 'האם אתה צריך מקום לכסאות בטיחות לילדים?',
        type: 'multiple-choice',
        options: [
            'כן, לפחות 2',
            'כן, 1',
            'לא'
        ],
        required: false
    },
    {
        id: 'ownership_duration',
        text: 'לכמה זמן אתה מתכנן להחזיק את הרכב?',
        type: 'multiple-choice',
        options: [
            'שנה-שנתיים',
            '3-5 שנים',
            'יותר מ-5 שנים'
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
            'בעלים ראשון בלבד',
            'עד 2 בעלים',
            'עד 3 בעלים',
            'לא אכפת לי'
        ],
        required: true,
        conditional: {
            dependsOn: 'used_car',
            showWhen: ['כן, עדיף']
        }
    },
    {
        id: 'brand_preference',
        text: 'האם יש לך העדפה למותג מסוים?',
        type: 'text',
        required: false
    },
    {
        id: 'financing',
        text: 'האם אתה מתכוון לרכוש את הרכב במימון?',
        type: 'multiple-choice',
        options: [
            'כן, מימון מלא',
            'כן, מימון חלקי',
            'לא, תשלום מלא במזומן'
        ],
        required: false
    },
    {
        id: 'popularity',
        text: 'כמה חשוב לך שהרכב יהיה דגם נפוץ בארץ?',
        type: 'multiple-choice',
        options: [
            'חשוב מאוד',
            'לא קריטי',
            'אין לי העדפה'
        ],
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