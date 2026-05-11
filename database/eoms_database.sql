-- ============================================================
-- Events & Opportunities Management System (EOMS)
-- Complete MySQL Database Schema
-- Compatible with XAMPP / phpMyAdmin
-- ============================================================

DROP DATABASE IF EXISTS eoms_db;
CREATE DATABASE eoms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eoms_db;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    phone VARCHAR(20) DEFAULT NULL,
    department VARCHAR(100) DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. EVENTS TABLE
-- ============================================================
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('workshop', 'seminar', 'conference', 'competition', 'cultural', 'sports', 'other') NOT NULL DEFAULT 'other',
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    end_date DATE DEFAULT NULL,
    end_time TIME DEFAULT NULL,
    venue VARCHAR(200) NOT NULL,
    max_participants INT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 3. OPPORTUNITIES TABLE
-- ============================================================
CREATE TABLE opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('job', 'internship', 'scholarship', 'fellowship', 'other') NOT NULL DEFAULT 'other',
    company VARCHAR(200) DEFAULT NULL,
    location VARCHAR(200) DEFAULT NULL,
    salary_range VARCHAR(100) DEFAULT NULL,
    deadline DATE NOT NULL,
    requirements TEXT DEFAULT NULL,
    contact_email VARCHAR(150) DEFAULT NULL,
    link VARCHAR(500) DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    status ENUM('open', 'closed', 'expired') NOT NULL DEFAULT 'open',
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 4. EVENT REGISTRATIONS TABLE
-- ============================================================
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('registered', 'waitlisted', 'cancelled', 'attended') NOT NULL DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_registration (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 5. OPPORTUNITY APPLICATIONS TABLE
-- ============================================================
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opportunity_id INT NOT NULL,
    user_id INT NOT NULL,
    cover_letter TEXT DEFAULT NULL,
    cv_path VARCHAR(255) DEFAULT NULL,
    status ENUM('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (opportunity_id, user_id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 6. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('event', 'opportunity', 'application', 'registration', 'system') NOT NULL DEFAULT 'system',
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    link VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================
-- SAMPLE SEED DATA
-- ============================================================

-- Passwords: "admin123" and "student123" (bcrypt hashed)
INSERT INTO users (full_name, email, password, role, phone, department) VALUES
('Admin User', 'admin@university.edu', '$2b$10$YQ8g0YhKr9H1eMZVhGJXaeGV0kFg5RzHqKz3KQ5kFLqmXzxXWqe6i', 'admin', '+92-300-1234567', 'Administration'),
('Ahmed Khan', 'ahmed@student.edu', '$2b$10$ZMpT1CJgh0Vx5GfKJK9vGuEH3xU.RbH5qFjFqK0Y1G8LdQ7IhD5pW', 'student', '+92-301-2345678', 'Computer Science'),
('Sara Ali', 'sara@student.edu', '$2b$10$ZMpT1CJgh0Vx5GfKJK9vGuEH3xU.RbH5qFjFqK0Y1G8LdQ7IhD5pW', 'student', '+92-302-3456789', 'Electrical Engineering'),
('Fatima Zahra', 'fatima@student.edu', '$2b$10$ZMpT1CJgh0Vx5GfKJK9vGuEH3xU.RbH5qFjFqK0Y1G8LdQ7IhD5pW', 'student', '+92-303-4567890', 'Business Administration'),
('Usman Tariq', 'usman@student.edu', '$2b$10$ZMpT1CJgh0Vx5GfKJK9vGuEH3xU.RbH5qFjFqK0Y1G8LdQ7IhD5pW', 'student', '+92-304-5678901', 'Mechanical Engineering');

-- Sample Events
INSERT INTO events (title, description, category, event_date, event_time, end_date, end_time, venue, max_participants, status, created_by) VALUES
('AI & Machine Learning Workshop', 'Learn the fundamentals of AI and ML with hands-on projects. This workshop covers neural networks, deep learning, and practical applications using Python and TensorFlow.', 'workshop', '2026-06-15', '09:00:00', '2026-06-15', '17:00:00', 'Computer Lab 3, CS Department', 50, 'upcoming', 1),
('Annual Tech Conference 2026', 'The biggest tech conference of the year featuring keynotes from industry leaders, panel discussions, and networking opportunities.', 'conference', '2026-07-20', '08:00:00', '2026-07-21', '18:00:00', 'University Auditorium', 500, 'upcoming', 1),
('Startup Pitch Competition', 'Present your startup idea to a panel of investors and industry experts. Win funding and mentorship opportunities.', 'competition', '2026-06-28', '14:00:00', '2026-06-28', '18:00:00', 'Business School Seminar Hall', 30, 'upcoming', 1),
('Research Methodology Seminar', 'A comprehensive seminar on research methodologies, academic writing, and publication strategies for graduate students.', 'seminar', '2026-06-10', '10:00:00', '2026-06-10', '13:00:00', 'Library Conference Room', 100, 'upcoming', 1),
('Inter-University Cricket Tournament', 'Annual cricket tournament featuring teams from top universities across the region.', 'sports', '2026-08-01', '08:00:00', '2026-08-05', '18:00:00', 'University Sports Ground', 200, 'upcoming', 1),
('Cultural Night 2026', 'Celebrate diversity with performances, food stalls, and cultural exhibitions from students representing different regions.', 'cultural', '2026-07-05', '18:00:00', '2026-07-05', '23:00:00', 'University Main Ground', 1000, 'upcoming', 1);

-- Sample Opportunities
INSERT INTO opportunities (title, description, type, company, location, salary_range, deadline, requirements, contact_email, status, created_by) VALUES
('Software Engineering Internship', 'Join our engineering team for a 3-month summer internship. Work on real-world projects using React, Node.js, and cloud technologies.', 'internship', 'TechCorp Pakistan', 'Lahore, Pakistan', 'PKR 50,000 - 80,000/month', '2026-06-30', 'Currently enrolled in CS/SE program. Knowledge of JavaScript, React, and Node.js. Good communication skills.', 'careers@techcorp.pk', 'open', 1),
('Graduate Teaching Assistant', 'Full-time teaching assistant position in the Computer Science department for the Fall 2026 semester.', 'job', 'University CS Department', 'On Campus', 'PKR 45,000/month', '2026-07-15', 'Master''s degree in CS or related field. Teaching experience preferred. Strong academic record.', 'hr@university.edu', 'open', 1),
('Merit-Based Scholarship 2026', 'Full tuition scholarship for high-achieving students maintaining a CGPA of 3.5 or above.', 'scholarship', 'University Financial Aid', 'On Campus', 'Full Tuition Coverage', '2026-08-01', 'CGPA 3.5 or above. Financial need assessment. No disciplinary record.', 'scholarships@university.edu', 'open', 1),
('Data Analyst - Remote', 'Remote data analyst position. Analyze large datasets, create visualizations, and generate insights for business decisions.', 'job', 'DataMinds Inc.', 'Remote', 'PKR 120,000 - 180,000/month', '2026-07-20', 'Bachelor''s in CS, Statistics, or related field. Proficiency in Python, SQL, and data visualization tools.', 'jobs@dataminds.com', 'open', 1),
('Research Fellowship Program', 'One-year research fellowship in Artificial Intelligence and Robotics lab. Includes stipend and conference travel support.', 'fellowship', 'National Research Council', 'Islamabad, Pakistan', 'PKR 75,000/month + Benefits', '2026-06-25', 'Master''s degree holder or final-year student. Published research papers preferred. Strong programming skills.', 'fellowship@nrc.gov.pk', 'open', 1);

-- Sample Registrations
INSERT INTO registrations (event_id, user_id, status) VALUES
(1, 2, 'registered'),
(1, 3, 'registered'),
(2, 2, 'registered'),
(2, 4, 'registered'),
(3, 5, 'registered'),
(4, 3, 'registered');

-- Sample Applications
INSERT INTO applications (opportunity_id, user_id, cover_letter, status) VALUES
(1, 2, 'I am a passionate CS student with experience in web development. I have built several projects using React and Node.js and would love to apply my skills in a professional environment.', 'pending'),
(1, 3, 'As an EE student with strong programming skills, I am eager to transition into software engineering. I have completed multiple online courses and built personal projects.', 'reviewed'),
(3, 4, 'I have maintained a CGPA of 3.8 throughout my academic career and am actively involved in extracurricular activities. This scholarship would help me focus on my studies.', 'shortlisted'),
(5, 2, 'I am deeply interested in AI research and have published a paper on machine learning applications in healthcare. This fellowship aligns perfectly with my career goals.', 'pending');

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(2, 'Registration Confirmed', 'You have been successfully registered for "AI & Machine Learning Workshop".', 'registration', 0),
(2, 'New Opportunity', 'A new internship opportunity "Software Engineering Internship" has been posted.', 'opportunity', 0),
(3, 'Application Update', 'Your application for "Software Engineering Internship" has been reviewed.', 'application', 1),
(4, 'Scholarship Update', 'Your application for "Merit-Based Scholarship 2026" has been shortlisted!', 'application', 0),
(2, 'Event Reminder', 'Reminder: "AI & Machine Learning Workshop" is happening on June 15, 2026.', 'event', 0);

-- ============================================================
-- END OF DATABASE SCHEMA
-- ============================================================
