// Global state to store user data
let userProfile = {
    education: null,
    skills: [],
    experience: null,
    interests: []
};

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Set user name in dashboard
    document.getElementById('userName').textContent = user.fullName || 'User';

    // Initialize first step
    showStep(1);
});

// Step Navigation Functions
function showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.step-content');
    steps.forEach(step => step.classList.remove('active'));

    // Show current step
    const currentStep = document.getElementById(`step${stepNumber}`);
    currentStep.classList.add('active');

    // Update progress indicators
    updateStepIndicators(stepNumber);
}

function updateStepIndicators(currentStep) {
    const indicators = document.querySelectorAll('.step');
    indicators.forEach(indicator => {
        const step = parseInt(indicator.dataset.step);
        if (step <= currentStep) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextStep(currentStep) {
    if (validateStep(currentStep)) {
        saveStepData(currentStep);
        showStep(currentStep + 1);
    }
}

function previousStep(step) {
    showStep(step);
}

// Validation Functions
function validateStep(step) {
    switch(step) {
        case 1: // Education
            const degree = document.getElementById('highestDegree').value;
            const field = document.getElementById('fieldOfStudy').value;
            const year = document.getElementById('graduationYear').value;

            if (!degree || !field || !year) {
                showError('Please fill in all education fields');
                return false;
            }

            if (year < 1950 || year > 2025) {
                showError('Please enter a valid graduation year');
                return false;
            }
            return true;

        case 2: // Skills
            const selectedSkills = getSelectedSkills();
            if (selectedSkills.length === 0) {
                showError('Please select at least one skill');
                return false;
            }
            return true;

        case 3: // Experience
            const experience = document.getElementById('yearsExperience').value;
            const role = document.getElementById('currentRole').value;
            const industry = document.getElementById('industry').value;

            if (!experience || !role || !industry) {
                showError('Please complete all experience fields');
                return false;
            }
            return true;

        case 4: // Interests
            const selectedInterests = getSelectedInterests();
            const workEnv = document.getElementById('preferredWorkEnvironment').value;

            if (selectedInterests.length === 0 || !workEnv) {
                showError('Please select your interests and preferred work environment');
                return false;
            }
            return true;

        default:
            return true;
    }
}

// Data Management Functions
function saveStepData(step) {
    switch(step) {
        case 1:
            userProfile.education = {
                degree: document.getElementById('highestDegree').value,
                field: document.getElementById('fieldOfStudy').value,
                graduationYear: document.getElementById('graduationYear').value
            };
            break;

        case 2:
            userProfile.skills = getSelectedSkills();
            break;

        case 3:
            userProfile.experience = {
                years: document.getElementById('yearsExperience').value,
                currentRole: document.getElementById('currentRole').value,
                industry: document.getElementById('industry').value
            };
            break;

        case 4:
            userProfile.interests = {
                areas: getSelectedInterests(),
                workEnvironment: document.getElementById('preferredWorkEnvironment').value
            };
            break;
    }

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function getSelectedSkills() {
    const technicalSkills = Array.from(document.querySelectorAll('input[type="checkbox"][id^="skill"]:checked'))
        .map(cb => cb.value);
    const softSkills = Array.from(document.querySelectorAll('input[type="checkbox"][id^="softSkill"]:checked'))
        .map(cb => cb.value);
    return [...technicalSkills, ...softSkills];
}

function getSelectedInterests() {
    return Array.from(document.querySelectorAll('input[type="checkbox"][id^="interest"]:checked'))
        .map(cb => cb.value);
}

// Form Submission
function submitProfile(event) {
    event.preventDefault();

    if (!validateStep(4)) {
        return;
    }

    saveStepData(4);

    // Show loading state
    const submitButton = event.target;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Simulate API call to process profile
    setTimeout(() => {
        // Generate career recommendations based on profile
        generateRecommendations(userProfile)
            .then(recommendations => {
                // Save recommendations
                localStorage.setItem('recommendations', JSON.stringify(recommendations));
                // Redirect to recommendations page
                window.location.href = 'recommendations.html';
            })
            .catch(error => {
                showError('Error generating recommendations. Please try again.');
                submitButton.textContent = 'Complete Profile';
                submitButton.disabled = false;
            });
    }, 1500);
}

// Helper Functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    document.querySelector('.main-content').prepend(errorDiv);

    // Remove error after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

async function generateRecommendations(profile) {
    // This would typically be an API call to your backend
    // For now, we'll simulate some recommendations
    return {
        careerPaths: [
            {
                title: 'Software Developer',
                match: 95,
                skills: ['Programming', 'Problem Solving', 'Communication'],
                learning: ['Cloud Computing', 'DevOps']
            },
            {
                title: 'Data Analyst',
                match: 88,
                skills: ['Data Analysis', 'SQL', 'Statistics'],
                learning: ['Machine Learning', 'Python']
            },
            // Add more career paths
        ],
        skillGaps: [
            {
                skill: 'Cloud Computing',
                importance: 'High',
                courses: ['AWS Certified Solutions Architect', 'Google Cloud Platform Fundamentals']
            },
            // Add more skill gaps
        ],
        jobMatches: [
            {
                title: 'Senior Software Engineer',
                company: 'Tech Corp',
                match: 92,
                requirements: ['5+ years experience', 'JavaScript', 'React']
            },
            // Add more job matches
        ]
    };
}

// Logout Function
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    window.location.href = 'index.html';
}