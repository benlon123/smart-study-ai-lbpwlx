
import { Lesson, Subject, Level, Difficulty, SubjectTopic } from '@/types/lesson';

export const subjectTopics: SubjectTopic[] = [
  {
    subject: 'Mathematics',
    topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 'Probability', 'Number Theory', 'Vectors']
  },
  {
    subject: 'English Language',
    topics: ['Grammar', 'Creative Writing', 'Comprehension', 'Persuasive Writing', 'Descriptive Writing', 'Language Analysis']
  },
  {
    subject: 'English Literature',
    topics: ['Shakespeare', 'Poetry', 'Modern Prose', 'Drama', 'Literary Analysis', 'Character Study', 'Themes & Motifs'],
    books: [
      'A Christmas Carol',
      'Macbeth',
      'Romeo and Juliet',
      'An Inspector Calls',
      'Animal Farm',
      'Of Mice and Men',
      'Lord of the Flies',
      'The Strange Case of Dr Jekyll and Mr Hyde',
      'Frankenstein',
      'Jane Eyre',
      'Pride and Prejudice',
      'The Great Gatsby',
      'To Kill a Mockingbird',
      '1984',
      'The Handmaid\'s Tale'
    ]
  },
  {
    subject: 'Science',
    topics: ['Scientific Method', 'Lab Skills', 'Data Analysis', 'Experimental Design']
  },
  {
    subject: 'Physics',
    topics: ['Mechanics', 'Electricity', 'Magnetism', 'Waves', 'Thermodynamics', 'Nuclear Physics', 'Quantum Physics']
  },
  {
    subject: 'Chemistry',
    topics: ['Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Organic Chemistry', 'Acids & Bases', 'Redox Reactions']
  },
  {
    subject: 'Biology',
    topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Human Biology', 'Plant Biology', 'Microbiology']
  },
  {
    subject: 'History',
    topics: ['World War I', 'World War II', 'Cold War', 'Medieval History', 'Modern History', 'Social History']
  },
  {
    subject: 'Geography',
    topics: ['Physical Geography', 'Human Geography', 'Climate Change', 'Ecosystems', 'Urban Development', 'Natural Hazards']
  },
  {
    subject: 'Computer Science',
    topics: ['Programming', 'Algorithms', 'Data Structures', 'Networks', 'Databases', 'Cybersecurity', 'AI & Machine Learning']
  },
  {
    subject: 'Business Studies',
    topics: ['Marketing', 'Finance', 'Operations', 'Human Resources', 'Business Strategy', 'Entrepreneurship']
  },
  {
    subject: 'Economics',
    topics: ['Microeconomics', 'Macroeconomics', 'Market Structures', 'International Trade', 'Economic Policy', 'Development Economics']
  },
  {
    subject: 'Psychology',
    topics: ['Cognitive Psychology', 'Social Psychology', 'Developmental Psychology', 'Abnormal Psychology', 'Research Methods']
  },
  {
    subject: 'Sociology',
    topics: ['Social Structures', 'Culture', 'Social Inequality', 'Family', 'Education', 'Crime & Deviance', 'Research Methods']
  },
  {
    subject: 'Art & Design',
    topics: ['Drawing', 'Painting', 'Sculpture', 'Digital Art', 'Art History', 'Design Principles', 'Portfolio Development']
  },
  {
    subject: 'Music',
    topics: ['Music Theory', 'Composition', 'Performance', 'Music History', 'Analysis', 'Listening Skills']
  },
  {
    subject: 'Drama',
    topics: ['Acting Techniques', 'Script Analysis', 'Theatre History', 'Directing', 'Stage Design', 'Performance']
  },
  {
    subject: 'Physical Education',
    topics: ['Anatomy', 'Physiology', 'Sports Psychology', 'Training Methods', 'Health & Fitness', 'Sports Analysis']
  },
  {
    subject: 'Religious Studies',
    topics: ['Christianity', 'Islam', 'Buddhism', 'Hinduism', 'Ethics', 'Philosophy of Religion']
  },
  {
    subject: 'French',
    topics: ['Grammar', 'Vocabulary', 'Conversation', 'Reading Comprehension', 'Writing', 'French Culture']
  },
  {
    subject: 'Spanish',
    topics: ['Grammar', 'Vocabulary', 'Conversation', 'Reading Comprehension', 'Writing', 'Spanish Culture']
  },
  {
    subject: 'German',
    topics: ['Grammar', 'Vocabulary', 'Conversation', 'Reading Comprehension', 'Writing', 'German Culture']
  },
  {
    subject: 'Media Studies',
    topics: ['Media Theory', 'Film Analysis', 'Advertising', 'News Media', 'Digital Media', 'Media Production']
  },
  {
    subject: 'Design & Technology',
    topics: ['Product Design', 'Materials', 'Manufacturing', 'CAD/CAM', 'Sustainability', 'Design Process']
  },
  {
    subject: 'Food Technology',
    topics: ['Nutrition', 'Food Science', 'Cooking Techniques', 'Food Safety', 'Product Development']
  },
  {
    subject: 'BTEC Business',
    topics: ['Business Environment', 'Marketing', 'Finance', 'Human Resources', 'Business Planning']
  },
  {
    subject: 'BTEC Sport',
    topics: ['Fitness Training', 'Sports Coaching', 'Sports Psychology', 'Sports Development', 'Sports Leadership'],
    subSubjects: [
      'Anatomy & Physiology',
      'Fitness Testing',
      'Training Methods',
      'Sports Psychology',
      'Sports Nutrition',
      'Sports Injuries',
      'Sports Coaching',
      'Sports Development',
      'Sports Leadership',
      'Sports Performance Analysis'
    ]
  },
  {
    subject: 'BTEC Health & Social Care',
    topics: ['Health & Wellbeing', 'Communication', 'Safeguarding', 'Anatomy & Physiology', 'Care Values']
  },
  {
    subject: 'BTEC IT',
    topics: ['Programming', 'Web Development', 'Databases', 'Networks', 'Cybersecurity', 'Project Management']
  },
  {
    subject: 'BTEC Engineering',
    topics: ['Engineering Principles', 'Materials', 'CAD', 'Manufacturing', 'Electronics', 'Project Management']
  },
  {
    subject: 'BTEC Applied Science',
    topics: ['Biology', 'Chemistry', 'Physics', 'Lab Techniques', 'Scientific Investigation', 'Data Analysis']
  }
];

