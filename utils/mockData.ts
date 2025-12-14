
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
    topics: ['Shakespeare', 'Poetry', 'Modern Prose', 'Drama', 'Literary Analysis', 'Character Study', 'Themes & Motifs']
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
    topics: ['Fitness Training', 'Sports Coaching', 'Sports Psychology', 'Anatomy & Physiology', 'Sports Development']
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
const getTopicSpecificContent = (subject: Subject, topic: string): { concepts: string[], examples: string[], keyTerms: string[] } => {
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
    }
  };

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
  difficulty: Difficulty
): Lesson => {
  const lessonId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: lessonId,
    name,
    title: `${subject} - ${topic}`,
    subject,
    topic,
    level,
    difficulty,
    description: `AI-generated lesson covering ${topic} in ${subject} at ${level} level (${difficulty} difficulty)`,
    notes: '',
    flashcards: [],
    examQuestions: [],
    quiz: undefined,
    createdAt: new Date(),
    progress: 0,
  };
};

export const generateMockNotes = (subject: Subject, topic: string, level: Level, difficulty: Difficulty): string => {
  const content = getTopicSpecificContent(subject, topic);
  
  const notes = `# ${topic} in ${subject}
## ${level} Level (${difficulty} Difficulty)

## Introduction
This lesson focuses on the specific content and concepts within **${topic}** as part of your ${subject} studies. You'll learn the actual material, theories, and practical applications that are essential for your ${level} examinations.

## Core Content

### Key Concepts in ${topic}
Understanding ${topic} requires mastery of several fundamental concepts:

${content.concepts.map((concept, i) => `**${i + 1}. ${concept.charAt(0).toUpperCase() + concept.slice(1)}**
This is a crucial element of ${topic} that you need to understand thoroughly. ${difficulty === 'Hard' ? 'At this advanced level, you should be able to analyze and evaluate this concept critically.' : difficulty === 'Normal' ? 'You should be able to explain and apply this concept in various contexts.' : 'Focus on understanding the basic principles of this concept.'}`).join('\n\n')}

### Practical Examples
Let's explore how these concepts work in practice:

${content.examples.map((example, i) => `**Example ${i + 1}: ${example}**
${difficulty === 'Hard' ? 'Analyze this example critically, considering multiple perspectives and implications.' : difficulty === 'Normal' ? 'Study this example and think about how you could apply similar principles.' : 'This example demonstrates the basic application of the concept.'}`).join('\n\n')}

### Essential Terminology
Master these key terms for ${topic}:

${content.keyTerms.map((term, i) => `- **${term}**: A fundamental term in ${topic} that you must be able to define and use correctly in your ${level} exams.`).join('\n')}

## Application and Analysis
${difficulty === 'Hard' ? `At this advanced level, you need to demonstrate critical thinking and analytical skills. Consider how ${topic} connects to broader themes in ${subject}, evaluate different perspectives, and synthesize information from multiple sources.` : difficulty === 'Normal' ? `Practice applying these concepts to different scenarios. Think about how ${topic} relates to other areas of ${subject} and develop your analytical skills.` : `Focus on understanding the core concepts and being able to explain them clearly. Practice using the terminology correctly and work through basic examples.`}

## Exam Preparation
For ${level} success:
- Understand and memorize key terminology
- Practice explaining concepts in your own words
- Work through examples regularly
- ${difficulty === 'Hard' ? 'Develop critical analysis and evaluation skills' : difficulty === 'Normal' ? 'Apply concepts to new situations' : 'Master the fundamental principles'}

## Summary
This lesson has covered the essential content within ${topic}, including key concepts, practical examples, and important terminology. ${difficulty === 'Hard' ? 'Continue to develop your critical thinking and analytical skills.' : difficulty === 'Normal' ? 'Practice applying these concepts regularly.' : 'Review these fundamentals until you feel confident.'}

## Next Steps
Generate flashcards to memorize key terms and concepts, then test your understanding with the quiz. Focus on the actual content and applications rather than just the topic name.`;

  return notes;
};

export const generateMockFlashcards = (subject: Subject, topic: string, count: number) => {
  const content = getTopicSpecificContent(subject, topic);
  const flashcards = [];
  
  // Generate flashcards based on actual content
  for (let i = 0; i < Math.min(count, content.keyTerms.length); i++) {
    flashcards.push({
      id: `flashcard-${i}-${Date.now()}`,
      question: `Define: ${content.keyTerms[i]}`,
      answer: `${content.keyTerms[i]} is a key term in ${topic}. It refers to ${content.concepts[i % content.concepts.length]}. This concept is essential for understanding ${topic} and appears frequently in ${subject} examinations.`,
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
      answer: `${content.concepts[i]} is a fundamental principle in ${topic}. ${content.examples[i % content.examples.length]} demonstrates this concept in practice. Understanding this is crucial for applying ${topic} knowledge effectively.`,
      mastered: false,
      lastReviewed: undefined,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }
  
  return flashcards;
};

export const generateMockExamQuestions = (subject: Subject, topic: string, difficulty: Difficulty, count: number) => {
  const content = getTopicSpecificContent(subject, topic);
  const questions = [];
  
  for (let i = 1; i <= count; i++) {
    const isMultipleChoice = i % 2 === 0;
    const concept = content.concepts[i % content.concepts.length];
    const example = content.examples[i % content.examples.length];
    
    questions.push({
      id: `question-${i}-${Date.now()}`,
      question: isMultipleChoice 
        ? `Which of the following best describes ${concept} in ${topic}?`
        : `Explain how ${concept} applies in ${topic}. Use ${example} to support your answer.`,
      type: isMultipleChoice ? 'multiple-choice' : 'short-answer',
      options: isMultipleChoice ? [
        `A definition that is partially correct but missing key elements`,
        `The correct comprehensive definition of ${concept} with proper context`,
        `A common misconception about ${concept}`,
        `An unrelated concept from a different area of ${subject}`,
      ] : undefined,
      correctAnswer: isMultipleChoice 
        ? `The correct comprehensive definition of ${concept} with proper context`
        : `A comprehensive answer should explain ${concept}, demonstrate understanding through ${example}, and show how this applies to ${topic}. ${difficulty === 'Hard' ? 'Include critical analysis and evaluation.' : ''}`,
      explanation: `This question tests your understanding of ${concept} within ${topic}. ${difficulty === 'Hard' ? 'At this level, you need to demonstrate critical thinking, analysis, and the ability to synthesize information.' : difficulty === 'Normal' ? 'You should be able to explain the concept and apply it to examples.' : 'Focus on understanding the basic principles and being able to explain them clearly.'}`,
      hint: `Think about ${concept} and how it relates to ${example}. Consider the key terminology: ${content.keyTerms.slice(0, 3).join(', ')}.`,
      marks: difficulty === 'Easy' ? 2 : difficulty === 'Normal' ? 4 : 6,
    });
  }
  return questions;
};

export const generateMockQuiz = (subject: Subject, topic: string, difficulty: Difficulty, lessonId: string) => {
  return {
    id: `quiz-${lessonId}`,
    questions: generateMockExamQuestions(subject, topic, difficulty, 10),
    timeLimit: difficulty === 'Easy' ? 20 : difficulty === 'Normal' ? 30 : 45,
    completed: false,
  };
};

export const sampleLessons: Lesson[] = [];
