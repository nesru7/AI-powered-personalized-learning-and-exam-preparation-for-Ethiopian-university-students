/**
 * prisma/seed.ts
 *
 * Development seed data for demo users, courses, questions, and study history.
 * Run with: npm run db:seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Demo Users ─────────────────────────────────────────────────────────────
  const passwordHash1 = await bcrypt.hash('password123', SALT_ROUNDS);
  const passwordHash2 = await bcrypt.hash('password123', SALT_ROUNDS);
  const adminHash = await bcrypt.hash('admin123', SALT_ROUNDS);

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@aau.edu.et' },
    update: {},
    create: {
      name: 'Abebe Girma',
      email: 'student1@aau.edu.et',
      password: passwordHash1,
      university: 'Addis Ababa University',
      yearOfStudy: 2,
      fieldOfStudy: 'Computer Science',
      role: 'student',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@ju.edu.et' },
    update: {},
    create: {
      name: 'Tigist Haile',
      email: 'student2@ju.edu.et',
      password: passwordHash2,
      university: 'Jimma University',
      yearOfStudy: 3,
      fieldOfStudy: 'Medicine',
      role: 'student',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@platform.et' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@platform.et',
      password: adminHash,
      university: 'Platform',
      role: 'admin',
    },
  });

  // ─── Courses ─────────────────────────────────────────────────────────────────
  // Computer Science – AAU & AASTU
  const csCoursesData = [
    {
      title: 'Data Structures and Algorithms',
      description: 'Fundamental data structures and algorithm analysis for CS students.',
      department: 'Computer Science',
      university: 'Addis Ababa University',
      year: 2,
      chapters: [
        { order: 1, title: 'Arrays and Linked Lists', content: 'Introduction to linear data structures.' },
        { order: 2, title: 'Stacks and Queues', content: 'LIFO and FIFO data structures with applications.' },
        { order: 3, title: 'Trees and Graphs', content: 'Hierarchical and network data structures.' },
        { order: 4, title: 'Sorting and Searching', content: 'Classic sorting algorithms and search strategies.' },
        { order: 5, title: 'Dynamic Programming', content: 'Optimization through memoization and tabulation.' },
      ],
    },
    {
      title: 'Object-Oriented Programming',
      description: 'Principles of OOP using Java: encapsulation, inheritance, and polymorphism.',
      department: 'Computer Science',
      university: 'Addis Ababa University',
      year: 2,
      chapters: [
        { order: 1, title: 'Classes and Objects', content: 'Defining classes and instantiating objects.' },
        { order: 2, title: 'Inheritance', content: 'Extending classes and method overriding.' },
        { order: 3, title: 'Polymorphism', content: 'Runtime and compile-time polymorphism.' },
        { order: 4, title: 'Interfaces and Abstract Classes', content: 'Contracts and partial implementations.' },
      ],
    },
    {
      title: 'Database Management Systems',
      description: 'Relational databases, SQL, normalization and transaction management.',
      department: 'Computer Science',
      university: 'Addis Ababa University',
      year: 3,
      chapters: [
        { order: 1, title: 'Relational Model', content: 'Tables, keys, and relational algebra.' },
        { order: 2, title: 'SQL Fundamentals', content: 'SELECT, INSERT, UPDATE, DELETE.' },
        { order: 3, title: 'Normalization', content: '1NF through BCNF normalization forms.' },
        { order: 4, title: 'Transactions and Concurrency', content: 'ACID properties and isolation levels.' },
      ],
    },
    {
      title: 'Operating Systems',
      description: 'Process management, memory, file systems and I/O.',
      department: 'Computer Science',
      university: 'AASTU',
      year: 3,
      chapters: [
        { order: 1, title: 'Processes and Threads', content: 'Process life cycle and thread management.' },
        { order: 2, title: 'CPU Scheduling', content: 'FCFS, SJF, Round Robin scheduling.' },
        { order: 3, title: 'Memory Management', content: 'Paging, segmentation, and virtual memory.' },
        { order: 4, title: 'File Systems', content: 'FAT, inode-based, and journaling file systems.' },
      ],
    },
    {
      title: 'Computer Networks',
      description: 'TCP/IP stack, routing, network security fundamentals.',
      department: 'Computer Science',
      university: 'AASTU',
      year: 3,
      chapters: [
        { order: 1, title: 'OSI and TCP/IP Models', content: 'Layer architecture and protocols.' },
        { order: 2, title: 'IP Addressing and Subnetting', content: 'IPv4, IPv6 and CIDR notation.' },
        { order: 3, title: 'Routing Protocols', content: 'RIP, OSPF, BGP basics.' },
        { order: 4, title: 'Network Security', content: 'Firewalls, TLS, and common attacks.' },
      ],
    },
    {
      title: 'Software Engineering',
      description: 'SDLC models, requirements engineering, testing and project management.',
      department: 'Computer Science',
      university: 'Addis Ababa University',
      year: 4,
      chapters: [
        { order: 1, title: 'SDLC Models', content: 'Waterfall, Agile, Scrum, Kanban.' },
        { order: 2, title: 'Requirements Engineering', content: 'Elicitation, analysis, and specification.' },
        { order: 3, title: 'Software Testing', content: 'Unit, integration, system and acceptance testing.' },
        { order: 4, title: 'Project Management', content: 'Estimation, scheduling and risk management.' },
      ],
    },
  ];

  // Medicine – Jimma & Hawassa
  const medCoursesData = [
    {
      title: 'Human Anatomy',
      description: 'Gross and microscopic anatomy of the human body.',
      department: 'Medicine',
      university: 'Jimma University',
      year: 1,
      chapters: [
        { order: 1, title: 'Musculoskeletal System', content: 'Bones, joints, and muscles.' },
        { order: 2, title: 'Cardiovascular Anatomy', content: 'Heart and blood vessels.' },
        { order: 3, title: 'Nervous System Anatomy', content: 'Brain, spinal cord, and peripheral nerves.' },
        { order: 4, title: 'Respiratory System', content: 'Lungs, airways, and thorax.' },
      ],
    },
    {
      title: 'Human Physiology',
      description: 'Physiological mechanisms of organ systems.',
      department: 'Medicine',
      university: 'Jimma University',
      year: 2,
      chapters: [
        { order: 1, title: 'Cellular Physiology', content: 'Membrane transport and cell signaling.' },
        { order: 2, title: 'Cardiovascular Physiology', content: 'Cardiac cycle, blood pressure regulation.' },
        { order: 3, title: 'Renal Physiology', content: 'Glomerular filtration and tubular function.' },
        { order: 4, title: 'Neurophysiology', content: 'Action potentials and synaptic transmission.' },
      ],
    },
    {
      title: 'Biochemistry',
      description: 'Metabolism, enzymes and molecular biology.',
      department: 'Medicine',
      university: 'Hawassa University',
      year: 1,
      chapters: [
        { order: 1, title: 'Amino Acids and Proteins', content: 'Structure and function of proteins.' },
        { order: 2, title: 'Carbohydrate Metabolism', content: 'Glycolysis, TCA cycle, glycogen metabolism.' },
        { order: 3, title: 'Lipid Metabolism', content: 'Beta-oxidation and lipid synthesis.' },
        { order: 4, title: 'Molecular Biology', content: 'DNA replication, transcription, translation.' },
      ],
    },
    {
      title: 'Pharmacology',
      description: 'Drug mechanisms, pharmacokinetics and clinical applications.',
      department: 'Medicine',
      university: 'Hawassa University',
      year: 3,
      chapters: [
        { order: 1, title: 'Pharmacokinetics', content: 'ADME: absorption, distribution, metabolism, excretion.' },
        { order: 2, title: 'Autonomic Pharmacology', content: 'Adrenergic and cholinergic agents.' },
        { order: 3, title: 'Cardiovascular Drugs', content: 'Anti-hypertensives, diuretics, anti-arrhythmics.' },
        { order: 4, title: 'Antimicrobials', content: 'Antibiotics, antivirals, antifungals.' },
      ],
    },
  ];

  // Engineering – Bahir Dar
  const engCoursesData = [
    {
      title: 'Fluid Mechanics',
      description: 'Properties of fluids, flow analysis and hydraulic machines.',
      department: 'Engineering',
      university: 'Bahir Dar University',
      year: 2,
      chapters: [
        { order: 1, title: 'Fluid Properties', content: 'Density, viscosity, surface tension.' },
        { order: 2, title: 'Fluid Statics', content: 'Pressure distribution and buoyancy.' },
        { order: 3, title: 'Bernoulli and Continuity', content: 'Conservation of mass and energy in flow.' },
        { order: 4, title: 'Pipe Flow', content: 'Laminar and turbulent flow, Darcy-Weisbach.' },
      ],
    },
    {
      title: 'Thermodynamics',
      description: 'Laws of thermodynamics, heat engines and refrigeration cycles.',
      department: 'Engineering',
      university: 'Bahir Dar University',
      year: 2,
      chapters: [
        { order: 1, title: 'First Law', content: 'Energy conservation, work and heat.' },
        { order: 2, title: 'Second Law', content: 'Entropy and Carnot cycle.' },
        { order: 3, title: 'Power Cycles', content: 'Rankine, Brayton, Otto cycles.' },
        { order: 4, title: 'Refrigeration', content: 'Vapor-compression cycle and coefficient of performance.' },
      ],
    },
    {
      title: 'Circuit Theory',
      description: 'DC and AC circuit analysis, network theorems.',
      department: 'Engineering',
      university: 'Bahir Dar University',
      year: 1,
      chapters: [
        { order: 1, title: "Ohm's and Kirchhoff's Laws", content: 'Basic circuit laws and analysis.' },
        { order: 2, title: 'Network Theorems', content: 'Thevenin, Norton, superposition.' },
        { order: 3, title: 'AC Circuits', content: 'Phasors, impedance, resonance.' },
        { order: 4, title: 'Power in AC Circuits', content: 'Real, reactive, and apparent power.' },
      ],
    },
    {
      title: 'Structural Analysis',
      description: 'Analysis of statically determinate and indeterminate structures.',
      department: 'Engineering',
      university: 'Bahir Dar University',
      year: 3,
      chapters: [
        { order: 1, title: 'Statics Review', content: 'Equilibrium, reactions, and free body diagrams.' },
        { order: 2, title: 'Beams and Frames', content: 'Shear force and bending moment diagrams.' },
        { order: 3, title: 'Trusses', content: 'Method of joints and method of sections.' },
        { order: 4, title: 'Indeterminate Structures', content: 'Force and displacement methods.' },
      ],
    },
  ];

  // Natural Sciences – Mekelle
  const sciCoursesData = [
    {
      title: 'Calculus I',
      description: 'Limits, derivatives, and integration for science and engineering students.',
      department: 'Natural Sciences',
      university: 'Mekelle University',
      year: 1,
      chapters: [
        { order: 1, title: 'Limits and Continuity', content: 'Definition of limits and continuous functions.' },
        { order: 2, title: 'Differentiation', content: 'Rules of differentiation and applications.' },
        { order: 3, title: 'Integration', content: 'Definite and indefinite integrals.' },
        { order: 4, title: 'Applications', content: 'Optimization, related rates, area under curve.' },
      ],
    },
    {
      title: 'Linear Algebra',
      description: 'Vectors, matrices, eigenvalues and linear transformations.',
      department: 'Natural Sciences',
      university: 'Mekelle University',
      year: 1,
      chapters: [
        { order: 1, title: 'Vectors and Matrices', content: 'Vector operations and matrix arithmetic.' },
        { order: 2, title: 'Systems of Linear Equations', content: 'Gaussian elimination and row reduction.' },
        { order: 3, title: 'Determinants', content: 'Cofactor expansion and properties.' },
        { order: 4, title: 'Eigenvalues and Eigenvectors', content: 'Characteristic polynomial and diagonalization.' },
      ],
    },
    {
      title: 'General Chemistry',
      description: 'Atomic structure, chemical bonding, reactions and thermochemistry.',
      department: 'Natural Sciences',
      university: 'Mekelle University',
      year: 1,
      chapters: [
        { order: 1, title: 'Atomic Structure', content: 'Quantum model, electron configuration.' },
        { order: 2, title: 'Chemical Bonding', content: 'Ionic, covalent, and metallic bonds.' },
        { order: 3, title: 'Stoichiometry', content: 'Mole concept and reaction calculations.' },
        { order: 4, title: 'Thermochemistry', content: 'Enthalpy, Hess\'s law, calorimetry.' },
      ],
    },
    {
      title: 'University Physics',
      description: 'Mechanics, waves, electricity and magnetism.',
      department: 'Natural Sciences',
      university: 'Mekelle University',
      year: 1,
      chapters: [
        { order: 1, title: 'Classical Mechanics', content: "Newton's laws, work-energy, momentum." },
        { order: 2, title: 'Oscillations and Waves', content: 'SHM, wave properties, sound.' },
        { order: 3, title: 'Electrostatics', content: "Coulomb's law, electric field, Gauss's law." },
        { order: 4, title: 'Magnetism', content: 'Magnetic force, Faraday induction, Maxwell equations.' },
      ],
    },
    {
      title: 'Calculus II',
      description: 'Sequences, series, multivariable functions and applications of integration.',
      department: 'Natural Sciences',
      university: 'Mekelle University',
      year: 2,
      chapters: [
        { order: 1, title: 'Sequences and Series', content: 'Convergence tests and power series.' },
        { order: 2, title: 'Techniques of Integration', content: 'Substitution, parts, and partial fractions.' },
        { order: 3, title: 'Parametric Curves', content: 'Parametric equations and polar coordinates.' },
        { order: 4, title: 'Multivariable Functions', content: 'Partial derivatives and multiple integrals.' },
      ],
    },
    {
      title: 'Organic Chemistry',
      description: 'Structure, nomenclature, reactions and synthesis of organic compounds.',
      department: 'Natural Sciences',
      university: 'Mekelle University',
      year: 2,
      chapters: [
        { order: 1, title: 'Hydrocarbons', content: 'Alkanes, alkenes, alkynes and aromatic compounds.' },
        { order: 2, title: 'Stereochemistry', content: 'Isomers, chirality and stereochemical notation.' },
        { order: 3, title: 'Reaction Mechanisms', content: 'Substitution, elimination and addition reactions.' },
        { order: 4, title: 'Functional Groups', content: 'Properties and reactions of common functional groups.' },
      ],
    },
  ];

  const allCoursesData = [...csCoursesData, ...medCoursesData, ...engCoursesData, ...sciCoursesData];

  const createdCourses: Array<{ id: string; title: string; department: string }> = [];
  for (const courseData of allCoursesData) {
    const existing = await prisma.course.findFirst({
      where: { title: courseData.title, university: courseData.university },
      select: { id: true },
    });
    const course = existing
      ? await prisma.course.update({ where: { id: existing.id }, data: courseData })
      : await prisma.course.create({ data: courseData });
    createdCourses.push({ id: course.id, title: course.title, department: course.department });
  }

  // ─── Enrollments ─────────────────────────────────────────────────────────────
  const csCourses = createdCourses.filter((c) => c.department === 'Computer Science');
  const medCourses = createdCourses.filter((c) => c.department === 'Medicine');

  if (csCourses.length >= 2) {
    for (const course of csCourses.slice(0, 3)) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: student1.id, courseId: course.id } },
        update: {},
        create: { userId: student1.id, courseId: course.id, progress: Math.random() * 0.6 },
      });
    }
  }

  if (medCourses.length >= 2) {
    for (const course of medCourses.slice(0, 3)) {
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: student2.id, courseId: course.id } },
        update: {},
        create: { userId: student2.id, courseId: course.id, progress: Math.random() * 0.5 },
      });
    }
  }

  // ─── Questions ────────────────────────────────────────────────────────────────
  const sampleQuestions = [
    // Data Structures
    {
      subject: 'Data Structures',
      text: 'What is the time complexity of searching in a balanced Binary Search Tree?',
      options: { A: 'O(1)', B: 'O(log n)', C: 'O(n)', D: 'O(n log n)' },
      correctAnswer: 'B',
      explanation: 'A balanced BST halves the search space at each step, giving O(log n) complexity.',
      difficulty: 'easy',
    },
    {
      subject: 'Data Structures',
      text: 'Which data structure uses LIFO ordering?',
      options: { A: 'Queue', B: 'Stack', C: 'Heap', D: 'Linked List' },
      correctAnswer: 'B',
      explanation: 'A stack follows Last-In-First-Out (LIFO) — the last element pushed is the first popped.',
      difficulty: 'easy',
    },
    {
      subject: 'Data Structures',
      text: "What is the worst-case time complexity of QuickSort?",
      options: { A: 'O(n log n)', B: 'O(n)', C: 'O(n²)', D: 'O(log n)' },
      correctAnswer: 'C',
      explanation: 'QuickSort degrades to O(n²) when the pivot is always the smallest or largest element.',
      difficulty: 'medium',
    },
    // Algorithms
    {
      subject: 'Algorithms',
      text: 'Which algorithm paradigm is used in the Floyd-Warshall algorithm?',
      options: { A: 'Greedy', B: 'Divide and Conquer', C: 'Dynamic Programming', D: 'Backtracking' },
      correctAnswer: 'C',
      explanation: 'Floyd-Warshall uses DP to compute shortest paths between all pairs of vertices.',
      difficulty: 'medium',
    },
    // OOP
    {
      subject: 'OOP',
      text: 'Which OOP principle hides internal state and requires all interaction through methods?',
      options: { A: 'Inheritance', B: 'Polymorphism', C: 'Encapsulation', D: 'Abstraction' },
      correctAnswer: 'C',
      explanation: 'Encapsulation bundles data and methods and restricts direct access to the internal state.',
      difficulty: 'easy',
    },
    {
      subject: 'OOP',
      text: 'What keyword in Java prevents a method from being overridden?',
      options: { A: 'static', B: 'private', C: 'abstract', D: 'final' },
      correctAnswer: 'D',
      explanation: 'The "final" keyword prevents method overriding in subclasses.',
      difficulty: 'easy',
    },
    // DBMS
    {
      subject: 'DBMS',
      text: 'Which normal form eliminates transitive dependencies?',
      options: { A: '1NF', B: '2NF', C: '3NF', D: 'BCNF' },
      correctAnswer: 'C',
      explanation: '3NF requires that no non-prime attribute transitively depends on the primary key.',
      difficulty: 'medium',
    },
    {
      subject: 'DBMS',
      text: 'What does ACID stand for in database transactions?',
      options: {
        A: 'Atomic, Consistent, Isolated, Durable',
        B: 'Accurate, Concurrent, Integrated, Distributed',
        C: 'Abstract, Complete, Independent, Dynamic',
        D: 'Asynchronous, Cached, Indexed, Durable',
      },
      correctAnswer: 'A',
      explanation: 'ACID properties guarantee reliable transaction processing in databases.',
      difficulty: 'easy',
    },
    // Operating Systems
    {
      subject: 'Operating Systems',
      text: 'Which scheduling algorithm can lead to starvation?',
      options: { A: 'Round Robin', B: 'FCFS', C: 'Shortest Job First (preemptive)', D: 'Multilevel Queue' },
      correctAnswer: 'C',
      explanation: 'Preemptive SJF (SRTF) can starve longer processes if shorter ones keep arriving.',
      difficulty: 'medium',
    },
    {
      subject: 'Operating Systems',
      text: 'What is the purpose of a TLB (Translation Lookaside Buffer)?',
      options: {
        A: 'Store recently used disk blocks',
        B: 'Cache virtual-to-physical address translations',
        C: 'Buffer network packets',
        D: 'Store CPU register states',
      },
      correctAnswer: 'B',
      explanation: 'TLB is a fast cache for page table entries to speed up virtual address translation.',
      difficulty: 'hard',
    },
    // Anatomy
    {
      subject: 'Anatomy',
      text: 'Which bone is commonly called the "collar bone"?',
      options: { A: 'Scapula', B: 'Clavicle', C: 'Sternum', D: 'Humerus' },
      correctAnswer: 'B',
      explanation: 'The clavicle, or collar bone, connects the sternum to the scapula.',
      difficulty: 'easy',
    },
    {
      subject: 'Anatomy',
      text: 'The mitral valve is located between which chambers of the heart?',
      options: {
        A: 'Right atrium and right ventricle',
        B: 'Left atrium and left ventricle',
        C: 'Left ventricle and aorta',
        D: 'Right ventricle and pulmonary artery',
      },
      correctAnswer: 'B',
      explanation: 'The mitral (bicuspid) valve lies between the left atrium and left ventricle.',
      difficulty: 'medium',
    },
    // Physiology
    {
      subject: 'Physiology',
      text: 'What is the normal resting heart rate in a healthy adult?',
      options: { A: '40-50 bpm', B: '60-100 bpm', C: '100-120 bpm', D: '120-150 bpm' },
      correctAnswer: 'B',
      explanation: 'Normal resting heart rate for adults is 60-100 beats per minute.',
      difficulty: 'easy',
    },
    // Biochemistry
    {
      subject: 'Biochemistry',
      text: 'Which molecule is the primary energy currency of the cell?',
      options: { A: 'NADH', B: 'FADH2', C: 'ATP', D: 'GTP' },
      correctAnswer: 'C',
      explanation: 'ATP (adenosine triphosphate) is the universal energy currency used in cellular processes.',
      difficulty: 'easy',
    },
    // Pharmacology
    {
      subject: 'Pharmacology',
      text: 'What does the term "half-life" of a drug refer to?',
      options: {
        A: 'Time to reach maximum plasma concentration',
        B: 'Time for plasma concentration to decrease by 50%',
        C: 'Duration of therapeutic effect',
        D: 'Time needed for complete elimination',
      },
      correctAnswer: 'B',
      explanation: 'Drug half-life is the time required for the plasma concentration to fall by 50%.',
      difficulty: 'medium',
    },
    // Calculus
    {
      subject: 'Calculus',
      text: 'What is the derivative of sin(x)?',
      options: { A: '-cos(x)', B: 'cos(x)', C: '-sin(x)', D: 'tan(x)' },
      correctAnswer: 'B',
      explanation: 'd/dx [sin(x)] = cos(x) is a fundamental differentiation rule.',
      difficulty: 'easy',
    },
    {
      subject: 'Calculus',
      text: 'What does the Fundamental Theorem of Calculus state?',
      options: {
        A: 'Every continuous function has an antiderivative',
        B: 'Differentiation and integration are inverse operations',
        C: 'All polynomials are integrable',
        D: 'Limits always exist for continuous functions',
      },
      correctAnswer: 'B',
      explanation: 'The FTC links differentiation and integration as inverse processes.',
      difficulty: 'medium',
    },
    // Linear Algebra
    {
      subject: 'Linear Algebra',
      text: 'A matrix is singular if its determinant is:',
      options: { A: '1', B: '-1', C: '0', D: 'Greater than 1' },
      correctAnswer: 'C',
      explanation: 'A singular matrix has determinant 0 and is not invertible.',
      difficulty: 'easy',
    },
    // Chemistry
    {
      subject: 'Chemistry',
      text: 'What is the atomic number of Carbon?',
      options: { A: '4', B: '6', C: '8', D: '12' },
      correctAnswer: 'B',
      explanation: 'Carbon has atomic number 6 (6 protons) and is the basis of organic chemistry.',
      difficulty: 'easy',
    },
    // Physics
    {
      subject: 'Physics',
      text: 'What is the unit of electric resistance?',
      options: { A: 'Volt', B: 'Ampere', C: 'Ohm', D: 'Watt' },
      correctAnswer: 'C',
      explanation: 'Electrical resistance is measured in Ohms (Ω), named after Georg Simon Ohm.',
      difficulty: 'easy',
    },
    // Thermodynamics
    {
      subject: 'Thermodynamics',
      text: 'Which law states that energy cannot be created or destroyed?',
      options: {
        A: 'Zeroth Law of Thermodynamics',
        B: 'First Law of Thermodynamics',
        C: 'Second Law of Thermodynamics',
        D: 'Third Law of Thermodynamics',
      },
      correctAnswer: 'B',
      explanation: 'The First Law is the law of conservation of energy applied to thermodynamic systems.',
      difficulty: 'easy',
    },
    // Circuit Theory
    {
      subject: 'Circuit Theory',
      text: "Ohm's Law states that V = ?",
      options: { A: 'I + R', B: 'I / R', C: 'I × R', D: 'R / I' },
      correctAnswer: 'C',
      explanation: "Ohm's Law: V = IR, where V is voltage, I is current, and R is resistance.",
      difficulty: 'easy',
    },
    // Structural Analysis
    {
      subject: 'Structural Analysis',
      text: 'In a statically determinate truss, which method is used to find forces in all members simultaneously?',
      options: {
        A: 'Method of Sections',
        B: 'Method of Joints',
        C: 'Virtual Work Method',
        D: 'Stiffness Matrix Method',
      },
      correctAnswer: 'B',
      explanation: 'The method of joints solves for all member forces by applying equilibrium at each joint.',
      difficulty: 'medium',
    },
    // Fluid Mechanics
    {
      subject: 'Fluid Mechanics',
      text: "Bernoulli's equation is derived from which conservation principle?",
      options: { A: 'Conservation of Mass', B: 'Conservation of Momentum', C: 'Conservation of Energy', D: 'Newton\'s Third Law' },
      correctAnswer: 'C',
      explanation: "Bernoulli's equation is an expression of conservation of energy for steady, incompressible flow.",
      difficulty: 'medium',
    },
    // Computer Networks
    {
      subject: 'Computer Networks',
      text: 'Which layer of the OSI model is responsible for routing?',
      options: { A: 'Data Link Layer', B: 'Network Layer', C: 'Transport Layer', D: 'Session Layer' },
      correctAnswer: 'B',
      explanation: 'The Network Layer (Layer 3) handles logical addressing and routing between networks.',
      difficulty: 'easy',
    },
    // Software Engineering
    {
      subject: 'Software Engineering',
      text: 'What is the primary goal of unit testing?',
      options: {
        A: 'Test entire application workflows',
        B: 'Test individual components in isolation',
        C: 'Test database performance',
        D: 'Test user interface elements',
      },
      correctAnswer: 'B',
      explanation: 'Unit testing verifies that individual components work correctly in isolation.',
      difficulty: 'easy',
    },
  ];

  const topicQuestions = [
    { subject: 'Data Structures', prompts: ['Which structure follows last-in, first-out order?', 'What does LIFO mean for a stack?', 'Which structure removes the most recently added item first?', 'Which structure is useful for tracking nested function calls?'], answer: 'Stack', wrong: ['Queue', 'Binary tree', 'Hash table'], explanation: 'A stack follows LIFO: the last item pushed is the first one popped.' },
    { subject: 'Data Structures', prompts: ['Which structure follows first-in, first-out order?', 'What does FIFO describe in a queue?', 'Which structure serves items in arrival order?', 'Which structure is commonly used for breadth-first search?'], answer: 'Queue', wrong: ['Stack', 'Heap', 'Graph'], explanation: 'A queue follows FIFO, processing the earliest item first.' },
    { subject: 'Algorithms', prompts: ['What is the average time complexity of merge sort?', 'Which runtime describes merge sort for n items?', 'How does merge sort scale as input grows?', 'Which asymptotic bound applies to merge sort?'], answer: 'O(n log n)', wrong: ['O(1)', 'O(n)', 'O(n²)'], explanation: 'Merge sort divides the input into halves and merges them in O(n log n) time.' },
    { subject: 'Database Management', prompts: ['Which ACID property makes a transaction all-or-nothing?', 'What does atomicity guarantee in a database transaction?', 'Which ACID rule prevents partial transaction completion?', 'Which property ensures a transaction fully succeeds or is rolled back?'], answer: 'Atomicity', wrong: ['Consistency', 'Isolation', 'Durability'], explanation: 'Atomicity ensures all operations in a transaction happen or none do.' },
    { subject: 'Database Management', prompts: ['What is the main purpose of normalization?', 'Which database practice reduces unnecessary data duplication?', 'How can relational design limit update anomalies?', 'What does normalization improve in a relational database?'], answer: 'Reducing redundancy', wrong: ['Encrypting every row', 'Increasing duplicate values', 'Removing all relationships'], explanation: 'Normalization organizes relations to reduce redundancy and modification anomalies.' },
    { subject: 'Operating Systems', prompts: ['Which scheduling policy assigns each process a fixed time slice?', 'What is the defining feature of round-robin scheduling?', 'Which CPU scheduling algorithm cycles through a ready queue?', 'Which scheduler gives processes turns using a time quantum?'], answer: 'Round robin', wrong: ['First come, first served', 'Shortest job first', 'Priority-only scheduling'], explanation: 'Round robin gives each ready process a bounded time quantum in turn.' },
    { subject: 'Computer Networks', prompts: ['Which OSI layer is responsible for routing packets?', 'At which OSI layer does logical addressing and routing occur?', 'Where does IP routing primarily operate in the OSI model?', 'Which layer forwards packets between different networks?'], answer: 'Network layer', wrong: ['Physical layer', 'Presentation layer', 'Session layer'], explanation: 'The network layer handles logical addressing and routing between networks.' },
    { subject: 'Software Engineering', prompts: ['What is the purpose of a unit test?', 'Which test checks one small component in isolation?', 'At what level does unit testing validate program behavior?', 'Which tests provide focused feedback on individual functions?'], answer: 'Verify an individual unit in isolation', wrong: ['Validate the entire deployed system', 'Measure network throughput', 'Replace acceptance testing'], explanation: 'Unit tests focus on the smallest testable parts of a program.' },
    { subject: 'Human Anatomy', prompts: ['Which chamber pumps oxygenated blood into the aorta?', 'Which heart chamber sends blood into systemic circulation?', 'Where does blood enter the aorta from the heart?', 'Which chamber has the thick wall needed for systemic pumping?'], answer: 'Left ventricle', wrong: ['Right atrium', 'Left atrium', 'Right ventricle'], explanation: 'The left ventricle pumps oxygenated blood through the aorta to the body.' },
    { subject: 'Human Physiology', prompts: ['What is the primary role of hemoglobin?', 'Which molecule in red blood cells carries most oxygen?', 'How is oxygen transported from lungs to tissues?', 'Which blood protein binds oxygen reversibly?'], answer: 'Transport oxygen in the blood', wrong: ['Digest proteins', 'Produce bile', 'Filter urine'], explanation: 'Hemoglobin binds oxygen in red blood cells and carries it to tissues.' },
    { subject: 'Biochemistry', prompts: ['Which molecule is the main immediate energy currency of cells?', 'What molecule directly powers many cellular reactions?', 'Which compound supplies usable energy for cell work?', 'Which nucleotide is commonly called the cell energy currency?'], answer: 'ATP', wrong: ['DNA', 'Urea', 'Glycogen only'], explanation: 'ATP hydrolysis provides energy for many cellular processes.' },
    { subject: 'Pharmacology', prompts: ['What does bioavailability measure?', 'Which term describes the fraction of a dose reaching systemic circulation?', 'What does oral drug bioavailability estimate?', 'Which pharmacokinetic measure accounts for absorbed active drug?'], answer: 'The fraction of administered drug reaching systemic circulation', wrong: ['The drug’s color', 'The time to manufacture a drug', 'The number of tablets in a package'], explanation: 'Bioavailability is the proportion of a dose that reaches systemic circulation unchanged.' },
    { subject: 'Fluid Mechanics', prompts: ['What does the continuity equation express for steady incompressible flow?', 'Which principle links area and velocity in a flow pipe?', 'What remains conserved along a steady incompressible streamtube?', 'Which relation follows from conservation of mass in fluid flow?'], answer: 'Mass conservation', wrong: ['Conservation of electric charge only', 'Conservation of temperature', 'Conservation of viscosity'], explanation: 'The continuity equation applies conservation of mass to fluid flow.' },
    { subject: 'Structural Analysis', prompts: ['What must be true for a structure to be in static equilibrium?', 'Which conditions describe planar force and moment equilibrium?', 'How can a body remain at rest under applied loads?', 'Which sums vanish for a statically balanced planar structure?'], answer: 'Net force and net moment are zero', wrong: ['All members have equal length', 'Every support is fixed', 'The structure has no applied loads'], explanation: 'Static equilibrium requires zero resultant force and zero resultant moment.' },
    { subject: 'Circuit Theory', prompts: ['What is the SI unit of electrical resistance?', 'In which unit is resistance measured?', 'What unit appears in Ohm’s law for resistance?', 'Which unit is named after Georg Simon Ohm?'], answer: 'Ohm', wrong: ['Volt', 'Ampere', 'Watt'], explanation: 'Electrical resistance is measured in ohms (Ω).', },
    { subject: 'Thermodynamics', prompts: ['Which law expresses conservation of energy for thermodynamic systems?', 'Which thermodynamic law relates heat, work, and internal energy?', 'What does the first law of thermodynamics formalize?', 'Which law rules out creating energy from nothing in a process?'], answer: 'First law', wrong: ['Zeroth law', 'Second law', 'Third law'], explanation: 'The first law is conservation of energy applied to thermodynamic systems.' },
    { subject: 'Calculus', prompts: ['What does a derivative represent geometrically?', 'Which calculus operation gives the instantaneous rate of change?', 'What is the slope of a curve at one point called?', 'Which quantity describes a function’s local rate of change?'], answer: 'Instantaneous rate of change', wrong: ['Area under a curve', 'A function’s average value only', 'The number of roots'], explanation: 'A derivative gives the instantaneous rate of change of a function.' },
    { subject: 'Linear Algebra', prompts: ['When is a square matrix invertible?', 'What determinant condition guarantees a matrix inverse?', 'Which determinant value indicates a nonsingular square matrix?', 'What property must hold for a unique matrix inverse to exist?'], answer: 'Its determinant is nonzero', wrong: ['Every entry is positive', 'Its trace is zero', 'It has equal row sums'], explanation: 'A square matrix is invertible exactly when its determinant is nonzero.' },
    { subject: 'General Chemistry', prompts: ['What does the atomic number of an element count?', 'Which particle count defines an element’s atomic number?', 'How are elements distinguished by atomic number?', 'What is the atomic number equal to in a neutral atom?'], answer: 'Number of protons', wrong: ['Number of neutrons only', 'Number of electron shells', 'Total number of isotopes'], explanation: 'Atomic number is the number of protons in the nucleus.' },
    { subject: 'University Physics', prompts: ['What is the SI unit of force?', 'In which unit is force measured in SI?', 'Which unit is equivalent to kg·m/s²?', 'What unit is named after Isaac Newton?'], answer: 'Newton', wrong: ['Joule', 'Pascal', 'Watt'], explanation: 'The newton is the SI unit of force, equal to kg·m/s².' },
  ]
  const generatedQuestions = topicQuestions.flatMap((item) => item.prompts.map((text, index) => ({
    subject: item.subject,
    text,
    options: { A: item.answer, B: item.wrong[0], C: item.wrong[1], D: item.wrong[2] },
    correctAnswer: 'A',
    explanation: item.explanation,
    difficulty: (['easy', 'medium', 'hard', 'medium'] as const)[index],
  })))

  for (const q of [...sampleQuestions, ...generatedQuestions]) {
    const existing = await prisma.question.findFirst({
      where: { subject: q.subject, text: q.text },
      select: { id: true },
    })
    if (existing) {
      await prisma.question.update({ where: { id: existing.id }, data: q })
    } else {
      await prisma.question.create({ data: q })
    }
  }

  const studySamples = [
    { userId: student1.id, subject: 'Data Structures', durationMinutes: 45 },
    { userId: student1.id, subject: 'Database Management', durationMinutes: 30 },
    { userId: student2.id, subject: 'Human Physiology', durationMinutes: 50 },
    { userId: student2.id, subject: 'Biochemistry', durationMinutes: 35 },
    { userId: admin.id, subject: 'Platform review', durationMinutes: 20 },
  ];
  for (const sample of studySamples) {
    const existing = await prisma.studySession.findFirst({
      where: { userId: sample.userId, subject: sample.subject },
      select: { id: true },
    });
    if (!existing) await prisma.studySession.create({ data: sample });
  }
  for (const user of [student1, student2]) {
    const completedExam = await prisma.examSession.findFirst({
      where: { userId: user.id, subject: 'Data Structures', status: 'completed' },
      select: { id: true },
    });
    if (!completedExam) {
      const userQuestionSet = await prisma.question.findMany({ take: 5, select: { id: true } });
      await prisma.examSession.create({
        data: {
          userId: user.id,
          subject: 'Data Structures',
          score: user.id === student1.id ? 80 : 60,
          totalQuestions: userQuestionSet.length,
          answers: { questionIds: userQuestionSet.map(({ id }) => id) },
          status: 'completed',
        },
      });
    }
  }

  console.log(`✅ Seed complete:
  - 3 users created
  - ${allCoursesData.length} courses created
  - ${sampleQuestions.length + generatedQuestions.length} questions available
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
