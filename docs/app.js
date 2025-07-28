class CarFinderWizard {
    constructor() {
        this.currentStep = 0;
        this.answers = [];
        this.questions = [];
        this.container = document.getElementById('wizard-container');

        // Check for testing backdoor in URL first
        const urlParams = new URLSearchParams(window.location.search);
        const skipToQuestion = urlParams.get('q');
        if (skipToQuestion) {
            // If backdoor parameter exists, bypass welcome page
            this.init();
        } else {
            // Normal flow: show welcome page
            this.showWelcomePage();
        }
    }

    showWelcomePage() {
        this.container.innerHTML = `
            <div class="wizard-step active welcome-page">
                <div class="welcome-content">
                    <div class="welcome-icon">🚗</div>
                    <h1 class="welcome-title">ברוכים הבאים למאתר הרכבים החכם!</h1>
                    <p class="welcome-description">
                        מצאו את הרכב המושלם עבורכם בעזרת הסקר החכם שלנו.
                        נענה על מספר שאלות ונקבל המלצות מותאמות אישית + קישור לחיפוש ב-yad2!
                    </p>
                    
                    <div class="welcome-features">
                        <div class="feature">
                            <div class="feature-icon">📋</div>
                            <div class="feature-content">
                                <h3>סקר מותאם אישית</h3>
                                <p>שאלות חכמות שמתאימות לצרכים שלכם - תקציב, שימוש, גודל משפחה ועוד</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🤖</div>
                            <div class="feature-content">
                                <h3>המלצות ChatGPT מתקדמות</h3>
                                <p>בינה מלאכותית מנתחת את התשובות ומספקת 3 המלצות רכב מדויקות עם הסבר מפורט</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🔗</div>
                            <div class="feature-content">
                                <h3>קישור חכם ל-yad2</h3>
                                <p>קבלו קישור מותאם אישית לחיפוש ב-yad2 עם הפרמטרים המדויקים שלכם</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="welcome-actions">
                        <button class="btn btn-primary btn-large" id="start-wizard-btn">
                             בואו נתחיל! 🚀
                        </button>
                        <p class="welcome-time">⏱️ הסקר לוקח כ-3 דקות</p>
                    </div>
                </div>
            </div>
        `;

        // Add event listener for start button
        const startBtn = document.getElementById('start-wizard-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.init();
            });
        }
    }

    async init() {
        try {
            await this.loadQuestions();

            // Check for testing backdoor in URL
            const urlParams = new URLSearchParams(window.location.search);
            const skipToQuestion = urlParams.get('q');
            if (skipToQuestion) {
                // Check if it's a number (for numeric backdoor)
                const questionNumber = parseInt(skipToQuestion);
                if (!isNaN(questionNumber)) {
                    // Convert 1-based to 0-based index
                    const questionIndex = questionNumber - 1;
                    if (questionIndex >= 0 && questionIndex < this.questions.length) {
                        this.currentStep = questionIndex;
                        console.log(`🚪 Testing backdoor: Skipped to question ${questionNumber} (step ${questionIndex})`);
                    } else {
                        console.warn(`🚪 Testing backdoor: Question number ${questionNumber} is out of range (1-${this.questions.length}). Staying on home page.`);
                        this.currentStep = 0;
                    }
                } else {
                    // String-based backdoor (by question ID)
                    const questionIndex = this.questions.findIndex(q => q.id === skipToQuestion);
                    if (questionIndex >= 0) {
                        this.currentStep = questionIndex;
                        console.log(`🚪 Testing backdoor: Skipped to question "${skipToQuestion}" (step ${questionIndex})`);
                    } else {
                        console.warn(`🚪 Testing backdoor: Question "${skipToQuestion}" not found`);
                    }
                }
            }

            this.renderWizard();
            this.updateProgress();
        } catch (error) {
            this.showError('Failed to load questions. Please refresh the page.');
        }
    }

    async loadQuestions() {
        // Question groups for better organization
        this.questionGroups = [
            {
                id: 'budget_financing',
                name: '💸 תקציב ומימון',
                description: 'בואו נגדיר את המסגרת הכלכלית'
            },
            {
                id: 'usage_behavior',
                name: '🚗 שימוש והתנהגות נהיגה',
                description: 'נספר לנו על האופן שבו אתם משתמשים ברכב'
            },
            {
                id: 'family_space',
                name: '👨‍👩‍👧 צרכים משפחתיים ומרחב',
                description: 'מה החללים והתכונות הנדרשים עבורכם'
            },
            {
                id: 'car_preferences',
                name: '🚘 העדפות רכב',
                description: 'איזה סוג רכב מתאים לכם'
            },
            {
                id: 'maintenance_reliability',
                name: '🔧 תחזוקה ואמינות',
                description: 'תכנון לטווח הארוך'
            },
            {
                id: 'used_car',
                name: '🛻 רכב יד שנייה',
                description: 'אם אתם פתוחים לרכב משומש'
            },
            {
                id: 'additional_info',
                name: '🧠 מידע נוסף',
                description: 'פרטים נוספים שיעזרו לנו'
            }
        ];

        // Embedded questions for static version (GitHub Pages compatible) - Reorganized by groups
        this.questions = [
            // Group 1: Budget and Financing (תקציב ומימון) - MOVED TO FIRST
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
                allowCustom: true,
                group: 'budget_financing'
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
                required: true,
                group: 'budget_financing'
            },
            // Group 2: Usage and Driving Behavior (שימוש והתנהגות נהיגה)
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
                required: true,
                group: 'usage_behavior'
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
                required: true,
                group: 'usage_behavior'
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
                required: true,
                group: 'usage_behavior'
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
                required: true,
                group: 'usage_behavior'
            },
            // Group 3: Family Needs and Space (צרכים משפחתיים ומרחב)
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
                required: true,
                group: 'family_space'
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
                required: true,
                group: 'family_space'
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
                required: true,
                group: 'family_space'
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
                required: true,
                group: 'family_space'
            },
            // Group 4: Car Preferences (העדפות רכב)
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
                required: true,
                group: 'car_preferences'
            },
            {
                id: 'popularity',
                text: 'כמה חשוב לך שהרכב יהיה דגם נפוץ בארץ?',
                type: 'multiple-choice',
                options: [
                    'חשוב מאוד',
                    'אין לי העדפה'
                ],
                required: true,
                group: 'car_preferences'
            },
            // Group 5: Maintenance and Reliability (תחזוקה ואמינות)
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
                required: true,
                group: 'maintenance_reliability'
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
                required: true,
                group: 'maintenance_reliability'
            },
            // Group 6: Used Car (רכב יד שנייה)
            {
                id: 'used_car',
                text: 'האם אתה פתוח לרכב מיד שנייה?',
                type: 'multiple-choice',
                options: [
                    'כן, עדיף',
                    'כן, אם זה משתלם',
                    'מעדיף רכב חדש בלבד'
                ],
                required: true,
                group: 'used_car'
            },
            {
                id: 'car_kilometers',
                text: 'איזה טווח קילומטרים מקובל עליך ברכב משומש?',
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
                allowCustom: true,
                group: 'used_car'
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
                },
                group: 'used_car'
            },
            // Group 7: Additional Information (מידע נוסף)
            {
                id: 'brand_preference',
                text: 'האם יש לך העדפה למותג מסוים?',
                type: 'autocomplete',
                options: [
                    'אאודי',
                    'אופל',
                    'איסוזו',
                    'אינפיניטי',
                    'אקורה',
                    'אלפא רומיאו',
                    'BMW',
                    'ג\'יפ',
                    'דודג\'',
                    'דייהטסו',
                    'הונדה',
                    'הונדאי',
                    'וולוו',
                    'טויוטה',
                    'טסלה',
                    'יגואר',
                    'לנד רובר',
                    'לנצ\'יה',
                    'לקסוס',
                    'מזדה',
                    'מיני',
                    'מיצובישי',
                    'מרצדס בנץ',
                    'ניסן',
                    'סוזוקי',
                    'סובארו',
                    'סיאט',
                    'סיטרואן',
                    'סקודה',
                    'פיאט',
                    'פיג\'ו',
                    'פולקסווגן',
                    'פורד',
                    'קיה',
                    'קרייזלר',
                    'רנו',
                    'שברולט'
                ],
                required: false,
                group: 'additional_info'
            },
            {
                id: 'free_text',
                text: 'יש עוד משהו שחשוב לך שנדע כדי למצוא את הרכב המתאים לך?',
                type: 'text',
                required: false,
                group: 'additional_info'
            }
        ];
    }

    getCurrentGroup() {
        const question = this.questions[this.currentStep];
        return this.questionGroups.find(group => group.id === question.group);
    }

    renderWizard() {
        // Skip conditional questions that shouldn't be shown
        while (this.currentStep < this.questions.length && !this.shouldShowQuestion(this.currentStep)) {
            this.currentStep++;
        }

        if (this.currentStep >= this.questions.length) {
            this.showJsonResults();
            return;
        }

        const question = this.questions[this.currentStep];
        const currentGroup = this.getCurrentGroup();
        const progress = ((this.currentStep + 1) / this.questions.length) * 100;

        // Calculate group progress
        const questionsInGroup = this.questions.filter(q => q.group === currentGroup.id);
        const currentQuestionInGroup = questionsInGroup.findIndex(q => q.id === question.id) + 1;
        const groupProgress = (currentQuestionInGroup / questionsInGroup.length) * 100;

        this.container.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="wizard-step active">
                <div class="group-header">
                    <h2 class="group-title">${currentGroup.name}</h2>
                    <p class="group-description">${currentGroup.description}</p>
                    <div class="group-progress">
                        <div class="group-progress-bar">
                            <div class="group-progress-fill" style="width: ${groupProgress}%"></div>
                        </div>
                        <span class="group-progress-text">שאלה ${currentQuestionInGroup} מתוך ${questionsInGroup.length} בקטגוריה</span>
                    </div>
                </div>
                
                <div class="step-header">
                    <div class="step-number">${this.currentStep + 1}</div>
                    <h3 class="step-title">שאלה ${this.currentStep + 1} מתוך ${this.questions.length}</h3>
                </div>
                
                <div class="question">
                    <h4 class="question-text">${question.text}</h4>
                    ${this.renderQuestionInput(question)}
                </div>
                
                <div class="navigation">
                    <button class="btn btn-secondary" id="prev-btn" ${this.currentStep === 0 ? 'disabled' : ''}>
                        → הקודם
                    </button>
                    <button class="btn btn-primary" id="next-btn" disabled>
                        ${this.currentStep === this.questions.length - 1 ? 'קבלת המלצה' : 'הבא ←'}
                    </button>
                </div>
            </div>
        `;

        this.setupEventListeners();

        // Enable next button for non-required questions
        const currentQuestion = this.questions[this.currentStep];
        const nextBtn = document.getElementById('next-btn');
        if (!currentQuestion.required && nextBtn) {
            nextBtn.disabled = false;
        }

        // Special handling for brand preference to initialize properly
        if (currentQuestion.type === 'autocomplete' && !currentQuestion.required) {
            nextBtn.disabled = false;
        }
    }

    shouldShowQuestion(stepIndex) {
        const question = this.questions[stepIndex];

        // If no conditional logic, always show
        if (!question.conditional) {
            return true;
        }

        // Find the answer to the dependency question
        const dependencyAnswer = this.answers.find(answer =>
            answer.questionId === question.conditional.dependsOn
        );

        // If dependency question wasn't answered, don't show this question
        if (!dependencyAnswer) {
            return false;
        }

        // Check if the answer matches any of the required values
        return question.conditional.showWhen.includes(dependencyAnswer.answer);
    }

    renderQuestionInput(question) {
        switch (question.type) {
            case 'multiple-choice':
                const hasCustomOption = question.allowCustom && question.options.includes('טווח מותאם אישית');
                return `
                    <div class="options-grid">
                        ${question.options.map((option, index) => `
                            <div class="option" data-value="${option}">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                    ${hasCustomOption ? `
                        <div class="custom-input-container" style="display: none;">
                            <div class="range-slider-container">
                                <div class="range-header">
                                    <h4 class="range-title">🎯 בחר טווח מותאם</h4>
                                    <p class="range-subtitle">גרור את הידיות או הקלד ערכים</p>
                                </div>
                                
                                <div class="range-display-main">
                                    <div class="range-values-display">
                                        <span class="range-values">0 - ${question.id === 'budget' ? '50,000' : '100,000'} ${question.id === 'budget' ? '₪' : 'ק"מ'}</span>
                                    </div>
                                </div>
                                
                                <div class="dual-range-slider">
                                    <div class="slider-container">
                                        <input type="range" class="slider slider-min" min="0" max="300000" value="0" step="1000">
                                        <input type="range" class="slider slider-max" min="0" max="300000" value="50000" step="1000">
                                        <div class="slider-track"></div>
                                        <div class="slider-range"></div>
                                        <div class="slider-labels">
                                            <span class="slider-label-min">0</span>
                                            <span class="slider-label-max">300,000</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="range-inputs-section">
                                    <div class="range-inputs-grid">
                                        <div class="range-input-box">
                                            <label class="input-label">מינימום</label>
                                            <div class="input-with-unit">
                                                <input type="number" class="range-min range-number-input" min="0" placeholder="0" />
                                                <span class="input-unit">${question.id === 'budget' ? '₪' : 'ק"מ'}</span>
                                            </div>
                                        </div>
                                        <div class="range-connector">
                                            <div class="connector-line"></div>
                                            <span class="connector-text">עד</span>
                                        </div>
                                        <div class="range-input-box">
                                            <label class="input-label">מקסימום</label>
                                            <div class="input-with-unit">
                                                <input type="number" class="range-max range-number-input" min="0" placeholder="${question.id === 'budget' ? '50000' : '100000'}" />
                                                <span class="input-unit">${question.id === 'budget' ? '₪' : 'ק"מ'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                `;
            case 'multiple-select':
                return `
                    <div class="options-grid multiple-select">
                        ${question.options.map((option, index) => `
                            <div class="option checkbox-option" data-value="${option}">
                                <input type="checkbox" id="option-${index}" class="checkbox-input">
                                <label for="option-${index}" class="checkbox-label">${option}</label>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'text':
                return `
                    <input type="text" class="text-input" placeholder="הכנס תשובה..." 
                           ${question.required ? 'required' : ''}>
                `;
            case 'number':
                return `
                    <input type="number" class="text-input" placeholder="הכנס טווח..." 
                           min="${question.min || 0}" max="${question.max || 999999}"
                           ${question.required ? 'required' : ''}>
                `;
            case 'autocomplete':
                return `
                    <div class="brand-preference-container">
                        <div class="brand-options-grid">
                            <div class="brand-option custom-text-option" data-value="custom">
                                <div class="brand-icon">✏️</div>
                                <span class="brand-text">הקלד מותג אחר</span>
                            </div>
                            <div class="brand-option no-preference-option" data-value="">
                                <div class="brand-icon">🤷‍♂️</div>
                                <span class="brand-text">אין לי העדפה</span>
                            </div>
                            ${question.options.map(option => `
                                <div class="brand-option" data-value="${option}">
                                    <div class="brand-icon">${this.getBrandIcon(option)}</div>
                                    <span class="brand-text">${option}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="custom-brand-input" style="display: none;">
                            <input type="text" class="custom-brand-text" placeholder="הקלד את המותג המועדף עליך..." />
                            <button type="button" class="btn-confirm-custom">✓ אישור</button>
                        </div>
                    </div>
                `;
            default:
                return '<p>Unsupported question type</p>';
        }
    }

    setupEventListeners() {
        const question = this.questions[this.currentStep];
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousStep());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (question.type === 'multiple-choice') {
            const options = document.querySelectorAll('.option');
            const customInputContainer = document.querySelector('.custom-input-container');

            options.forEach(option => {
                option.addEventListener('click', () => {
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');

                    // Handle custom range visibility
                    if (option.dataset.value === 'טווח מותאם אישית' && customInputContainer) {
                        customInputContainer.style.display = 'block';
                        // Focus on first range input
                        const rangeMin = customInputContainer.querySelector('.range-min');
                        if (rangeMin) rangeMin.focus();
                        // The next button state will be managed by setupRangeSliders
                        nextBtn.disabled = true;
                    } else if (customInputContainer) {
                        customInputContainer.style.display = 'none';
                        nextBtn.disabled = false;
                    } else {
                        nextBtn.disabled = false;
                    }
                });
            });

            // Handle custom range inputs
            this.setupRangeSliders(nextBtn);
        } else if (question.type === 'multiple-select') {
            const checkboxes = document.querySelectorAll('.checkbox-input');
            const updateNextButton = () => {
                const checkedBoxes = document.querySelectorAll('.checkbox-input:checked');
                // Only disable if required and no boxes are checked
                nextBtn.disabled = question.required && checkedBoxes.length === 0;

                // Update visual state of checkbox options
                checkboxes.forEach(checkbox => {
                    const optionDiv = checkbox.closest('.checkbox-option');
                    if (checkbox.checked) {
                        optionDiv.classList.add('selected');
                    } else {
                        optionDiv.classList.remove('selected');
                    }
                });
            };

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateNextButton);
            });
        } else if (question.type === 'text' || question.type === 'number') {
            const input = document.querySelector('.text-input');
            input.addEventListener('input', () => {
                // Only disable if required and input is empty
                nextBtn.disabled = question.required && !input.value.trim();
            });
        } else if (question.type === 'autocomplete') {
            const brandOptions = document.querySelectorAll('.brand-option');
            const customInput = document.querySelector('.custom-brand-input');
            const customTextInput = document.querySelector('.custom-brand-text');
            const confirmButton = document.querySelector('.btn-confirm-custom');

            let selectedValue = '';

            // Handle brand option selection (multi-select)
            brandOptions.forEach(option => {
                option.addEventListener('click', (event) => {
                    const value = option.dataset.value;

                    if (value === 'custom') {
                        if (option.classList.contains('selected')) {
                            // Currently editing - close edit mode
                            option.classList.remove('selected');
                            customInput.style.display = 'none';

                            // If there's a value, keep it as has-value
                            const existingValue = option.dataset.customValue || '';
                            if (existingValue) {
                                option.classList.add('has-value');
                            } else {
                                // No value, reset completely
                                option.classList.remove('has-value');
                                const brandText = option.querySelector('.brand-text');
                                if (brandText) {
                                    brandText.textContent = 'הקלד מותג אחר';
                                }
                            }
                        } else if (option.classList.contains('has-value')) {
                            // Click on main area: deselect completely
                            option.classList.remove('has-value');
                            option.dataset.customValue = '';
                            const brandText = option.querySelector('.brand-text');
                            if (brandText) {
                                brandText.textContent = 'הקלד מותג אחר';
                            }
                            // Remove edit button
                            const editBtn = option.querySelector('.custom-edit-btn');
                            if (editBtn) {
                                editBtn.remove();
                            }
                        } else {
                            // Not selected, not has-value - start fresh
                            option.classList.add('selected');
                            customInput.style.display = 'block';

                            if (customTextInput) {
                                customTextInput.value = '';
                                confirmButton.disabled = true;
                                customTextInput.focus();
                            }

                            nextBtn.disabled = true;
                        }
                    } else if (value === '') {
                        // Handle "no preference" - clears all others
                        if (option.classList.contains('selected')) {
                            // Deselect no preference
                            option.classList.remove('selected');
                        } else {
                            // Select no preference and clear all others
                            brandOptions.forEach(opt => {
                                opt.classList.remove('selected');
                                if (opt.classList.contains('custom-text-option')) {
                                    opt.classList.remove('has-value');
                                    opt.dataset.customValue = '';
                                    const brandText = opt.querySelector('.brand-text');
                                    if (brandText) {
                                        brandText.textContent = 'הקלד מותג אחר';
                                    }
                                    // Remove edit button
                                    const editBtn = opt.querySelector('.custom-edit-btn');
                                    if (editBtn) {
                                        editBtn.remove();
                                    }
                                }
                            });
                            option.classList.add('selected');
                            customInput.style.display = 'none';
                        }
                    } else {
                        // Handle regular brand selection (multi-select)
                        if (option.classList.contains('selected')) {
                            // Deselect this brand
                            option.classList.remove('selected');
                        } else {
                            // Select this brand
                            option.classList.add('selected');
                            // Clear "no preference" if it was selected
                            const noPreferenceOption = document.querySelector('.no-preference-option');
                            if (noPreferenceOption && noPreferenceOption.classList.contains('selected')) {
                                noPreferenceOption.classList.remove('selected');
                            }
                        }
                        customInput.style.display = 'none';
                    }

                    // Update next button state
                    this.updateBrandNextButton(nextBtn, question.required);
                });
            });

            // Handle custom text input
            if (customTextInput && confirmButton) {
                // Initialize confirm button as disabled
                confirmButton.disabled = true;

                customTextInput.addEventListener('input', () => {
                    const hasValue = customTextInput.value.trim().length > 0;
                    confirmButton.disabled = !hasValue;

                    // Also update next button state while typing
                    if (hasValue) {
                        const customOption = document.querySelector('.custom-text-option');
                        if (customOption) {
                            customOption.dataset.customValue = customTextInput.value.trim();
                        }
                        this.updateBrandNextButton(nextBtn, question.required);
                    }
                });

                customTextInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && customTextInput.value.trim()) {
                        confirmButton.click();
                    }
                });
            }

            // Handle confirm custom brand
            if (confirmButton) {
                confirmButton.addEventListener('click', () => {
                    const value = customTextInput.value.trim();
                    if (value) {
                        customInput.style.display = 'none';

                        const customTextOption = document.querySelector('.custom-text-option');
                        const customBrandText = document.querySelector('.custom-text-option .brand-text');

                        if (customTextOption && customBrandText) {
                            // Store custom value
                            customTextOption.dataset.customValue = value;

                            // Update visual state
                            customTextOption.classList.remove('selected');
                            customTextOption.classList.add('has-value');

                            // Update text to show the custom brand
                            customBrandText.textContent = value;

                            // Add edit button if not exists
                            if (!customTextOption.querySelector('.custom-edit-btn')) {
                                const editBtn = document.createElement('button');
                                editBtn.className = 'custom-edit-btn';
                                editBtn.innerHTML = '✏️';
                                editBtn.title = 'עריכה';
                                customTextOption.appendChild(editBtn);

                                // Add edit button click handler
                                editBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    // Enter edit mode
                                    customTextOption.classList.remove('has-value');
                                    customTextOption.classList.add('selected');
                                    customInput.style.display = 'block';

                                    const existingValue = customTextOption.dataset.customValue || '';
                                    if (existingValue && customTextInput) {
                                        customTextInput.value = existingValue;
                                        confirmButton.disabled = false;
                                    }

                                    if (customTextInput) {
                                        customTextInput.focus();
                                    }
                                });
                            }
                        }

                        this.updateBrandNextButton(nextBtn, question.required);
                    }
                });
            }
        }
    }

    updateBrandNextButton(nextBtn, required) {
        const selectedBrands = document.querySelectorAll('.brand-option.selected');
        const customOptionWithValue = document.querySelector('.custom-text-option.has-value');
        const customOptionSelected = document.querySelector('.custom-text-option.selected');

        // Count total meaningful selections
        let totalSelections = 0;

        // Count selected brands (excluding custom options being edited without value)
        selectedBrands.forEach(option => {
            if (!option.classList.contains('custom-text-option')) {
                totalSelections++;
            } else if (option.dataset.customValue) {
                totalSelections++; // Custom option being edited with value
            }
        });

        // Count custom option with saved value (not being edited)
        if (customOptionWithValue && !customOptionSelected) {
            totalSelections++;
        }

        // Enable next button if not required OR has meaningful selections
        nextBtn.disabled = required && totalSelections === 0;
    }

    getBrandIcon(brand) {
        const brandIcons = {
            'אאודי': '🅰️',
            'אופל': '⚪',
            'איסוזו': '🔶',
            'אינפיניטי': '♾️',
            'אקורה': '🅰️',
            'אלפא רומיאו': '🏁',
            'BMW': '🅱️',
            'ג\'יפ': '🏔️',
            'דודג\'': '🐏',
            'דייהטסו': '🔸',
            'הונדה': '🅗',
            'הונדאי': '🅷',
            'וולוו': '⚡',
            'טויוטה': '🔴',
            'טסלה': '⚡',
            'יגואר': '🐆',
            'לנד רובר': '🏔️',
            'לנצ\'יה': '🔹',
            'לקסוס': '💎',
            'מזדה': '🔶',
            'מיני': '🔴',
            'מיצובישי': '💎',
            'מרצדס בנץ': '🌟',
            'ניסן': '🔵',
            'סוזוקי': '🔴',
            'סובארו': '⭐',
            'סיאט': '🔺',
            'סיטרואן': '🔻',
            'סקודה': '💎',
            'פיאט': '🔸',
            'פיג\'ו': '🦁',
            'פולקסווגן': '🔧',
            'פורד': '🅵',
            'קיה': '🅺',
            'קרייזלר': '⭐',
            'רנו': '💠',
            'שברולט': '⚡'
        };

        return brandIcons[brand] || '🚗';
    }



    setupRangeSliders(nextBtn) {
        const rangeMin = document.querySelector('.range-min');
        const rangeMax = document.querySelector('.range-max');
        const sliderMin = document.querySelector('.slider-min');
        const sliderMax = document.querySelector('.slider-max');
        const rangeValues = document.querySelector('.range-values');
        const sliderRange = document.querySelector('.slider-range');

        if (!rangeMin || !rangeMax || !sliderMin || !sliderMax) return;

        const question = this.questions[this.currentStep];
        const unit = question.id === 'budget' ? '₪' : 'ק"מ';

        // Set appropriate max values based on question type
        const maxValue = question.id === 'budget' ? 300000 : 500000;
        const initialMaxValue = question.id === 'budget' ? 50000 : 100000;

        sliderMin.max = maxValue;
        sliderMax.max = maxValue;
        rangeMax.max = maxValue;

        // Set initial values to spread the sliders apart
        sliderMin.value = 0;
        sliderMax.value = initialMaxValue;

        // Update slider labels
        const sliderLabelMax = document.querySelector('.slider-label-max');
        if (sliderLabelMax) {
            sliderLabelMax.textContent = maxValue.toLocaleString();
        }

        const updateValues = () => {
            let minVal = parseInt(sliderMin.value);
            let maxVal = parseInt(sliderMax.value);

            // Ensure min doesn't exceed max
            if (minVal > maxVal) {
                if (sliderMin === document.activeElement) {
                    maxVal = minVal;
                    sliderMax.value = maxVal;
                } else {
                    minVal = maxVal;
                    sliderMin.value = minVal;
                }
            }

            // Update number inputs
            rangeMin.value = minVal;
            rangeMax.value = maxVal;

            // Update visual range
            const percent1 = (maxVal / maxValue) * 100;
            const percent2 = (minVal / maxValue) * 100;

            // Calculate right position: how much space is to the RIGHT of the right slider
            const rightPercent = (1 - percent2 / 100) * 100;
            // Calculate width: the difference between max and min positions
            const widthPercent = percent1 - percent2

            sliderRange.style.left = ''; // Clear left positioning
            sliderRange.style.right = 100 - rightPercent + '%';
            sliderRange.style.width = widthPercent + '%';

            // Update display
            if (rangeValues) {
                rangeValues.textContent = `${minVal.toLocaleString()} - ${maxVal.toLocaleString()} ${unit}`;
            }

            // Enable/disable next button
            const selectedOption = document.querySelector('.option.selected');
            if (selectedOption && selectedOption.dataset.value === 'טווח מותאם אישית') {
                nextBtn.disabled = minVal === maxVal || maxVal === 0;
            }
        };

        const updateFromInput = () => {
            const minVal = parseInt(rangeMin.value) || 0;
            const maxVal = rangeMax.value === '' ? 0 : parseInt(rangeMax.value) || 0;

            // Temporarily remove step to allow any value
            const originalMinStep = sliderMin.step;
            const originalMaxStep = sliderMax.step;

            sliderMin.step = "1";
            sliderMax.step = "1";

            // Set the values
            sliderMin.value = Math.min(minVal, maxVal);
            sliderMax.value = Math.max(minVal, maxVal);

            updateValues();

            // Restore original step for smooth dragging
            sliderMin.step = originalMinStep;
            sliderMax.step = originalMaxStep;
        };

        // Event listeners
        sliderMin.addEventListener('input', updateValues);
        sliderMax.addEventListener('input', updateValues);
        rangeMin.addEventListener('change', updateFromInput);
        rangeMax.addEventListener('change', updateFromInput);

        // Initialize
        updateValues();
    }

    getCurrentAnswer() {
        const question = this.questions[this.currentStep];

        if (question.type === 'multiple-choice') {
            const selectedOption = document.querySelector('.option.selected');
            if (!selectedOption) return null;

            // Handle custom range
            if (selectedOption.dataset.value === 'טווח מותאם אישית') {
                const rangeMin = document.querySelector('.range-min');
                const rangeMax = document.querySelector('.range-max');
                if (rangeMin && rangeMax) {
                    const minVal = parseInt(rangeMin.value) || 0;
                    const maxVal = parseInt(rangeMax.value) || 0;
                    const question = this.questions[this.currentStep];
                    const unit = question.id === 'budget' ? '₪' : 'ק"מ';
                    return `${minVal.toLocaleString()} - ${maxVal.toLocaleString()} ${unit}`;
                }
                return null;
            }

            return selectedOption.dataset.value;
        } else if (question.type === 'multiple-select') {
            const checkedBoxes = document.querySelectorAll('.checkbox-input:checked');
            const selectedValues = Array.from(checkedBoxes).map(checkbox => {
                const optionDiv = checkbox.closest('.option');
                return optionDiv ? optionDiv.dataset.value : null;
            }).filter(value => value !== null);
            return selectedValues.length > 0 ? selectedValues : null;
        } else if (question.type === 'text' || question.type === 'number') {
            const input = document.querySelector('.text-input');
            return input ? input.value.trim() : null;
        } else if (question.type === 'autocomplete') {
            // Handle multiple brand selections (both selected and has-value)
            const selectedBrands = document.querySelectorAll('.brand-option.selected');
            const customWithValue = document.querySelector('.custom-text-option.has-value');

            const values = [];

            // Process selected brands
            selectedBrands.forEach(option => {
                const value = option.dataset.value;
                if (value === 'custom') {
                    // Get custom text value (only if currently being edited)
                    const customValue = option.dataset.customValue;
                    if (customValue) {
                        values.push(customValue);
                    }
                } else if (value === '') {
                    // No preference
                    values.push('אין לי העדפה');
                } else {
                    // Regular brand
                    values.push(value);
                }
            });

            // Add custom option with value (if not currently being edited)
            if (customWithValue && !customWithValue.classList.contains('selected')) {
                const customValue = customWithValue.dataset.customValue;
                if (customValue) {
                    values.push(customValue);
                }
            }

            return values.length > 0 ? values : null;
        }

        return null;
    }

    nextStep() {
        const answer = this.getCurrentAnswer();

        if (!answer && this.questions[this.currentStep].required) {
            this.showError('Please provide an answer to continue.');
            return;
        }

        // Save the answer
        if (answer) {
            const question = this.questions[this.currentStep];
            this.answers.push({
                questionId: question.id,
                questionText: question.text,
                answer: answer
            });
        }

        this.currentStep++;

        if (this.currentStep >= this.questions.length) {
            this.showJsonResults();
        } else {
            this.renderWizard();
            this.updateProgress();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            // Remove the last answer when going back
            if (this.answers.length > 0) {
                this.answers.pop();
            }

            this.currentStep--;

            // Skip conditional questions that shouldn't be shown when going back
            while (this.currentStep >= 0 && !this.shouldShowQuestion(this.currentStep)) {
                this.currentStep--;
                // Also remove answers for skipped questions
                if (this.answers.length > 0) {
                    this.answers.pop();
                }
            }

            this.renderWizard();
            this.updateProgress();
        }
    }

    updateProgress() {
        // Count how many questions will actually be shown based on current answers
        let totalQuestionsToShow = 0;
        let questionsAnsweredSoFar = 0;

        for (let i = 0; i < this.questions.length; i++) {
            if (this.shouldShowQuestion(i)) {
                totalQuestionsToShow++;
                if (i <= this.currentStep) {
                    questionsAnsweredSoFar++;
                }
            }
        }

        const progress = totalQuestionsToShow > 0 ? (questionsAnsweredSoFar / totalQuestionsToShow) * 100 : 0;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    showJsonResults() {
        // Create JSON object with questions and answers
        const questionsAndAnswers = {
            summary: "תוצאות סקר מאתר הרכבים",
            timestamp: new Date().toISOString(),
            totalQuestions: this.questions.length,
            answeredQuestions: this.answers.length,
            responses: this.answers.map(answer => ({
                questionId: answer.questionId,
                questionText: answer.questionText,
                answer: answer.answer
            }))
        };

        // Convert to formatted JSON string
        const jsonString = JSON.stringify(questionsAndAnswers, null, 2);

        this.container.innerHTML = `
            <div class="wizard-step active">
                <div class="results">
                    <div class="results-header">
                        <h2 class="results-title">📋 תוצאות הסקר</h2>
                        <p class="results-subtitle">התשובות שלכם נאספו בהצלחה! השתמשו ברכיב ChatGPT למטה כדי לקבל המלצות רכב מותאמות אישית.</p>
                    </div>
                    

                    

                    
                    <div class="chatgpt-component">
                        <div class="chatgpt-header">
                            <h3>🤖 קבלת המלצות רכב מותאמות</h3>
                            <p>קבל 3 המלצות רכב מותאמות אישית + קישור חיפוש מותאם ב-yad2!</p>
                        </div>
                        
                        <div class="chatgpt-actions">
                            <button class="btn btn-chatgpt" id="copy-prompt-btn">
                                📋 העתק פרומפט 
                            </button>
                            <button class="btn btn-secondary" id="open-chatgpt-btn">
                                🚀 פתח ChatGPT
                            </button>
                        </div>
                        
                        <div class="prompt-preview">
                            <h4>תצוגה מקדימה של הפרומפט:</h4>
                            <div class="prompt-content" id="prompt-preview">
                                טוען פרומפט...
                            </div>
                        </div>
                    </div>
                    
                    <div class="navigation">
                        <button class="btn btn-secondary" id="restart-btn">
                            התחל מחדש
                        </button>
                        <button class="btn btn-primary" id="download-btn">
                            📥 הורד נתונים
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.setupJsonResultsEventListeners();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="wizard-step active">
                <div class="loading">
                    <div class="spinner"></div>
                    <h3>Finding your perfect car...</h3>
                    <p>Our AI is analyzing your preferences to recommend the best car for you.</p>
                </div>
            </div>
        `;
    }

    showResults(recommendation) {
        this.container.innerHTML = `
            <div class="wizard-step active">
                <div class="results">
                    <div class="results-header">
                        <h2 class="results-title">🎉 Your Car Recommendation</h2>
                        <p class="results-subtitle">Based on your preferences, here's what we recommend:</p>
                    </div>
                    
                    <div class="car-recommendation">
                        <h3 class="car-name">${recommendation.car}</h3>
                        <p class="car-price">Estimated Price: ${recommendation.estimatedPrice}</p>
                        <p class="car-reasoning">${recommendation.reasoning}</p>
                        
                        ${recommendation.features.length > 0 ? `
                            <div class="features-section">
                                <h4 class="section-title">Key Features:</h4>
                                <ul class="features-list">
                                    ${recommendation.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${recommendation.pros.length > 0 ? `
                            <div class="pros-section">
                                <h4 class="section-title">Pros:</h4>
                                <ul class="pros-list">
                                    ${recommendation.pros.map(pro => `<li>${pro}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${recommendation.cons.length > 0 ? `
                            <div class="cons-section">
                                <h4 class="section-title">Cons:</h4>
                                <ul class="cons-list">
                                    ${recommendation.cons.map(con => `<li>${con}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="navigation">
                        <button class="btn btn-secondary" id="restart-btn">
                            Start Over
                        </button>
                        <button class="btn btn-primary" id="share-btn">
                            Share Results
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.setupResultsEventListeners();
    }

    setupJsonResultsEventListeners() {
        const restartBtn = document.getElementById('restart-btn');
        const downloadBtn = document.getElementById('download-btn');
        const copyPromptBtn = document.getElementById('copy-prompt-btn');
        const openChatGPTBtn = document.getElementById('open-chatgpt-btn');

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restart();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadJson();
            });
        }

        if (copyPromptBtn) {
            copyPromptBtn.addEventListener('click', () => {
                this.copyFullPromptToClipboard();
            });
        }

        if (openChatGPTBtn) {
            openChatGPTBtn.addEventListener('click', () => {
                this.openChatGPT();
            });
        }

        // Initialize the prompt preview
        this.updatePromptPreview();
    }

    async copyJsonToClipboard() {
        const questionsAndAnswers = {
            summary: "Car Finder Survey Results",
            timestamp: new Date().toISOString(),
            totalQuestions: this.questions.length,
            answeredQuestions: this.answers.length,
            responses: this.answers.map(answer => ({
                questionId: answer.questionId,
                questionText: answer.questionText,
                answer: answer.answer
            }))
        };

        const jsonString = JSON.stringify(questionsAndAnswers, null, 2);

        try {
            await navigator.clipboard.writeText(jsonString);
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(jsonString);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            const copyBtn = document.getElementById('copy-btn');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textArea);
    }

    downloadJson() {
        const questionsAndAnswers = {
            summary: "Car Finder Survey Results",
            timestamp: new Date().toISOString(),
            totalQuestions: this.questions.length,
            answeredQuestions: this.answers.length,
            responses: this.answers.map(answer => ({
                questionId: answer.questionId,
                questionText: answer.questionText,
                answer: answer.answer
            }))
        };

        const jsonString = JSON.stringify(questionsAndAnswers, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'car-finder-survey-results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    restart() {
        this.currentStep = 0;
        this.answers = [];
        this.renderWizard();
        this.updateProgress();
    }

    shareResults() {
        if (navigator.share) {
            navigator.share({
                title: 'My Car Recommendation',
                text: 'Check out the car I was recommended!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showSuccess('Link copied to clipboard!');
            });
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;

        const currentStep = document.querySelector('.wizard-step');
        if (currentStep) {
            currentStep.insertBefore(errorDiv, currentStep.firstChild);

            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;

        const currentStep = document.querySelector('.wizard-step');
        if (currentStep) {
            currentStep.insertBefore(successDiv, currentStep.firstChild);

            setTimeout(() => {
                successDiv.remove();
            }, 3000);
        }
    }

    generateFullPrompt() {
        const questionsAndAnswers = {
            summary: "תוצאות סקר מאתר הרכבים",
            timestamp: new Date().toISOString(),
            totalQuestions: this.questions.length,
            answeredQuestions: this.answers.length,
            responses: this.answers.map(answer => ({
                questionId: answer.questionId,
                questionText: answer.questionText,
                answer: answer.answer
            }))
        };

        const jsonString = JSON.stringify(questionsAndAnswers, null, 2);

        return `בהתבסס על נתוני הסקר למציאת רכב, אנא תן לי 3 המלצות רכב מתאימות וסביר מדוע כל רכב מתאים לפי הנתונים שלהלן.

אנא ספק עבור כל רכב:
1. שם הרכב והדגם המדויק
2. מחיר משוער בישראל
3. נימוקים מפורטים מדוע הרכב מתאים
4. יתרונות וחסרונות

בנוסף, אנא צור קישור חיפוש מותאם ב-yad2.co.il שמתאים לקריטריונים של המשתמש.
השתמש בפורמט: https://www.yad2.co.il/vehicles/cars?price=[MIN_PRICE]-[MAX_PRICE]&year=[MIN_YEAR]-[MAX_YEAR]&manufacturer=[BRAND]&fuelType=[FUEL]
התאם את הפרמטרים בהתאם לתשובות המשתמש:
- price: טווח המחיר בש"ח (למשל: 40000-100000)
- year: טווח שנים מתאים (למשל: 2018-2024)
- manufacturer: יצרן מועדף אם צוין
- fuelType: סוג דלק (בנזין/היברידי/חשמלי/דיזל)

נתוני הסקר:
${jsonString}

תן את התשובה בעברית בפורמט ברור ומובנה, וכלול את קישור yad2 בסוף.`;
    }

    updatePromptPreview() {
        const promptPreview = document.getElementById('prompt-preview');
        if (promptPreview) {
            const fullPrompt = this.generateFullPrompt();
            // Show truncated version for preview
            const truncatedPrompt = fullPrompt.length > 300
                ? fullPrompt.substring(0, 300) + '...'
                : fullPrompt;
            promptPreview.textContent = truncatedPrompt;
        }
    }

    async copyFullPromptToClipboard() {
        const fullPrompt = this.generateFullPrompt();

        try {
            await navigator.clipboard.writeText(fullPrompt);
            const copyPromptBtn = document.getElementById('copy-prompt-btn');
            if (copyPromptBtn) {
                const originalText = copyPromptBtn.innerHTML;
                copyPromptBtn.innerHTML = '✅ הועתק!';
                setTimeout(() => {
                    copyPromptBtn.innerHTML = originalText;
                }, 2000);
            }
            this.showSuccess('הפרומפט המלא הועתקה ללוח! עכשיו פתח את ChatGPT והדבק');
        } catch (err) {
            console.error('Failed to copy prompt to clipboard:', err);
            this.showError('שגיאה בהעתקה ללוח');
        }
    }

    openChatGPT() {
        // Open ChatGPT in a new tab
        window.open('https://chat.openai.com/', '_blank');

        // Show helpful message
        this.showSuccess('ChatGPT נפתח בחלון חדש. הדבק את הפרומפט שהעתקת!');
    }
}

// Initialize the wizard when the page loads
let wizard;
document.addEventListener('DOMContentLoaded', () => {
    wizard = new CarFinderWizard();
}); 