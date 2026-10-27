const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Request = require('../models/Request');
const Notification = require('../models/Notification');
const { getInitials } = require('./avatar');

const seedData = async (disconnect = false) => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flexi';

  if (mongoose.connection.readyState !== 1) {
    console.log(`🌱 Connecting to MongoDB: ${uri}`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (err) {
      console.warn(`Could not connect to ${uri}. Using in-memory fallback for seed test...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({ instance: { dbName: 'flexi' } });
      await mongoose.connect(mongod.getUri());
    }
  }

  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    Project.deleteMany({}),
    Request.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('👤 Creating demo students...');
  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Demo123', salt);

  const rawStudents = [
    {
      name: 'Alex Rivera',
      email: 'alex@flexi.com',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Full-stack developer passionate about React, Node.js, and mentoring fellow students.',
      completedExchanges: 4,
    },
    {
      name: 'Riya Sharma',
      email: 'riya@flexi.com',
      department: 'Information Technology',
      year: '2nd Year',
      bio: 'UI/UX enthusiast, Figma lover, and frontend explorer looking to learn backend engineering.',
      completedExchanges: 3,
    },
    {
      name: 'Marcus Chen',
      email: 'marcus@flexi.com',
      department: 'Computer Science',
      year: '4th Year',
      bio: 'Competitive programmer and algorithms tutor. Love solving graph theory and dynamic programming.',
      completedExchanges: 5,
    },
    {
      name: 'Priya Patel',
      email: 'priya@flexi.com',
      department: 'Electronics & Communication',
      year: '3rd Year',
      bio: 'Embedded systems & IoT hobbyist. Can teach Arduino and circuit design in exchange for Python.',
      completedExchanges: 2,
    },
    {
      name: 'David Kim',
      email: 'david@flexi.com',
      department: 'Business Administration',
      year: '2nd Year',
      bio: 'Finance & entrepreneurship student. Ready to help tech teams build pitch decks and business models.',
      completedExchanges: 3,
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@flexi.com',
      department: 'Linguistics & Languages',
      year: '1st Year',
      bio: 'Native English & fluent Spanish speaker. Looking to learn web design while helping you master Spanish!',
      completedExchanges: 2,
    },
    {
      name: 'Liam Wilson',
      email: 'liam@flexi.com',
      department: 'Mechanical Engineering',
      year: '3rd Year',
      bio: '3D modeling with Blender & CAD. Passionate about robotics and creative digital prototyping.',
      completedExchanges: 1,
    },
    {
      name: 'Ananya Gupta',
      email: 'ananya@flexi.com',
      department: 'Data Science & AI',
      year: '4th Year',
      bio: 'Machine learning and Python specialist. Looking to collaborate on real-world datasets and hackathons.',
      completedExchanges: 4,
    },
  ];

  const createdUsers = [];
  for (const s of rawStudents) {
    const user = await User.create({
      ...s,
      passwordHash: commonPasswordHash,
      avatarInitials: getInitials(s.name),
    });
    createdUsers.push(user);
  }

  const [alex, riya, marcus, priya, david, sarah, liam, ananya] = createdUsers;

  console.log('⚡ Creating 20 diverse skills...');
  const rawSkills = [
    // Alex
    {
      name: 'React.js & Component Architecture',
      category: 'Programming',
      level: 'Advanced',
      description: 'Hands-on guidance on React hooks, state management, reusable components, and API integration.',
      offeredBy: alex._id,
      wantedSkill: 'Figma UI/UX Design System',
      availability: 'Weekdays 5-8 PM',
    },
    {
      name: 'Node.js & Express REST APIs',
      category: 'Programming',
      level: 'Advanced',
      description: 'Building secure RESTful backends, JWT authentication, MongoDB schemas, and clean middleware.',
      offeredBy: alex._id,
      wantedSkill: 'Docker or Cloud Deployment',
      availability: 'Saturday Mornings',
    },
    // Riya
    {
      name: 'Figma UI/UX & Design Systems',
      category: 'Design',
      level: 'Advanced',
      description: 'Learn wireframing, interactive prototyping, autolayout, components, and design systems in Figma.',
      offeredBy: riya._id,
      wantedSkill: 'React.js & Component Architecture',
      availability: 'Tuesdays & Thursdays',
    },
    {
      name: 'Mobile App Wireframing & UX Research',
      category: 'Design',
      level: 'Intermediate',
      description: 'User persona creation, journey mapping, usability testing, and mobile design patterns.',
      offeredBy: riya._id,
      wantedSkill: 'Python for Beginners',
      availability: 'Weekends',
    },
    // Marcus
    {
      name: 'Data Structures & Algorithms in C++',
      category: 'Programming',
      level: 'Expert',
      description: 'Master binary trees, graphs, dynamic programming, and LeetCode problem-solving patterns.',
      offeredBy: marcus._id,
      wantedSkill: 'Machine Learning Fundamentals',
      availability: 'Monday & Wednesday evenings',
    },
    {
      name: 'Chess Strategy & Tactical Thinking',
      category: 'Sports',
      level: 'Advanced',
      description: 'Opening theories, middle game strategy, pawn structures, and endgames for aspiring tournament players.',
      offeredBy: marcus._id,
      wantedSkill: 'Conversational Spanish',
      availability: 'Sunday Afternoons',
    },
    {
      name: 'Vector Graphics with Adobe Illustrator',
      category: 'Design',
      level: 'Intermediate',
      description: 'Creating logos, vector badges, SVG icons, and campus event posters.',
      offeredBy: marcus._id,
      wantedSkill: 'Full-Stack Web Dev',
      availability: 'Friday Evenings',
    },
    // Priya
    {
      name: 'Arduino & Microcontroller Prototyping',
      category: 'Other',
      level: 'Advanced',
      description: 'Interfacing sensors, motor drivers, LCD screens, and writing embedded C/C++ code.',
      offeredBy: priya._id,
      wantedSkill: 'Python Automation',
      availability: 'Weekends',
    },
    {
      name: 'Digital Logic & Circuit Simulation',
      category: 'Academics',
      level: 'Intermediate',
      description: 'Combinational logic, sequential circuits, flip-flops, and Logisim simulation.',
      offeredBy: priya._id,
      wantedSkill: 'Data Structures in C++',
      availability: 'Thursday Evenings',
    },
    // David
    {
      name: 'Startup Pitch Deck & Business Modeling',
      category: 'Business',
      level: 'Advanced',
      description: 'Structure convincing investor decks, market sizing, value proposition canvas, and unit economics.',
      offeredBy: david._id,
      wantedSkill: 'React Web Development',
      availability: 'Flexible Evenings',
    },
    {
      name: 'Financial Modeling & Excel Shortcuts',
      category: 'Business',
      level: 'Intermediate',
      description: 'Valuation basics, discounted cash flows, sensitivity tables, and financial projections in Excel.',
      offeredBy: david._id,
      wantedSkill: 'SQL & Database Queries',
      availability: 'Wednesday Afternoons',
    },
    {
      name: 'Public Speaking & Presentation Mastery',
      category: 'Communication',
      level: 'Expert',
      description: 'Overcoming stage fright, voice modulation, confident body language, and impromptu speeches.',
      offeredBy: david._id,
      wantedSkill: 'Technical Resume Building',
      availability: 'Saturday Mornings',
    },
    // Sarah
    {
      name: 'Conversational Spanish (A1 - B2)',
      category: 'Languages',
      level: 'Expert',
      description: 'Learn real everyday Spanish, natural idioms, pronunciation, and practical grammar through conversation.',
      offeredBy: sarah._id,
      wantedSkill: 'Web Development Basics',
      availability: 'Monday & Thursday Evenings',
    },
    {
      name: 'Professional English for Tech Interviews',
      category: 'Communication',
      level: 'Advanced',
      description: 'Sharpen your technical storytelling, STAR method behavioral answers, and accent clarity.',
      offeredBy: sarah._id,
      wantedSkill: 'Python for Beginners',
      availability: 'Tuesday & Friday Mornings',
    },
    // Liam
    {
      name: '3D Modeling & Rendering in Blender',
      category: 'Design',
      level: 'Intermediate',
      description: 'Hard-surface modeling, basic UV unwrapping, procedural shading, and cycles lighting setup.',
      offeredBy: liam._id,
      wantedSkill: 'React.js Component Architecture',
      availability: 'Weekends',
    },
    {
      name: 'Acoustic Guitar Fundamentals',
      category: 'Music',
      level: 'Intermediate',
      description: 'Fingerpicking techniques, chord progressions, strumming patterns, and playing popular songs.',
      offeredBy: liam._id,
      wantedSkill: 'Video Editing Basics',
      availability: 'Sunday Evenings',
    },
    // Ananya
    {
      name: 'Python for Data Analysis & Pandas',
      category: 'Programming',
      level: 'Advanced',
      description: 'Data wrangling with Pandas, NumPy vectorization, exploratory data analysis, and Matplotlib.',
      offeredBy: ananya._id,
      wantedSkill: 'React.js Web Development',
      availability: 'Weekdays 6-9 PM',
    },
    {
      name: 'Machine Learning with Scikit-Learn',
      category: 'Programming',
      level: 'Advanced',
      description: 'Supervised & unsupervised learning, regression, classification, random forests, and model tuning.',
      offeredBy: ananya._id,
      wantedSkill: 'Figma UI/UX Design System',
      availability: 'Saturday Afternoons',
    },
    {
      name: 'Linear Algebra & Calculus for ML',
      category: 'Academics',
      level: 'Expert',
      description: 'Eigenvalues, vector spaces, gradient descent intuition, and multivariate derivatives explained clearly.',
      offeredBy: ananya._id,
      wantedSkill: 'Acoustic Guitar Fundamentals',
      availability: 'Friday Afternoons',
    },
    {
      name: 'Technical Writing & Resume Building',
      category: 'Communication',
      level: 'Intermediate',
      description: 'Crafting ATS-friendly tech resumes, impactful bullet points, and clear documentation.',
      offeredBy: alex._id,
      wantedSkill: 'Public Speaking',
      availability: 'Weekends',
    },
  ];

  const createdSkills = await Skill.insertMany(rawSkills);

  // Link offered skills to respective users
  for (const skill of createdSkills) {
    await User.findByIdAndUpdate(skill.offeredBy, {
      $push: { offeredSkills: skill._id },
    });
  }

  console.log('🚀 Creating 6 student projects...');
  const now = new Date();
  const rawProjects = [
    {
      title: 'CampusPulse – Student Event Hub',
      description: 'A real-time student events platform where clubs can post hackathons, sports meets, and workshops with instant RSVP and ticket passes.',
      category: 'Technical',
      owner: alex._id,
      requiredSkills: ['React', 'Node.js', 'Figma', 'MongoDB'],
      members: [alex._id, riya._id],
      maxMembers: 4,
      deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      status: 'Open',
    },
    {
      title: 'EcoTrack – Campus Sustainability App',
      description: 'Gamified mobile & web app rewarding students for recycling, carpooling, and reducing energy footprint across university dorms.',
      category: 'Hackathon',
      owner: riya._id,
      requiredSkills: ['UI/UX', 'Python', 'Tailwind', 'Data Analysis'],
      members: [riya._id, ananya._id],
      maxMembers: 4,
      deadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
    },
    {
      title: 'AI Lecture Notes Summarizer',
      description: 'Researching multi-modal LLM pipelines to convert recorded university lectures and slides into structured study guides and flashcards.',
      category: 'Research',
      owner: ananya._id,
      requiredSkills: ['Python', 'NLP', 'FastAPI', 'React'],
      members: [ananya._id, marcus._id],
      maxMembers: 3,
      deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      status: 'Open',
    },
    {
      title: 'Autonomous TechFest Rover',
      description: 'Building an obstacle-avoiding autonomous rover with LiDAR, computer vision, and ROS2 for the upcoming inter-college robotics competition.',
      category: 'Technical',
      owner: priya._id,
      requiredSkills: ['Arduino', 'C++', 'CAD', 'Computer Vision'],
      members: [priya._id, liam._id],
      maxMembers: 5,
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      status: 'In Progress',
    },
    {
      title: 'Student Venture Pitch Incubator',
      description: 'Developing financial forecasts, competitive analysis, and an investor-ready deck for student-founded SaaS and hardware startups.',
      category: 'Academic',
      owner: david._id,
      requiredSkills: ['Pitch Decks', 'Market Research', 'Graphic Design'],
      members: [david._id],
      maxMembers: 3,
      deadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      status: 'Open',
    },
    {
      title: 'LinguaBridge – Peer Language Tandem',
      description: 'Connecting international students with domestic students for scheduled peer conversational sessions and cultural exchange.',
      category: 'Social',
      owner: sarah._id,
      requiredSkills: ['React', 'Node.js', 'Translation', 'UI Design'],
      members: [sarah._id, alex._id],
      maxMembers: 4,
      deadline: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
      status: 'Open',
    },
  ];

  const createdProjects = await Project.insertMany(rawProjects);

  console.log('🤝 Creating 10 skill exchange & project requests...');
  const rawRequests = [
    // 1. Pending skill exchange: Riya -> Alex
    {
      sender: riya._id,
      receiver: alex._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[0]._id, // React
      offeredSkill: 'Figma UI/UX Design System',
      wantedSkill: 'React.js & Component Architecture',
      message: 'Hey Alex! I saw your React listing. I can help you build clean Figma UI components in return for learning React hooks!',
      status: 'pending',
    },
    // 2. Pending skill exchange: David -> Marcus
    {
      sender: david._id,
      receiver: marcus._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[4]._id, // DSA
      offeredSkill: 'Startup Pitch Deck & Business Modeling',
      wantedSkill: 'Data Structures & Algorithms in C++',
      message: 'Hi Marcus, would love to prepare for technical interview DSA with your guidance! Can teach business valuation in return.',
      status: 'pending',
    },
    // 3. Accepted skill exchange: Alex -> Ananya
    {
      sender: alex._id,
      receiver: ananya._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[16]._id, // Python
      offeredSkill: 'Node.js & Express REST APIs',
      wantedSkill: 'Python for Data Analysis & Pandas',
      message: 'Hey Ananya, let us pair program this weekend! I will teach backend REST APIs and you teach me Pandas dataframes.',
      status: 'accepted',
    },
    // 4. Completed skill exchange: Sarah -> Alex
    {
      sender: sarah._id,
      receiver: alex._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[0]._id,
      offeredSkill: 'Conversational Spanish',
      wantedSkill: 'React.js & Component Architecture',
      message: 'Completed 4 great tandem sessions! Exchanged Spanish grammar for basic React routing.',
      status: 'completed',
    },
    // 5. Rejected skill exchange: Liam -> Priya
    {
      sender: liam._id,
      receiver: priya._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[7]._id,
      offeredSkill: 'Acoustic Guitar Fundamentals',
      wantedSkill: 'Arduino & Microcontroller Prototyping',
      message: 'Hey Priya, would you be interested in learning acoustic guitar in exchange for Arduino tips?',
      status: 'rejected',
    },
    // 6. Pending project join: Marcus -> CampusPulse
    {
      sender: marcus._id,
      receiver: alex._id,
      requestType: 'project-join',
      projectId: createdProjects[0]._id,
      message: 'Hey Alex, I would love to contribute algorithmic search and database optimization to CampusPulse!',
      status: 'pending',
    },
    // 7. Pending project join: Liam -> EcoTrack
    {
      sender: liam._id,
      receiver: riya._id,
      requestType: 'project-join',
      projectId: createdProjects[1]._id,
      message: 'Hi Riya! I can model the 3D smart bin designs and UI graphics for EcoTrack.',
      status: 'pending',
    },
    // 8. Accepted project join: Alex -> LinguaBridge
    {
      sender: alex._id,
      receiver: sarah._id,
      requestType: 'project-join',
      projectId: createdProjects[5]._id,
      message: 'Hey Sarah, happy to help build the real-time chat and matchmaking backend for LinguaBridge!',
      status: 'accepted',
    },
    // 9. Cancelled request: David -> Sarah
    {
      sender: david._id,
      receiver: sarah._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[12]._id,
      offeredSkill: 'Public Speaking',
      wantedSkill: 'Conversational Spanish',
      message: 'Hey Sarah, hoping to learn conversational Spanish before summer internship.',
      status: 'cancelled',
    },
    // 10. Completed exchange: Priya -> Marcus
    {
      sender: priya._id,
      receiver: marcus._id,
      requestType: 'skill-exchange',
      skillId: createdSkills[4]._id,
      offeredSkill: 'Digital Logic & Circuit Simulation',
      wantedSkill: 'Data Structures & Algorithms in C++',
      message: 'Completed our peer study group on binary trees and digital logic gates!',
      status: 'completed',
    },
  ];

  const createdRequests = await Request.insertMany(rawRequests);

  console.log('🔔 Creating 5 demo notifications...');
  const rawNotifications = [
    {
      user: alex._id,
      title: 'New Skill Exchange Request',
      message: 'Riya Sharma sent you a request: "Hey Alex! I saw your React listing. I can help you build clean Figma UI..."',
      type: 'skill-exchange',
      relatedRequest: createdRequests[0]._id,
      isRead: false,
    },
    {
      user: alex._id,
      title: 'Project Join Request 🚀',
      message: 'Marcus Chen requested to join "CampusPulse – Student Event Hub"',
      type: 'project-join',
      relatedRequest: createdRequests[5]._id,
      isRead: false,
    },
    {
      user: alex._id,
      title: 'Exchange Completed! 🌟',
      message: 'Sarah Johnson marked your exchange as completed! Your completed counter increased.',
      type: 'status-update',
      relatedRequest: createdRequests[3]._id,
      isRead: true,
    },
    {
      user: riya._id,
      title: 'Project Join Request 🚀',
      message: 'Liam Wilson requested to join "EcoTrack – Campus Sustainability App"',
      type: 'project-join',
      relatedRequest: createdRequests[6]._id,
      isRead: false,
    },
    {
      user: marcus._id,
      title: 'New Skill Exchange Request',
      message: 'David Kim sent you a request for Data Structures & Algorithms in C++',
      type: 'skill-exchange',
      relatedRequest: createdRequests[1]._id,
      isRead: false,
    },
  ];

  await Notification.insertMany(rawNotifications);

  console.log('=============================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('👥 Inserted 8 demo students:');
  console.log('   - Alex Rivera: alex@flexi.com (Pass: Demo123)');
  console.log('   - Riya Sharma: riya@flexi.com (Pass: Demo123)');
  console.log('   - Marcus Chen: marcus@flexi.com (Pass: Demo123)');
  console.log('   - Priya Patel: priya@flexi.com (Pass: Demo123)');
  console.log('   - David Kim: david@flexi.com (Pass: Demo123)');
  console.log('   - Sarah Johnson: sarah@flexi.com (Pass: Demo123)');
  console.log('   - Liam Wilson: liam@flexi.com (Pass: Demo123)');
  console.log('   - Ananya Gupta: ananya@flexi.com (Pass: Demo123)');
  console.log('⚡ Inserted 20 diverse skills across all categories');
  console.log('🚀 Inserted 6 student projects');
  console.log('🤝 Inserted 10 exchange and project join requests');
  console.log('🔔 Inserted 5 notifications');
  console.log('=============================================');

  if (disconnect) {
    await mongoose.disconnect();
    process.exit(0);
  }
};

if (require.main === module) {
  seedData(true).catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedData };

