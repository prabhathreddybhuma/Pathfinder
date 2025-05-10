/**
 * Career Path Finder - Recommendations Page
 * This script handles loading and displaying career recommendations,
 * skills gaps, and job opportunities based on user profile data.
 */

// API Endpoints for career recommendation functionality
const API_ENDPOINTS = {
    // User data and authentication
    checkToken: 'http://localhost:5050/api/users/checkfortoken',
    getUserData: 'http://localhost:5050/api/users/dashboard',
    
    // Career recommendations - Update this URL with your current Colab URL
    getCareerRecommendations: 'https://5000-m-s-ac8pwxwjl616-c.us-east4-1.prod.colab.dev/api/career-recommendations',
    saveCareerPath: 'http://localhost:5050/api/save-career',
    getCareerDetails: 'http://localhost:5050/api/career-details',
    
    // Additional data endpoints
    getCareerSkills: 'http://localhost:5050/api/career-skills',
    getMoreCareerPaths: 'http://localhost:5050/api/more-career-paths',
    getCareerTips: 'http://localhost:5050/api/career-tips'
};

// DOM Elements
let elements = {};

// Page state to prevent duplicate renderings
const pageState = {
    isLoading: true,
    recommendationsLoaded: false,
    additionalPathsLoaded: false,
    tipsLoaded: false,
    fallbackDisplayed: false,
    user: null
};

/**
 * Initialize the page when document is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    cacheElements();
    
    // Initialize page
    initializeRecommendationsPage();
    
    // Set up event listeners
    setupEventListeners();
});

/**
 * Cache DOM elements for future use
 */
function cacheElements() {
    elements = {
        // User information elements
        userNameElement: document.getElementById('userName'),
        userEmailElement: document.getElementById('userEmail'),
        
        // Stats elements
        matchingSkillsElement: document.querySelector('.stat-item:nth-child(1) .stat-value'),
        yearsExperienceElement: document.querySelector('.stat-item:nth-child(2) .stat-value'),
        industryMatchesElement: document.querySelector('.stat-item:nth-child(3) .stat-value'),
        
        // Content containers
        careerCardsContainer: document.querySelector('.career-cards'),
        additionalCareersContainer: document.querySelector('.recommendation-grid'),
        tipsContainer: document.querySelector('.tip-cards'),
        
        // Notification element
        notificationElement: document.getElementById('notification'),
        
        // Loading elements
        loadingIndicator: document.querySelector('.loading-indicator')
    };
}

/**
 * Set up event listeners for buttons and actions
 */
function setupEventListeners() {
    // Generic delegate event listener for buttons
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        
        // View details buttons
        if (target.classList.contains('view-details-btn') || target.classList.contains('mini-view-btn')) {
            const careerIdAttribute = target.getAttribute('data-career-id');
            if (careerIdAttribute) {
                viewCareerDetails(careerIdAttribute);
                event.preventDefault();
            }
        }
        
        // Save career path buttons
        if (target.classList.contains('save-career-btn')) {
            const careerIdAttribute = target.getAttribute('data-career-id');
            if (careerIdAttribute) {
                saveCareerPath(careerIdAttribute);
                event.preventDefault();
            }
        }
        
        // Logout button
        if (target.classList.contains('logout-btn')) {
            handleLogout();
            event.preventDefault();
        }
    });
}

/**
 * Main page initialization function
 */
async function initializeRecommendationsPage() {
    try {
        // Show loading state
        setLoadingState(true);
        
        // Check if user is logged in
        const isAuthenticated = await checkAuthentication();
        if (!isAuthenticated) {
            window.location.href = 'index.html';
            return;
        }
        
        // Load user data and profile information
        const userData = await fetchUserData();
        pageState.user = userData.userDetails;
        
        // Load user info into header
        loadUserInfo();
        
        // Load all page data in parallel
        await Promise.allSettled([
            loadCareerRecommendations(),
            loadAdditionalCareerPaths(),
            loadCareerTips()
        ]);
        
        // If any of the sections failed to load, check if we need fallback content
        if (!pageState.recommendationsLoaded || !pageState.additionalPathsLoaded || !pageState.tipsLoaded) {
            if (!pageState.fallbackDisplayed) {
                displayFallbackContent();
            }
        }
    } catch (error) {
        console.error('Error initializing recommendations page:', error);
        showNotification('Error loading recommendations. Please try again.', 'error');
        
        if (!pageState.fallbackDisplayed) {
            displayFallbackContent();
        }
    } finally {
        setLoadingState(false);
    }
}

