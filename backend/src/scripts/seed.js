require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Skill = require('../models/Skill');

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany({});
        await Skill.deleteMany({});

        console.log('Creating demo users...');

        const password = await bcrypt.hash('password123', 10);

        const users = await User.create([
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                passwordHash: password,
                skills: ['JavaScript', 'React', 'Node.js'],
                bio: 'Full-stack developer passionate about teaching web development',
                location: { type: 'Point', coordinates: [-122.4194, 37.7749] }
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                passwordHash: password,
                skills: ['Python', 'Data Science', 'Machine Learning'],
                bio: 'Data scientist looking to learn web technologies',
                location: { type: 'Point', coordinates: [-118.2437, 34.0522] }
            },
            {
                name: 'Carol Williams',
                email: 'carol@example.com',
                passwordHash: password,
                skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
                bio: 'Designer interested in frontend development',
                location: { type: 'Point', coordinates: [-87.6298, 41.8781] }
            }
        ]);

        console.log('Creating demo skills...');

        await Skill.create([
            {
                title: 'React Fundamentals',
                description: 'Learn the basics of React including components, props, state, and hooks',
                tags: ['react', 'javascript', 'frontend', 'web'],
                level: 'intermediate',
                availability: 'available',
                owner: users[0]._id
            },
            {
                title: 'Node.js Backend Development',
                description: 'Build REST APIs with Express and MongoDB',
                tags: ['nodejs', 'backend', 'express', 'mongodb'],
                level: 'intermediate',
                availability: 'available',
                owner: users[0]._id
            },
            {
                title: 'Python for Data Analysis',
                description: 'Introduction to pandas, numpy, and data visualization',
                tags: ['python', 'data-science', 'pandas', 'analytics'],
                level: 'beginner',
                availability: 'available',
                owner: users[1]._id
            },
            {
                title: 'Machine Learning Basics',
                description: 'Understanding ML algorithms and scikit-learn',
                tags: ['machine-learning', 'python', 'ai', 'data-science'],
                level: 'advanced',
                availability: 'available',
                owner: users[1]._id
            },
            {
                title: 'UI/UX Design Principles',
                description: 'Learn design thinking and user-centered design',
                tags: ['design', 'ui', 'ux', 'figma'],
                level: 'beginner',
                availability: 'available',
                owner: users[2]._id
            },
            {
                title: 'Responsive Web Design',
                description: 'Create beautiful, mobile-friendly interfaces',
                tags: ['css', 'design', 'responsive', 'web'],
                level: 'intermediate',
                availability: 'available',
                owner: users[2]._id
            }
        ]);

        console.log('✅ Seed data created successfully!');
        console.log('\nDemo users (all with password: password123):');
        console.log('- alice@example.com');
        console.log('- bob@example.com');
        console.log('- carol@example.com');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
