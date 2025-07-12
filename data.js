// Mock JSON data for the student dashboard
const studentData = {
    students: [
        {
            id: "STU001",
            name: "Sarah Johnson",
            email: "sarah.johnson@email.com",
            major: "Computer Science",
            gpa: 3.8,
            credits: 120,
            status: "active",
            enrollmentDate: "2021-09-15"
        },
        {
            id: "STU002",
            name: "Michael Chen",
            email: "michael.chen@email.com",
            major: "Business Administration",
            gpa: 3.6,
            credits: 135,
            status: "graduated",
            enrollmentDate: "2020-09-10"
        },
        {
            id: "STU003",
            name: "Emily Rodriguez",
            email: "emily.rodriguez@email.com",
            major: "Psychology",
            gpa: 3.9,
            credits: 90,
            status: "active",
            enrollmentDate: "2022-01-20"
        },
        {
            id: "STU004",
            name: "David Thompson",
            email: "david.thompson@email.com",
            major: "Engineering",
            gpa: 3.4,
            credits: 100,
            status: "active",
            enrollmentDate: "2021-09-01"
        },
        {
            id: "STU005",
            name: "Lisa Wang",
            email: "lisa.wang@email.com",
            major: "Mathematics",
            gpa: 4.0,
            credits: 140,
            status: "graduated",
            enrollmentDate: "2020-09-05"
        },
        {
            id: "STU006",
            name: "James Wilson",
            email: "james.wilson@email.com",
            major: "History",
            gpa: 3.2,
            credits: 75,
            status: "active",
            enrollmentDate: "2022-09-12"
        },
        {
            id: "STU007",
            name: "Maria Garcia",
            email: "maria.garcia@email.com",
            major: "Biology",
            gpa: 3.7,
            credits: 110,
            status: "active",
            enrollmentDate: "2021-01-15"
        },
        {
            id: "STU008",
            name: "Robert Brown",
            email: "robert.brown@email.com",
            major: "Chemistry",
            gpa: 3.3,
            credits: 95,
            status: "inactive",
            enrollmentDate: "2021-09-20"
        }
    ],
    
    courses: [
        {
            code: "CS101",
            name: "Introduction to Programming",
            instructor: "Dr. Smith",
            credits: 3,
            semester: "Fall 2024",
            enrolledStudents: 45
        },
        {
            code: "MATH201",
            name: "Calculus II",
            instructor: "Prof. Johnson",
            credits: 4,
            semester: "Fall 2024",
            enrolledStudents: 32
        },
        {
            code: "ENG102",
            name: "English Composition",
            instructor: "Dr. Wilson",
            credits: 3,
            semester: "Fall 2024",
            enrolledStudents: 38
        },
        {
            code: "HIST150",
            name: "World History",
            instructor: "Prof. Davis",
            credits: 3,
            semester: "Fall 2024",
            enrolledStudents: 28
        },
        {
            code: "BIO101",
            name: "General Biology",
            instructor: "Dr. Anderson",
            credits: 4,
            semester: "Fall 2024",
            enrolledStudents: 35
        }
    ],
    
    grades: [
        {
            studentId: "STU001",
            studentName: "Sarah Johnson",
            course: "CS101",
            grade: "A",
            points: 4.0,
            semester: "Fall 2024"
        },
        {
            studentId: "STU002",
            studentName: "Michael Chen",
            course: "MATH201",
            grade: "B+",
            points: 3.3,
            semester: "Fall 2024"
        },
        {
            studentId: "STU003",
            studentName: "Emily Rodriguez",
            course: "ENG102",
            grade: "A-",
            points: 3.7,
            semester: "Fall 2024"
        },
        {
            studentId: "STU004",
            studentName: "David Thompson",
            course: "CS101",
            grade: "B",
            points: 3.0,
            semester: "Fall 2024"
        },
        {
            studentId: "STU005",
            studentName: "Lisa Wang",
            course: "MATH201",
            grade: "A",
            points: 4.0,
            semester: "Fall 2024"
        }
    ]
};

// Function to simulate AJAX call delay
function simulateAjaxDelay(data, delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}

// Function to get filtered student data
function getFilteredStudents(filter = 'all') {
    let filteredStudents = studentData.students;
    
    if (filter === 'active') {
        filteredStudents = studentData.students.filter(student => student.status === 'active');
    } else if (filter === 'graduated') {
        filteredStudents = studentData.students.filter(student => student.status === 'graduated');
    }
    
    return filteredStudents;
}

// Function to calculate statistics
function calculateStatistics(students = studentData.students) {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const graduatedStudents = students.filter(s => s.status === 'graduated').length;
    const totalGPA = students.reduce((sum, student) => sum + student.gpa, 0);
    const averageGPA = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(2) : 0;
    
    return {
        totalStudents,
        activeStudents,
        graduatedStudents,
        averageGPA
    };
}
