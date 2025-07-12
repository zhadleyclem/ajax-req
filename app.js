// Main application JavaScript file
class StudentDashboard {
    constructor() {
        this.currentSection = 'students';
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.compileTemplates();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(e.target.dataset.section);
            });
        });

        // Load data button
        document.getElementById('load-data-btn').addEventListener('click', () => {
            this.loadData();
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshData();
        });

        // Filter select
        document.getElementById('data-filter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.loadData();
        });
    }

    compileTemplates() {
        // Compile Handlebars templates
        this.templates = {
            student: Handlebars.compile(document.getElementById('student-template').innerHTML),
            course: Handlebars.compile(document.getElementById('course-template').innerHTML),
            stats: Handlebars.compile(document.getElementById('stats-template').innerHTML)
        };
    }

    switchSection(section) {
        this.currentSection = section;
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Update section title
        const titles = {
            students: 'Student Information',
            courses: 'Course Management',
            grades: 'Grade Reports'
        };
        document.getElementById('section-title').textContent = titles[section];
        
        // Update filter options based on section
        this.updateFilterOptions(section);
        
        // Load appropriate data
        this.loadData();
    }

    updateFilterOptions(section) {
        const filterSelect = document.getElementById('data-filter');
        filterSelect.innerHTML = '';
        
        if (section === 'students') {
            filterSelect.innerHTML = `
                <option value="all">All Students</option>
                <option value="active">Active Only</option>
                <option value="graduated">Graduated</option>
            `;
        } else if (section === 'courses') {
            filterSelect.innerHTML = `
                <option value="all">All Courses</option>
                <option value="fall">Fall 2024</option>
                <option value="spring">Spring 2024</option>
            `;
        } else if (section === 'grades') {
            filterSelect.innerHTML = `
                <option value="all">All Grades</option>
                <option value="current">Current Semester</option>
                <option value="high">High Performers</option>
            `;
        }
    }

    showLoading() {
        document.getElementById('loading-spinner').style.display = 'block';
        document.getElementById('data-container').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('data-container').style.display = 'block';
    }

    async loadData() {
        this.showLoading();
        
        try {
            let data;
            
            if (this.currentSection === 'students') {
                const students = getFilteredStudents(this.currentFilter);
                data = await simulateAjaxDelay({ students }, 800);
                this.renderStudents(data);
                this.renderStatistics(calculateStatistics(students));
            } else if (this.currentSection === 'courses') {
                data = await simulateAjaxDelay({ courses: studentData.courses }, 600);
                this.renderCourses(data);
                this.renderCourseStats();
            } else if (this.currentSection === 'grades') {
                data = await simulateAjaxDelay({ grades: studentData.grades }, 700);
                this.renderGrades(data);
                this.renderGradeStats();
            }
            
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.hideLoading();
            this.showError('Failed to load data. Please try again.');
        }
    }

    renderStudents(data) {
        const container = document.getElementById('data-container');
        const html = this.templates.student(data);
        container.innerHTML = html;
        container.classList.add('fade-in');
    }

    renderCourses(data) {
        const container = document.getElementById('data-container');
        const html = this.templates.course(data);
        container.innerHTML = html;
        container.classList.add('fade-in');
    }

    renderGrades(data) {
        const container = document.getElementById('data-container');
        let html = '<div class="grades-list">';
        
        data.grades.forEach(grade => {
            html += `
                <div class="grade-item">
                    <h4>${grade.studentName}</h4>
                    <p><strong>Course:</strong> ${grade.course}</p>
                    <p><strong>Grade:</strong> <span class="grade-display">${grade.grade}</span></p>
                    <p><strong>Points:</strong> ${grade.points}</p>
                    <p><strong>Semester:</strong> ${grade.semester}</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        container.classList.add('fade-in');
    }

    renderStatistics(stats) {
        const container = document.getElementById('stats-section');
        const html = this.templates.stats(stats);
        container.innerHTML = html;
    }

    renderCourseStats() {
        const container = document.getElementById('stats-section');
        const totalCourses = studentData.courses.length;
        const totalEnrolled = studentData.courses.reduce((sum, course) => sum + course.enrolledStudents, 0);
        const avgEnrollment = Math.round(totalEnrolled / totalCourses);
        const fallCourses = studentData.courses.filter(c => c.semester === 'Fall 2024').length;
        
        const html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Total Courses</h4>
                    <span class="stat-number">${totalCourses}</span>
                </div>
                <div class="stat-card">
                    <h4>Total Enrolled</h4>
                    <span class="stat-number">${totalEnrolled}</span>
                </div>
                <div class="stat-card">
                    <h4>Avg Enrollment</h4>
                    <span class="stat-number">${avgEnrollment}</span>
                </div>
                <div class="stat-card">
                    <h4>Fall 2024 Courses</h4>
                    <span class="stat-number">${fallCourses}</span>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    renderGradeStats() {
        const container = document.getElementById('stats-section');
        const totalGrades = studentData.grades.length;
        const avgPoints = (studentData.grades.reduce((sum, grade) => sum + grade.points, 0) / totalGrades).toFixed(2);
        const aGrades = studentData.grades.filter(g => g.grade.startsWith('A')).length;
        const currentSemester = studentData.grades.filter(g => g.semester === 'Fall 2024').length;
        
        const html = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>Total Grades</h4>
                    <span class="stat-number">${totalGrades}</span>
                </div>
                <div class="stat-card">
                    <h4>Average Points</h4>
                    <span class="stat-number">${avgPoints}</span>
                </div>
                <div class="stat-card">
                    <h4>A Grades</h4>
                    <span class="stat-number">${aGrades}</span>
                </div>
                <div class="stat-card">
                    <h4>Current Semester</h4>
                    <span class="stat-number">${currentSemester}</span>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    refreshData() {
        console.log('Refreshing data...');
        this.loadData();
    }

    loadInitialData() {
        // Load students by default
        this.loadData();
    }

    showError(message) {
        const container = document.getElementById('data-container');
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;">
                <h3>Error</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="dashboard.loadData()">Try Again</button>
            </div>
        `;
    }
}

// Global functions for button clicks (called from Handlebars templates)
function viewDetails(studentId) {
    const student = studentData.students.find(s => s.id === studentId);
    if (student) {
        alert(`Student Details:\n\nName: ${student.name}\nEmail: ${student.email}\nMajor: ${student.major}\nGPA: ${student.gpa}\nStatus: ${student.status}\nCredits: ${student.credits}`);
    }
}

function editStudent(studentId) {
    const student = studentData.students.find(s => s.id === studentId);
    if (student) {
        const newGPA = prompt(`Edit GPA for ${student.name}:`, student.gpa);
        if (newGPA && !isNaN(newGPA) && newGPA >= 0 && newGPA <= 4) {
            student.gpa = parseFloat(newGPA);
            dashboard.loadData(); // Refresh the display
            alert('GPA updated successfully!');
        } else if (newGPA !== null) {
            alert('Please enter a valid GPA between 0 and 4');
        }
    }
}

// Initialize the dashboard when the page loads
let dashboard;
document.addEventListener('DOMContentLoaded', function() {
    dashboard = new StudentDashboard();
    console.log('Student Dashboard initialized successfully');
});

// Add some additional CSS for grades display
const additionalStyles = `
    .grades-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }
    
    .grade-item {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-left: 4px solid #28a745;
    }
    
    .grade-item h4 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .grade-display {
        font-weight: bold;
        color: #28a745;
        font-size: 1.1rem;
    }
    
    .error-message {
        animation: fadeIn 0.5s ease-in;
    }
`;

// Add the additional styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