// Enhanced content generation with specific context
const getTopicSpecificContent = (subject: Subject, topic: string, book?: string): { concepts: string[], examples: string[], keyTerms: string[] } => {
  const contentMap: Record<string, any> = {
    'English Language-Grammar': {
      concepts: ['sentence structure', 'parts of speech', 'punctuation rules', 'verb tenses', 'subject-verb agreement'],
      examples: ['complex sentences with subordinate clauses', 'proper use of semicolons', 'present perfect continuous tense'],
      keyTerms: ['noun', 'verb', 'adjective', 'adverb', 'conjunction', 'preposition', 'clause', 'phrase']
    },
    'English Literature-Poetry': {
      concepts: ['poetic devices', 'meter and rhythm', 'rhyme schemes', 'imagery', 'symbolism', 'tone and mood'],
      examples: ['iambic pentameter in Shakespeare', 'metaphors in Romantic poetry', 'alliteration in modern verse'],
      keyTerms: ['simile', 'metaphor', 'personification', 'alliteration', 'assonance', 'enjambment', 'caesura', 'stanza']
    },
    'English Literature-A Christmas Carol': {
      concepts: ['social responsibility', 'redemption and transformation', 'poverty and wealth', 'family and compassion', 'time and regret'],
      examples: ['Scrooge\'s transformation from miser to philanthropist', 'the Cratchit family\'s poverty', 'the Ghost of Christmas Past revealing Scrooge\'s lost love'],
      keyTerms: ['redemption', 'allegory', 'social commentary', 'Victorian era', 'symbolism', 'characterization', 'narrative structure']
    },
    'Mathematics-Algebra': {
      concepts: ['solving linear equations', 'factorizing quadratics', 'simultaneous equations', 'algebraic manipulation'],
      examples: ['expanding (x+3)(x-2)', 'solving 2x + 5 = 13', 'factorizing x² + 5x + 6'],
      keyTerms: ['variable', 'coefficient', 'constant', 'expression', 'equation', 'factor', 'expand', 'simplify']
    },
    'Physics-Mechanics': {
      concepts: ['Newton\'s laws of motion', 'forces and acceleration', 'momentum and impulse', 'work and energy'],
      examples: ['calculating force using F=ma', 'conservation of momentum in collisions', 'kinetic energy calculations'],
      keyTerms: ['force', 'mass', 'acceleration', 'velocity', 'momentum', 'energy', 'friction', 'gravity']
    },
    'Biology-Cell Biology': {
      concepts: ['cell structure and function', 'organelles', 'cell membrane transport', 'mitosis and meiosis'],
      examples: ['osmosis in plant cells', 'mitochondria producing ATP', 'DNA replication during cell division'],
      keyTerms: ['nucleus', 'mitochondria', 'chloroplast', 'ribosome', 'cytoplasm', 'membrane', 'organelle', 'diffusion']
    },
    'Chemistry-Atomic Structure': {
      concepts: ['atomic models', 'electron configuration', 'isotopes', 'ions', 'periodic trends'],
      examples: ['electron shells in sodium', 'isotopes of carbon', 'formation of ionic bonds'],
      keyTerms: ['proton', 'neutron', 'electron', 'nucleus', 'shell', 'isotope', 'ion', 'atomic number']
    },
    'Physical Education-Anatomy': {
      concepts: ['skeletal system structure', 'muscle types and functions', 'joint movements', 'cardiovascular system'],
      examples: ['hinge joint in the knee', 'cardiac muscle contraction', 'flexion and extension movements'],
      keyTerms: ['bone', 'muscle', 'joint', 'ligament', 'tendon', 'cartilage', 'flexion', 'extension']
    },
    'BTEC Sport-Anatomy & Physiology': {
      concepts: ['musculoskeletal system in sport', 'energy systems', 'respiratory system during exercise', 'cardiovascular adaptations'],
      examples: ['lactic acid system in sprinting', 'VO2 max improvements', 'muscle hypertrophy from training'],
      keyTerms: ['aerobic', 'anaerobic', 'ATP', 'lactic acid', 'muscle fiber', 'cardiac output', 'stroke volume']
    },
    'BTEC Sport-Fitness Testing': {
      concepts: ['fitness components', 'testing protocols', 'data collection and analysis', 'validity and reliability'],
      examples: ['VO2 max testing', 'sit and reach flexibility test', 'multi-stage fitness test'],
      keyTerms: ['cardiovascular endurance', 'muscular strength', 'flexibility', 'body composition', 'agility', 'power']
    }
  };

  // Check for book-specific content
  if (book) {
    const bookKey = `${subject}-${book}`;
    if (contentMap[bookKey]) {
      return contentMap[bookKey];
    }
  }

  const key = `${subject}-${topic}`;
  if (contentMap[key]) {
    return contentMap[key];
  }

  // Default content for topics not specifically mapped
  return {
    concepts: [`core principles of ${topic}`, `key theories in ${topic}`, `practical applications of ${topic}`],
    examples: [`real-world examples of ${topic}`, `case studies in ${topic}`, `problem-solving with ${topic}`],
    keyTerms: [`fundamental ${topic} terminology`, `advanced ${topic} concepts`, `${topic} definitions`]
  };
};

