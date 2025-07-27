class CarFinderWizard {
    constructor() {
        this.currentStep = 0;
        this.answers = [];
        this.questions = [];
        this.container = document.getElementById('wizard-container');
        
        this.init();
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
        const response = await fetch('/api/car-finder/questions');
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        this.questions = data.questions;
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
        const progress = ((this.currentStep + 1) / this.questions.length) * 100;

        this.container.innerHTML = `
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="wizard-step active">
                <div class="step-header">
                    <div class="step-number">${this.currentStep + 1}</div>
                    <h2 class="step-title">שאלה ${this.currentStep + 1} מתוך ${this.questions.length}</h2>
                    <p class="step-description">בואו נמצא את הרכב המושלם עבורכם!</p>
                </div>
                
                <div class="question">
                    <h3 class="question-text">${question.text}</h3>
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
                                                <input type="number" class="range-min range-number-input" min="0" step="1000" placeholder="0" />
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
                                                <input type="number" class="range-max range-number-input" min="0" step="1000" placeholder="${question.id === 'budget' ? '50000' : '100000'}" />
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
        }
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
            const percent1 = (minVal / maxValue) * 100;
            const percent2 = (maxVal / maxValue) * 100;
            sliderRange.style.left = percent1 + '%';
            sliderRange.style.width = (percent2 - percent1) + '%';

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
            const maxVal = parseInt(rangeMax.value) || initialMaxValue;
            
            sliderMin.value = Math.min(minVal, maxVal);
            sliderMax.value = Math.max(minVal, maxVal);
            updateValues();
        };

        // Event listeners
        sliderMin.addEventListener('input', updateValues);
        sliderMax.addEventListener('input', updateValues);
        rangeMin.addEventListener('input', updateFromInput);
        rangeMax.addEventListener('input', updateFromInput);

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
                        <p class="results-subtitle">התשובות שלכם נאספו. העתיקו את נתוני ה-JSON למטה לשימוש עם מודל הבינה המלאכותית המועדף עליכם להמלצות רכב.</p>
                    </div>
                    
                    <div class="json-container">
                        <div class="json-header">
                            <h3>JSON Data:</h3>
                            <button class="btn btn-copy" id="copy-btn">📋 Copy JSON</button>
                        </div>
                        <pre class="json-display"><code>${this.escapeHtml(jsonString)}</code></pre>
                    </div>
                    
                    <div class="instructions">
                        <h4>השלבים הבאים:</h4>
                        <p>העתיקו את נתוני ה-JSON והדביקו אותם במודל הבינה המלאכותית המועדף עליכם (ChatGPT, Claude, וכו') עם הנחיה כמו:</p>
                        <div class="prompt-example">
                            "בהתבסס על נתוני הסקר הזה למציאת רכב, אנא המליצו על 3 רכבים מתאימים לאדם הזה והסבירו מדוע כל אחד יהיה מתאים:"
                        </div>
                    </div>
                    
                    <div class="navigation">
                        <button class="btn btn-secondary" id="restart-btn">
                            Start Over
                        </button>
                        <button class="btn btn-primary" id="download-btn">
                            📥 Download JSON
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
        const copyBtn = document.getElementById('copy-btn');
        const downloadBtn = document.getElementById('download-btn');

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restart();
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyJsonToClipboard();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadJson();
            });
        }
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
}

// Initialize the wizard when the page loads
let wizard;
document.addEventListener('DOMContentLoaded', () => {
    wizard = new CarFinderWizard();
}); 