/**
 * Check if user is authenticated
 */
async function checkAuthentication() {
    try {
        const response = await fetch(API_ENDPOINTS.checkToken, {
            method: 'GET',
            credentials: 'include' // Ensures cookies are sent with the request
        });
        
        if (!response.ok) {
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
}

/**
 * Fetch user data from API
 */
async function fetchUserData() {
    try {
        const response = await fetch(API_ENDPOINTS.getUserData, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        showNotification('Unable to load user data', 'error');
        throw error;
    }
}

/**
 * Update UI with user information
 */
function loadUserInfo() {
    if (!pageState.user) return;
    
    if (elements.userNameElement) {
        elements.userNameElement.textContent = `${pageState.user.firstName} ${pageState.user.lastName}`;
    }
    
    if (elements.userEmailElement) {
        elements.userEmailElement.textContent = pageState.user.email;
    }
}

/**
 * Set loading state and update UI
 */
function setLoadingState(isLoading) {
    pageState.isLoading = isLoading;
    
    if (elements.loadingIndicator) {
        if (isLoading) {
            elements.loadingIndicator.classList.remove('hidden');
        } else {
            elements.loadingIndicator.classList.add('hidden');
        }
    }
    
    // Optional: disable UI interaction during loading
    if (isLoading) {
        document.body.classList.add('loading');
    } else {
        document.body.classList.remove('loading');
    }
}

/**
 * Format degree value to match dataset terminology
 */
function formatDegreeForModel(degree) {
    // Map frontend degree values to dataset values
    const degreeMap = {
        "highschool": "High School Diploma",
        "associates": "Associate's Degree",
        "bachelors": "B.Tech", // Map to B.Tech as per dataset
        "masters": "M.Tech", // Map to M.Tech as per dataset
        "phd": "Ph.D.",
        "professional": "Professional Degree"
    };
    
    return degreeMap[degree.toLowerCase()] || degree;
}

/**
 * Format course/field of study to match dataset terminology
 */
function formatCourseForModel(course) {
    if (!course) return "Computer Science and Engineering"; // Default
    
    // Map frontend course values to dataset values
    const courseMap = {
        "computer science": "Computer Science and Engineering",
        "information technology": "Information Technology",
        "electrical engineering": "Electrical Engineering",
        "data science": "Data Science",
        "software engineering": "Software Engineering",
        "csescience": "Computer Science and Engineering"
    };
    
    // Try exact match first
    if (courseMap[course.toLowerCase()]) {
        return courseMap[course.toLowerCase()];
    }
    
    // Try partial match
    for (const [key, value] of Object.entries(courseMap)) {
        if (course.toLowerCase().includes(key)) {
            return value;
        }
    }
    
    return course;
}

/**
 * Format skills for the ML model
 */
function formatSkillsForModel(skills) {
    if (!Array.isArray(skills)) {
        console.error('Skills is not an array:', skills);
        return [];
    }
    
    // Ensure skills are formatted as the model expects
    const skillsMap = {
        "javascript": "JavaScript",
        "react.js": "React",
        "reactjs": "React",
        "node.js": "Node.js",
        "nodejs": "Node.js",
        "python": "Python",
        "java": "Java",
        "html": "HTML5",
        "css": "CSS3",
        "aws": "AWS",
        "docker": "Docker",
        "kubernetes": "Kubernetes",
        "machine learning": "Machine Learning",
        "deep learning": "Deep Learning",
        "sql": "SQL",
        "postgresql": "PostgreSQL",
        "mongodb": "MongoDB"
    };
    
    return skills.map(skill => {
        const normalizedSkill = skill.toLowerCase();
        return skillsMap[normalizedSkill] || skill;
    });
}

/**
 * Format interests for the ML model
 */
function formatInterestsForModel(interests) {
    if (!Array.isArray(interests)) {
        console.error('Interests is not an array:', interests);
        return [];
    }
    
    // Map interests to match dataset values
    const interestsMap = {
        "web development": "Web Development",
        "mobile development": "Mobile Development",
        "artificial intelligence": "Artificial Intelligence",
        "data science": "Data Science",
        "machine learning": "Machine Learning",
        "cloud computing": "Cloud Computing",
        "cybersecurity": "Cybersecurity",
        "devops": "DevOps",
        "software development": "Software Development"
    };
    
    return interests.map(interest => {
        const normalizedInterest = interest.toLowerCase();
        return interestsMap[normalizedInterest] || interest;
    });
}

/**
 * Load career recommendations from ML model API
 */
async function loadCareerRecommendations() {
    try {
        // Format education data to match dataset values
        const educationDegree = formatDegreeForModel(pageState.user?.education?.degree || "");
        const educationField = formatCourseForModel(pageState.user?.education?.field || "");
        const specialization = pageState.user?.education?.specialization || "General";
        
        console.log('User education data:', {
            degree: educationDegree,
            field: educationField,
            specialization: specialization
        });
        
        // Get skills and format them
        let userSkills = [];
        if (Array.isArray(pageState.user?.skills)) {
            userSkills = formatSkillsForModel(pageState.user.skills);
        } else {
            console.warn('Skills not in expected format:', pageState.user?.skills);
        }
        
        console.log('Formatted skills:', userSkills);
        
        // Get interests and format them
        let userInterests = [];
        if (pageState.user?.interests?.careerInterests && 
            Array.isArray(pageState.user.interests.careerInterests)) {
            userInterests = formatInterestsForModel(pageState.user.interests.careerInterests);
        } else {
            console.warn('Interests not in expected format:', pageState.user?.interests?.careerInterests);
        }
        
        console.log('Formatted interests:', userInterests);
        
        // Prepare user data for the ML model
        const userData = {
            education: {
                degree: educationDegree,
                field: educationField,
                specialization: specialization
            },
            skills: userSkills,
            experience: pageState.user?.experience || [],
            interests: {
                careerInterests: userInterests
            }
        };
        
        console.log('Sending user data to ML model:', userData);
        
        // Call the ML model API
        const response = await fetch(API_ENDPOINTS.getCareerRecommendations, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations from ML model');
        }
        
        const data = await response.json();
        console.log('Received recommendations from ML model:', data);
        
        // Check if the response contains an error
        if (data.error) {
            throw new Error(`API error: ${data.error}`);
        }
        
        // Update UI with ML model recommendations
        updateProfileMatchStats(data.profileStats);
        
        // Transform the career matches to match your UI format
        const formattedCareers = data.careerMatches.map(match => ({
            id: match.career.toLowerCase().replace(/\s+/g, '-'),
            title: match.career,
            subtitle: match.subtitle || `${match.career} Professional`,
            matchScore: match.matchPercentage,
            salaryRange: match.salaryRange || { min: '60K', max: '120K' },
            growthPotential: match.growthPotential || 'Moderate',
            currentDemand: match.currentDemand || 'Moderate',
            matchedSkills: match.matchedSkills || [],
            gapSkills: match.missingSkills || []
        }));
        
        // Display the career recommendations
        displayCareerRecommendations(formattedCareers);
        
        pageState.recommendationsLoaded = true;
    } catch (error) {
        console.error('Error loading career recommendations:', error);
        showNotification('Error loading career recommendations: ' + error.message, 'error');
        pageState.recommendationsLoaded = false;
        
        // Show fallback content if there was an error
        if (!pageState.fallbackDisplayed) {
            displayFallbackContent();
        }
    }
}

/**
 * Load additional career paths
 */
async function loadAdditionalCareerPaths() {
    try {
        // In production, use the real API endpoint
        // const response = await fetch(API_ENDPOINTS.getMoreCareerPaths, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: 'include'
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to fetch additional career paths');
        // }
        // 
        // const data = await response.json();
        // displayAdditionalCareers(data.careers);
        
        // For development, use simulated data
        console.log('Loading additional career paths...');
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        displayAdditionalCareers([
            {
                id: 'ml-engineer',
                title: 'Machine Learning Engineer',
                matchScore: '79',
                salary: { min: '105K', max: '170K' },
                demand: 'High'
            },
            {
                id: 'devops-engineer',
                title: 'DevOps Engineer',
                matchScore: '76',
                salary: { min: '95K', max: '160K' },
                demand: 'Very High'
            },
            {
                id: 'mobile-developer',
                title: 'Mobile App Developer',
                matchScore: '72',
                salary: { min: '80K', max: '140K' },
                demand: 'High'
            },
            {
                id: 'security-engineer',
                title: 'Security Engineer',
                matchScore: '68',
                salary: { min: '90K', max: '150K' },
                demand: 'High'
            }
        ]);
        
        pageState.additionalPathsLoaded = true;
    } catch (error) {
        console.error('Error loading additional career paths:', error);
        showNotification('Error loading additional career options', 'error');
        pageState.additionalPathsLoaded = false;
    }
}

/**
 * Load career development tips
 */
async function loadCareerTips() {
    try {
        // In production, use real API endpoint
        // const response = await fetch(API_ENDPOINTS.getCareerTips, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: 'include'
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to fetch career tips');
        // }
        // 
        // const data = await response.json();
        // displayCareerTips(data.tips);
        
        // For development, use simulated data
        console.log('Loading career tips...');
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
        
        displayCareerTips([
            {
                icon: '📚',
                title: 'Continuous Learning',
                description: 'Set aside time each week to learn new skills and stay updated with industry trends.'
            },
            {
                icon: '🌐',
                title: 'Build Your Network',
                description: 'Join professional communities and attend industry events to expand your connections.'
            },
            {
                icon: '💼',
                title: 'Portfolio Development',
                description: 'Create personal projects to demonstrate your skills and problem-solving abilities.'
            }
        ]);
        
        pageState.tipsLoaded = true;
    } catch (error) {
        console.error('Error loading career tips:', error);
        showNotification('Error loading career development tips', 'error');
        pageState.tipsLoaded = false;
    }
}

/**
 * Update profile match statistics in the UI
 */
function updateProfileMatchStats(stats) {
    if (elements.matchingSkillsElement) {
        elements.matchingSkillsElement.textContent = stats.matchingSkills;
    }
    
    if (elements.yearsExperienceElement) {
        elements.yearsExperienceElement.textContent = stats.yearsExperience;
    }
    
    if (elements.industryMatchesElement) {
        elements.industryMatchesElement.textContent = stats.industryMatches;
    }
}

/**
 * Display career recommendations in the UI
 */
function displayCareerRecommendations(careers) {
    if (!elements.careerCardsContainer) {
        console.error('Career cards container not found');
        return;
    }
    
    if (!careers || careers.length === 0) {
        elements.careerCardsContainer.innerHTML = `
            <div class="empty-state">
                <p>No career recommendations found. Complete your profile to get personalized recommendations.</p>
            </div>
        `;
        return;
    }
    
    elements.careerCardsContainer.innerHTML = careers.map(career => `
        <div class="career-card">
            <div class="career-header">
                <span class="match-score">${career.matchScore}% Match</span>
                <h3 class="career-title">${career.title}</h3>
                <p class="career-subtitle">${career.subtitle}</p>
            </div>
            <div class="career-content">
                <div class="key-details">
                    <div class="detail-item">
                        <span class="detail-icon">💰</span>
                        <div class="detail-info">
                            <div class="detail-label">Salary Range</div>
                            <div class="detail-value">$${career.salaryRange.min} - $${career.salaryRange.max}</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">📈</span>
                        <div class="detail-info">
                            <div class="detail-label">Growth Potential</div>
                            <div class="detail-value">${career.growthPotential}</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <span class="detail-icon">🎯</span>
                        <div class="detail-info">
                            <div class="detail-label">Current Demand</div>
                            <div class="detail-value">${career.currentDemand}</div>
                        </div>
                    </div>
                </div>
                <div class="career-skills">
                    <h4 class="skills-title">Required Skills</h4>
                    <div class="skills-list">
                        ${career.matchedSkills.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                        ${career.gapSkills.map(skill => `
                            <span class="skill-tag gap">${skill}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="career-actions">
                <button class="view-details-btn" data-career-id="${career.id}">
                    View Details
                </button>
                <button class="save-career-btn" data-career-id="${career.id}">
                    Save Path
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Display additional career recommendations
 */
function displayAdditionalCareers(careers) {
    if (!elements.additionalCareersContainer) {
        console.error('Additional careers container not found');
        return;
    }
    
    if (!careers || careers.length === 0) {
        elements.additionalCareersContainer.innerHTML = '<div class="empty-state">No additional careers available</div>';
        return;
    }
    
    elements.additionalCareersContainer.innerHTML = careers.map(career => `
        <div class="mini-career-card">
            <div class="mini-card-header">
                <span class="mini-match">${career.matchScore}%</span>
                <h4>${career.title}</h4>
            </div>
            <div class="mini-card-content">
                <div class="mini-detail">
                    <span class="mini-label">Salary:</span>
                    <span class="mini-value">$${career.salary.min} - $${career.salary.max}</span>
                </div>
                <div class="mini-detail">
                    <span class="mini-label">Demand:</span>
                    <span class="mini-value">${career.demand}</span>
                </div>
            </div>
            <button class="mini-view-btn" data-career-id="${career.id}">View Details</button>
        </div>
    `).join('');
}

/**
 * Display career development tips
 */
function displayCareerTips(tips) {
    if (!elements.tipsContainer) {
        console.error('Tips container not found');
        return;
    }
    
    if (!tips || tips.length === 0) {
        elements.tipsContainer.innerHTML = '<div class="empty-state">No career tips available</div>';
        return;
    }
    
    elements.tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <div class="tip-icon">${tip.icon}</div>
            <h4>${tip.title}</h4>
            <p>${tip.description}</p>
        </div>
    `).join('');
}

/**
 * Display fallback content when API data is not available
 */
function displayFallbackContent() {
    // Set flag to avoid duplicate fallback rendering
    if (pageState.fallbackDisplayed) {
        return;
    }
    
    pageState.fallbackDisplayed = true;
    
    // Display placeholder content
    if (!pageState.recommendationsLoaded) {
        updateProfileMatchStats({
            matchingSkills: 'N/A',
            yearsExperience: 'N/A',
            industryMatches: 'N/A'
        });
        
        displayCareerRecommendations([
            {
                id: 'data-scientist',
                title: 'Data Scientist',
                subtitle: 'AI & Machine Learning Focus',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['Python', 'Machine Learning', 'Data Analysis'],
                gapSkills: ['Deep Learning']
            },
            {
                id: 'cloud-architect',
                title: 'Cloud Solutions Architect',
                subtitle: 'Enterprise Infrastructure',
                matchScore: 'N/A',
                salaryRange: { min: 'N/A', max: 'N/A' },
                growthPotential: 'N/A',
                currentDemand: 'N/A',
                matchedSkills: ['AWS', 'Cloud Architecture', 'DevOps'],
                gapSkills: ['Kubernetes']
            }
        ]);
    }
    
    if (!pageState.additionalPathsLoaded) {
        displayAdditionalCareers([
            {
                id: 'ml-engineer',
                title: 'Machine Learning Engineer',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            },
            {
                id: 'devops-engineer',
                title: 'DevOps Engineer',
                matchScore: 'N/A',
                salary: { min: 'N/A', max: 'N/A' },
                demand: 'N/A'
            }
        ]);
    }
    
    if (!pageState.tipsLoaded) {
        displayCareerTips([
            {
                icon: '📚',
                title: 'Continuous Learning',
                description: 'Set aside time each week to learn new skills and stay updated with industry trends.'
            },
            {
                icon: '🌐',
                title: 'Build Your Network',
                description: 'Join professional communities and attend industry events to expand your connections.'
            }
        ]);
    }
}

/**
 * View career details
 */
async function viewCareerDetails(careerId) {
    try {
        showNotification('Loading career details...', 'info');
        
        // In production, use real API
        // const response = await fetch(`${API_ENDPOINTS.getCareerDetails}/${careerId}`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: 'include'
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to fetch career details');
        // }
        // 
        // const data = await response.json();
        // window.location.href = `career-details.html?id=${careerId}`;
        
        // For development - simulate API call
        console.log(`Viewing career details for: ${careerId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, just show a notification
        showNotification('Career details feature coming soon!', 'success');
    } catch (error) {
        console.error('Error viewing career details:', error);
        showNotification('Unable to load career details. Please try again.', 'error');
    }
}

/**
 * Save career path
 */
async function saveCareerPath(careerId) {
    try {
        // In production, use real API
        // const response = await fetch(API_ENDPOINTS.saveCareerPath, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     credentials: 'include',
        //     body: JSON.stringify({
        //         careerId: careerId
        //     })
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to save career path');
        // }
        // 
        // const data = await response.json();
        
        // For development - simulate API call
        console.log(`Saving career path: ${careerId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        showNotification('Career path saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving career path:', error);
        showNotification('Failed to save career path. Please try again.', 'error');
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    fetch('http://localhost:5050/api/users/logout', {
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'index.html';
        } else {
            throw new Error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Logout error:', error);
        showNotification('Logout failed. Please try again.', 'error');
    });
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    if (!elements.notificationElement) {
        console.error('Notification element not found');
        alert(message); // Fallback to alert if notification element not found
        return;
    }
    
    elements.notificationElement.textContent = message;
    elements.notificationElement.className = `notification ${type}`;
    elements.notificationElement.classList.remove('hidden');
    
    // Clear any existing timeout
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }
    
    // Auto-hide notification after delay
    window.notificationTimeout = setTimeout(() => {
        elements.notificationElement.classList.add('hidden');
    }, 3000);
}