export const generateMockLesson = (
  name: string,
  subject: Subject,
  topic: string,
  level: Level,
  difficulty: Difficulty,
  book?: string
): Lesson => {
  const lessonId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: lessonId,
    name,
    title: book ? `${subject} - ${book}` : `${subject} - ${topic}`,
    subject,
    topic,
    book,
    level,
    difficulty,
    description: book 
      ? `AI-generated lesson covering ${book} in ${subject} at ${level} level (${difficulty} difficulty)`
      : `AI-generated lesson covering ${topic} in ${subject} at ${level} level (${difficulty} difficulty)`,
    notes: '',
    flashcards: [],
    examQuestions: [],
    quiz: undefined,
    createdAt: new Date(),
    progress: 0,
  };
};

export const generateMockNotes = (subject: Subject, topic: string, level: Level, difficulty: Difficulty, book?: string): string => {
  const content = getTopicSpecificContent(subject, topic, book);
  const titleText = book ? `${book} - ${topic}` : topic;
  
  const notes = `# ${titleText} in ${subject}
## ${level} Level (${difficulty} Difficulty)

## Introduction
This lesson focuses on the specific content and concepts within **${titleText}** as part of your ${subject} studies. You'll learn the actual material, theories, and practical applications that are essential for your ${level} examinations.

## Core Content

### Key Concepts in ${titleText}
Understanding ${titleText} requires mastery of several fundamental concepts:

${content.concepts.map((concept, i) => `**${i + 1}. ${concept.charAt(0).toUpperCase() + concept.slice(1)}**
This is a crucial element of ${titleText} that you need to understand thoroughly. ${difficulty === 'Hard' ? 'At this advanced level, you should be able to analyze and evaluate this concept critically.' : difficulty === 'Normal' ? 'You should be able to explain and apply this concept in various contexts.' : 'Focus on understanding the basic principles of this concept.'}`).join('\n\n')}

### Practical Examples
Let's explore how these concepts work in practice:

${content.examples.map((example, i) => `**Example ${i + 1}: ${example}**
${difficulty === 'Hard' ? 'Analyze this example critically, considering multiple perspectives and implications.' : difficulty === 'Normal' ? 'Study this example and think about how you could apply similar principles.' : 'This example demonstrates the basic application of the concept.'}`).join('\n\n')}

### Essential Terminology
Master these key terms for ${titleText}:

${content.keyTerms.map((term, i) => `- **${term}**: A fundamental term in ${titleText} that you must be able to define and use correctly in your ${level} exams.`).join('\n')}

## Application and Analysis
${difficulty === 'Hard' ? `At this advanced level, you need to demonstrate critical thinking and analytical skills. Consider how ${titleText} connects to broader themes in ${subject}, evaluate different perspectives, and synthesize information from multiple sources.` : difficulty === 'Normal' ? `Practice applying these concepts to different scenarios. Think about how ${titleText} relates to other areas of ${subject} and develop your analytical skills.` : `Focus on understanding the core concepts and being able to explain them clearly. Practice using the terminology correctly and work through basic examples.`}

## Exam Preparation
For ${level} success:
- Understand and memorize key terminology
- Practice explaining concepts in your own words
- Work through examples regularly
- ${difficulty === 'Hard' ? 'Develop critical analysis and evaluation skills' : difficulty === 'Normal' ? 'Apply concepts to new situations' : 'Master the fundamental principles'}

## Summary
This lesson has covered the essential content within ${titleText}, including key concepts, practical examples, and important terminology. ${difficulty === 'Hard' ? 'Continue to develop your critical thinking and analytical skills.' : difficulty === 'Normal' ? 'Practice applying these concepts regularly.' : 'Review these fundamentals until you feel confident.'}

## Next Steps
Generate flashcards to memorize key terms and concepts, then test your understanding with the quiz. Focus on the actual content and applications rather than just the topic name.`;

  return notes;
};

