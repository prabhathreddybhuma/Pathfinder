// DOM Elements
const matchCardsContainer = document.getElementById('matchCardsContainer');
const notificationElement = document.getElementById('notification');
const userNameElement = document.getElementById('userName');
const userEmailElement = document.getElementById('userEmail');
const loadingSpinner = document.getElementById('loading-spinner');

// API Endpoints
const API_ENDPOINTS = {
    USER_PROFILE: '/api/user/profile',
    CAREER_MATCHES: '/api/career-matches',
    SKILLS_GAP: '/api/skills-gap',
    JOB_OPENINGS: '/api/job-openings'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadCareerMatches();
    
    // Setup export button
    document.querySelector('.export-btn').addEventListener('click', exportMatches);
    
    // Setup event delegation for dynamically created buttons
    matchCardsContainer.addEventListener('click', (event) => {
        // Handle Analyze Skills Gap button clicks
        if (event.target.classList.contains('analyze-gap-btn')) {
            const careerPath = event.target.getAttribute('data-career');
            navigateToSkillsGap(careerPath);
        }
        
        // Handle View Job Openings button clicks
        if (event.target.classList.contains('view-jobs-btn')) {
            const careerPath = event.target.getAttribute('data-career');
            viewJobOpenings(careerPath);
        }
    });
});

// Load user profile data
async function loadUserProfile() {
    try {
        const response = await fetch(API_ENDPOINTS.USER_PROFILE);
        if (!response.ok) throw new Error('Failed to load user profile');
        
        const userData = await response.json();
        
        // Update user info in sidebar
        userNameElement.textContent = userData.name;
        userEmailElement.textContent = userData.email;
    } catch (error) {
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// Load career matches data
async function loadCareerMatches() {
    try {
        // Show loading spinner
        toggleLoadingState(true);
        
        // In a real application, this would be a fetch call to the API
        // const response = await fetch(API_ENDPOINTS.CAREER_MATCHES);
        // if (!response.ok) throw new Error('Failed to load career matches');
        // const matchesData = await response.json();
        
        // For demonstration, we'll use the sample data directly
        const matchesData = {
            "careerMatches": [
                {
                    "career": "software-engineer",
                    "matchPercentage": 38.0,
                    "requiredSkills": ["C++", "Agile", "Git", "System Design", "Software Testing", "Java"],
                    "missingSkills": ["C++", "Agile", "Git", "Software Testing"]
                },
                {
                    "career": "backend-developer",
                    "matchPercentage": 34.67,
                    "requiredSkills": ["C++", "Java", "System Design", "Agile", "Software Testing"],
                    "missingSkills": ["C++", "Agile", "Software Testing"]
                },
                {
                    "career": "data-scientist",
                    "matchPercentage": 5.33,
                    "requiredSkills": ["Python", "SQL", "Data Mining", "Data Visualization", "Deep Learning", "Hadoop", "TensorFlow", "PyTorch", "R", "Spark"],
                    "missingSkills": ["Data Mining", "R", "Deep Learning", "PyTorch", "Python", "Hadoop", "TensorFlow", "Data Visualization", "SQL", "Spark"]
                }
            ]
        };
        
        // Clear existing cards
        matchCardsContainer.innerHTML = '';
        
        // Create and append career match cards
        matchesData.careerMatches.forEach(match => {
            const cardElement = createCareerMatchCard(match);
            matchCardsContainer.appendChild(cardElement);
        });
        
        // Hide loading spinner
        toggleLoadingState(false);
    } catch (error) {
        toggleLoadingState(false);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// Create a career match card element
function createCareerMatchCard(matchData) {
    const cardElement = document.createElement('div');
    cardElement.className = 'match-card';
    
    // Format career title for display
    const formattedCareer = formatCareerPathName(matchData.career);
    
    // Round match percentage to nearest integer
    const matchPercentage = Math.round(matchData.matchPercentage);
    
    cardElement.innerHTML = `
        <div class="match-header">
            <h3 class="career-title">${formattedCareer}</h3>
            <div class="match-percentage">${matchPercentage}%</div>
        </div>
        <div class="skills-container">
            <div class="skills-section">
                <h4>Required Skills</h4>
                <ul class="skills-list">
                    ${matchData.requiredSkills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            <div class="skills-section missing">
                <h4>Missing Skills</h4>
                <ul class="skills-list">
                    ${matchData.missingSkills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="match-actions">
            <button class="analyze-gap-btn" data-career="${matchData.career}">Analyze Skills Gap</button>
            <button class="view-jobs-btn" data-career="${matchData.career}">View Job Openings</button>
        </div>
    `;
    
    return cardElement;
}

// Navigate to skills gap analysis page with selected career path
function navigateToSkillsGap(careerPath) {
    window.location.href = `skills-gap.html?career=${careerPath}`;
}

// View job openings for selected career path
function viewJobOpenings(careerPath) {
    showNotification(`Loading job openings for ${formatCareerPathName(careerPath)}...`, 'info');
    
    // In a real application, this would navigate to a job listings page
    // For demonstration, just show a notification
    setTimeout(() => {
        showNotification(`Job openings feature coming soon!`, 'info');
    }, 1500);
}

// Export matches as PDF or other format
function exportMatches() {
    showNotification('Exporting matches... Please wait', 'info');
    
    // This is a placeholder for actual export functionality
    // In a real application, you'd implement PDF generation or other export options
    setTimeout(() => {
        showNotification('Matches exported successfully', 'success');
    }, 1500);
}

// Handle logout
function handleLogout() {
    showNotification('Logging out...', 'info');
    
    // Simulate logout process (in real app, would call an API endpoint)
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Helper function to format career path name for display
function formatCareerPathName(pathValue) {
    // Convert kebab-case to Title Case with spaces
    return pathValue
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Show notification
function showNotification(message, type = 'info') {
    notificationElement.textContent = message;
    notificationElement.className = `notification ${type}`;
    
    // Remove hidden class
    notificationElement.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notificationElement.classList.add('hidden');
    }, 3000);
}

// Toggle loading state for the page
function toggleLoadingState(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}