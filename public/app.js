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
                    <h2 class="step-title">Question ${this.currentStep + 1} of ${this.questions.length}</h2>
                    <p class="step-description">Let's find your perfect car!</p>
                </div>
                
                <div class="question">
                    <h3 class="question-text">${question.text}</h3>
                    ${this.renderQuestionInput(question)}
                </div>
                
                <div class="navigation">
                    <button class="btn btn-secondary" id="prev-btn" ${this.currentStep === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    <button class="btn btn-primary" id="next-btn" disabled>
                        ${this.currentStep === this.questions.length - 1 ? 'Get Recommendation' : 'Next →'}
                    </button>
                </div>
            </div>
        `;

        this.setupEventListeners();
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
                                        <span class="range-values">0 - 100,000 ${question.id === 'budget' ? '₪' : 'ק"מ'}</span>
                                    </div>
                                </div>
                                
                                <div class="dual-range-slider">
                                    <div class="slider-container">
                                        <input type="range" class="slider slider-min" min="0" max="500000" value="0" step="1000">
                                        <input type="range" class="slider slider-max" min="0" max="500000" value="100000" step="1000">
                                        <div class="slider-track"></div>
                                        <div class="slider-range"></div>
                                        <div class="slider-labels">
                                            <span class="slider-label-min">0</span>
                                            <span class="slider-label-max">500,000</span>
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
                                                <input type="number" class="range-max range-number-input" min="0" step="1000" placeholder="100000" />
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
                    <input type="text" class="text-input" placeholder="Enter your answer..." 
                           ${question.required ? 'required' : ''}>
                `;
            case 'number':
                return `
                    <input type="number" class="text-input" placeholder="Enter a number..." 
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
                nextBtn.disabled = checkedBoxes.length === 0;
                
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
                nextBtn.disabled = !input.value.trim();
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
        const maxValue = question.id === 'budget' ? 1000000 : 500000;
        sliderMin.max = maxValue;
        sliderMax.max = maxValue;
        rangeMax.max = maxValue;

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
            const maxVal = parseInt(rangeMax.value) || 100000;
            
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

        // Convert to formatted JSON string
        const jsonString = JSON.stringify(questionsAndAnswers, null, 2);

        this.container.innerHTML = `
            <div class="wizard-step active">
                <div class="results">
                    <div class="results-header">
                        <h2 class="results-title">📋 Survey Results</h2>
                        <p class="results-subtitle">Your responses have been collected. Copy the JSON below to use with your preferred LLM for car recommendations.</p>
                    </div>
                    
                    <div class="json-container">
                        <div class="json-header">
                            <h3>JSON Data:</h3>
                            <button class="btn btn-copy" id="copy-btn">📋 Copy JSON</button>
                        </div>
                        <pre class="json-display"><code>${this.escapeHtml(jsonString)}</code></pre>
                    </div>
                    
                    <div class="instructions">
                        <h4>Next Steps:</h4>
                        <p>Copy this JSON data and paste it into your preferred LLM (ChatGPT, Claude, etc.) with a prompt like:</p>
                        <div class="prompt-example">
                            "Based on this car finder survey data, please recommend 3 suitable cars for this person and explain why each would be a good fit:"
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