export const generateMockFlashcards = (subject: Subject, topic: string, count: number, book?: string) => {
  const content = getTopicSpecificContent(subject, topic, book);
  const flashcards = [];
  const titleText = book || topic;
  
  // Generate flashcards based on actual content
  for (let i = 0; i < Math.min(count, content.keyTerms.length); i++) {
    flashcards.push({
      id: `flashcard-${i}-${Date.now()}`,
      question: `Define: ${content.keyTerms[i]}`,
      answer: `${content.keyTerms[i]} is a key term in ${titleText}. It refers to ${content.concepts[i % content.concepts.length]}. This concept is essential for understanding ${titleText} and appears frequently in ${subject} examinations.`,
      mastered: false,
      lastReviewed: undefined,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }
  
  // Add concept-based flashcards
  for (let i = 0; i < Math.min(count - flashcards.length, content.concepts.length); i++) {
    flashcards.push({
      id: `flashcard-concept-${i}-${Date.now()}`,
      question: `Explain the concept: ${content.concepts[i]}`,
      answer: `${content.concepts[i]} is a fundamental principle in ${titleText}. ${content.examples[i % content.examples.length]} demonstrates this concept in practice. Understanding this is crucial for applying ${titleText} knowledge effectively.`,
      mastered: false,
      lastReviewed: undefined,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }
  
  return flashcards;
};

export const generateMockExamQuestions = (subject: Subject, topic: string, difficulty: Difficulty, count: number, book?: string) => {
  const content = getTopicSpecificContent(subject, topic, book);
  const questions = [];
  const titleText = book || topic;
  
  for (let i = 1; i <= count; i++) {
    const questionType = i % 3;
    const concept = content.concepts[i % content.concepts.length];
    const example = content.examples[i % content.examples.length];
    
    if (questionType === 0) {
      // Single choice multiple choice
      questions.push({
        id: `question-${i}-${Date.now()}`,
        question: `Which of the following best describes ${concept} in ${titleText}?`,
        type: 'multiple-choice',
        options: [
          `A definition that is partially correct but missing key elements`,
          `The correct comprehensive definition of ${concept} with proper context`,
          `A common misconception about ${concept}`,
          `An unrelated concept from a different area of ${subject}`,
        ],
        correctAnswer: `The correct comprehensive definition of ${concept} with proper context`,
        explanation: `This question tests your understanding of ${concept} within ${titleText}. ${difficulty === 'Hard' ? 'At this level, you need to demonstrate critical thinking, analysis, and the ability to synthesize information.' : difficulty === 'Normal' ? 'You should be able to explain the concept and apply it to examples.' : 'Focus on understanding the basic principles and being able to explain them clearly.'}`,
        hint: `Think about ${concept} and how it relates to ${example}. Consider the key terminology: ${content.keyTerms.slice(0, 3).join(', ')}.`,
        marks: difficulty === 'Easy' ? 2 : difficulty === 'Normal' ? 4 : 6,
      });
    } else if (questionType === 1) {
      // Multi-select question
      const correctOptions = [
        `${content.keyTerms[i % content.keyTerms.length]} is a key component`,
        `${content.concepts[(i + 1) % content.concepts.length]} applies here`,
      ];
      const incorrectOptions = [
        `This is not related to ${titleText}`,
        `This contradicts the principles of ${concept}`,
      ];
      
      questions.push({
        id: `question-${i}-${Date.now()}`,
        question: `Which of the following statements about ${concept} in ${titleText} are correct? (Select all that apply)`,
        type: 'multi-select',
        options: [...correctOptions, ...incorrectOptions].sort(() => Math.random() - 0.5),
        correctAnswer: correctOptions,
        explanation: `This multi-select question tests your comprehensive understanding of ${concept}. Both correct answers highlight important aspects of ${titleText}. ${difficulty === 'Hard' ? 'You need to identify all correct statements to demonstrate mastery.' : 'Understanding multiple facets of the concept is essential.'}`,
        hint: `Consider which statements accurately reflect the principles of ${concept}. Think about ${example}.`,
        marks: difficulty === 'Easy' ? 3 : difficulty === 'Normal' ? 5 : 8,
      });
    } else {
      // Short answer
      questions.push({
        id: `question-${i}-${Date.now()}`,
        question: `Explain how ${concept} applies in ${titleText}. Use ${example} to support your answer.`,
        type: 'short-answer',
        correctAnswer: `A comprehensive answer should explain ${concept}, demonstrate understanding through ${example}, and show how this applies to ${titleText}. ${difficulty === 'Hard' ? 'Include critical analysis and evaluation.' : ''}`,
        explanation: `This question tests your ability to explain and apply ${concept} within ${titleText}. ${difficulty === 'Hard' ? 'At this level, you need to demonstrate critical thinking, analysis, and the ability to synthesize information.' : difficulty === 'Normal' ? 'You should be able to explain the concept and apply it to examples.' : 'Focus on understanding the basic principles and being able to explain them clearly.'}`,
        hint: `Think about ${concept} and how it relates to ${example}. Consider the key terminology: ${content.keyTerms.slice(0, 3).join(', ')}.`,
        marks: difficulty === 'Easy' ? 4 : difficulty === 'Normal' ? 6 : 10,
      });
    }
  }
  return questions;
};

export const generateMockQuiz = (subject: Subject, topic: string, difficulty: Difficulty, lessonId: string, book?: string) => {
  return {
    id: `quiz-${lessonId}`,
    questions: generateMockExamQuestions(subject, topic, difficulty, 10, book),
    timeLimit: difficulty === 'Easy' ? 20 : difficulty === 'Normal' ? 30 : 45,
    completed: false,
  };
};

export const sampleLessons: Lesson[] = [];
