
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
    ],
    quotes: {
      'A Christmas Carol': [
        '"God bless us, every one!" - Tiny Tim',
        '"I will honour Christmas in my heart, and try to keep it all the year." - Scrooge',
        '"No space of regret can make amends for one life\'s opportunity misused!" - Marley\'s Ghost',
        '"Mankind was my business. The common welfare was my business." - Marley\'s Ghost',
        '"I wear the chain I forged in life" - Marley\'s Ghost'
      ],
      'Macbeth': [
        '"Fair is foul, and foul is fair" - The Witches',
        '"Is this a dagger which I see before me?" - Macbeth',
        '"Out, damned spot! Out, I say!" - Lady Macbeth',
        '"Life\'s but a walking shadow" - Macbeth',
        '"Double, double toil and trouble" - The Witches'
      ],
      'Romeo and Juliet': [
        '"What\'s in a name? That which we call a rose by any other name would smell as sweet" - Juliet',
        '"A plague o\' both your houses!" - Mercutio',
        '"For never was a story of more woe than this of Juliet and her Romeo" - Prince',
        '"These violent delights have violent ends" - Friar Lawrence',
        '"O Romeo, Romeo! Wherefore art thou Romeo?" - Juliet'
      ],
      'An Inspector Calls': [
        '"We are members of one body. We are responsible for each other." - Inspector Goole',
        '"If men will not learn that lesson, then they will be taught it in fire and blood and anguish." - Inspector Goole',
        '"Public men, Mr Birling, have responsibilities as well as privileges." - Inspector Goole',
        '"One Eva Smith has gone - but there are millions and millions of Eva Smiths" - Inspector Goole'
      ],
      'Animal Farm': [
        '"All animals are equal, but some animals are more equal than others" - Napoleon',
        '"Four legs good, two legs bad" - The Sheep',
        '"The creatures outside looked from pig to man, and from man to pig" - Narrator',
        '"Man is the only creature that consumes without producing" - Old Major'
      ]
    }
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
    topics: [
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
    ],
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
const getTopicSpecificContent = (subject: Subject, topic: string, book?: string, selectedQuotes?: string[]): { concepts: string[], examples: string[], keyTerms: string[], quotes?: string[] } => {
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
    },
    'BTEC Sport-Training Methods': {
      concepts: ['interval training', 'plyometric exercises', 'periodization', 'progressive overload', 'specificity principle'],
      examples: ['HIIT workouts for endurance', 'box jumps for explosive power', 'macrocycle training plans'],
      keyTerms: ['interval training', 'plyometrics', 'periodization', 'overload', 'specificity', 'adaptation', 'recovery']
    },
    'BTEC Sport-Sports Psychology': {
      concepts: ['motivation theories', 'anxiety management', 'mental imagery', 'goal setting', 'self-confidence'],
      examples: ['intrinsic vs extrinsic motivation', 'visualization techniques', 'SMART goal setting'],
      keyTerms: ['motivation', 'anxiety', 'arousal', 'imagery', 'self-efficacy', 'attribution', 'cohesion']
    },
    'BTEC Sport-Sports Nutrition': {
      concepts: ['macronutrients', 'hydration strategies', 'pre-competition nutrition', 'recovery nutrition', 'supplements'],
      examples: ['carb loading before endurance events', 'protein timing for muscle recovery', 'electrolyte replacement'],
      keyTerms: ['carbohydrates', 'proteins', 'fats', 'hydration', 'glycogen', 'amino acids', 'electrolytes']
    },
    'BTEC Sport-Sports Injuries': {
      concepts: ['injury prevention', 'acute vs chronic injuries', 'RICE protocol', 'rehabilitation', 'injury assessment'],
      examples: ['ACL tear prevention exercises', 'treating ankle sprains', 'return to play protocols'],
      keyTerms: ['acute injury', 'chronic injury', 'RICE', 'rehabilitation', 'prevention', 'assessment', 'recovery']
    },
    'BTEC Sport-Sports Coaching': {
      concepts: ['coaching styles', 'session planning', 'feedback techniques', 'skill development', 'coaching ethics'],
      examples: ['autocratic vs democratic coaching', 'progressive skill drills', 'constructive feedback methods'],
      keyTerms: ['coaching style', 'session plan', 'feedback', 'demonstration', 'progression', 'ethics', 'communication']
    },
    'BTEC Sport-Sports Development': {
      concepts: ['sports participation', 'community programs', 'talent identification', 'sports policy', 'funding'],
      examples: ['grassroots development programs', 'talent pathways', 'Sport England initiatives'],
      keyTerms: ['participation', 'development', 'talent identification', 'policy', 'funding', 'community', 'pathways']
    },
    'BTEC Sport-Sports Leadership': {
      concepts: ['leadership styles', 'team management', 'communication skills', 'decision making', 'motivation'],
      examples: ['transformational leadership in sports', 'conflict resolution', 'team building activities'],
      keyTerms: ['leadership', 'management', 'communication', 'decision making', 'motivation', 'teamwork', 'responsibility']
    },
    'BTEC Sport-Sports Performance Analysis': {
      concepts: ['performance indicators', 'video analysis', 'data collection', 'feedback provision', 'tactical analysis'],
      examples: ['notational analysis in football', 'GPS tracking data', 'performance profiling'],
      keyTerms: ['analysis', 'performance indicators', 'video analysis', 'data', 'feedback', 'tactics', 'profiling']
    }
  };

  // Check for book-specific content
  if (book) {
    const bookKey = `${subject}-${book}`;
    if (contentMap[bookKey]) {
      const content = contentMap[bookKey];
      if (selectedQuotes && selectedQuotes.length > 0) {
        content.quotes = selectedQuotes;
      }
      return content;
    }
  }

  const key = `${subject}-${topic}`;
  if (contentMap[key]) {
    const content = contentMap[key];
    if (selectedQuotes && selectedQuotes.length > 0) {
      content.quotes = selectedQuotes;
    }
    return content;
  }

  // Default content for topics not specifically mapped
  return {
    concepts: [`core principles of ${topic}`, `key theories in ${topic}`, `practical applications of ${topic}`],
    examples: [`real-world examples of ${topic}`, `case studies in ${topic}`, `problem-solving with ${topic}`],
    keyTerms: [`fundamental ${topic} terminology`, `advanced ${topic} concepts`, `${topic} definitions`],
    quotes: selectedQuotes || []
  };
};

export const generateMockLesson = (
  name: string,
  subject: Subject,
  topic: string,
  level: Level,
  difficulty: Difficulty,
  book?: string,
  selectedQuotes?: string[]
): Lesson => {
  const lessonId = `lesson-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: lessonId,
    name,
    title: book ? `${subject} - ${book}` : `${subject} - ${topic}`,
    subject,
    topic,
    book,
    selectedQuotes,
    level,
    difficulty,
    description: book 
      ? `AI-generated lesson covering ${book} in ${subject} at ${level} level (${difficulty} difficulty)${selectedQuotes && selectedQuotes.length > 0 ? ` with ${selectedQuotes.length} selected quotes` : ''}`
      : `AI-generated lesson covering ${topic} in ${subject} at ${level} level (${difficulty} difficulty)`,
    notes: '',
    flashcards: [],
    examQuestions: [],
    quiz: undefined,
    createdAt: new Date(),
    progress: 0,
  };
};

export const generateMockNotes = (subject: Subject, topic: string, level: Level, difficulty: Difficulty, book?: string, selectedQuotes?: string[]): string => {
  const content = getTopicSpecificContent(subject, topic, book, selectedQuotes);
  const titleText = book ? `${book} - ${topic}` : topic;
  
  let notes = `# ${titleText} in ${subject}
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
${difficulty === 'Hard' ? 'Analyze this example critically, considering multiple perspectives and implications.' : difficulty === 'Normal' ? 'Study this example and think about how you could apply similar principles.' : 'This example demonstrates the basic application of the concept.'}`).join('\n\n')}`;

  // Add quotes section if quotes are selected
  if (content.quotes && content.quotes.length > 0) {
    notes += `

### Key Quotes for Analysis
These selected quotes are essential for understanding ${book || titleText}:

${content.quotes.map((quote, i) => `**Quote ${i + 1}:**
${quote}

This quote is significant because it demonstrates key themes and character development. ${difficulty === 'Hard' ? 'Analyze the language techniques, symbolism, and deeper meanings within this quote.' : difficulty === 'Normal' ? 'Consider how this quote relates to the overall themes and plot.' : 'Understand the literal meaning and basic context of this quote.'}`).join('\n\n')}`;
  }

  notes += `

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
${content.quotes && content.quotes.length > 0 ? '- Analyze and memorize key quotes with their context\n- Practice integrating quotes into your written responses' : ''}
- ${difficulty === 'Hard' ? 'Develop critical analysis and evaluation skills' : difficulty === 'Normal' ? 'Apply concepts to new situations' : 'Master the fundamental principles'}

## Summary
This lesson has covered the essential content within ${titleText}, including key concepts, practical examples, and important terminology. ${difficulty === 'Hard' ? 'Continue to develop your critical thinking and analytical skills.' : difficulty === 'Normal' ? 'Practice applying these concepts regularly.' : 'Review these fundamentals until you feel confident.'}

## Next Steps
Generate flashcards to memorize key terms and concepts, then test your understanding with the quiz. Focus on the actual content and applications rather than just the topic name.`;

  return notes;
};

export const generateMockFlashcards = (subject: Subject, topic: string, count: number, book?: string, selectedQuotes?: string[]) => {
  const content = getTopicSpecificContent(subject, topic, book, selectedQuotes);
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
  
  // Add quote-based flashcards if quotes are available
  if (content.quotes && content.quotes.length > 0 && flashcards.length < count) {
    for (let i = 0; i < Math.min(count - flashcards.length, content.quotes.length); i++) {
      flashcards.push({
        id: `flashcard-quote-${i}-${Date.now()}`,
        question: `Analyze this quote from ${book}: "${content.quotes[i]}"`,
        answer: `This quote is significant in ${book} because it reveals key themes and character development. Consider the context, language techniques, and how it relates to the overall narrative. This quote demonstrates ${content.concepts[i % content.concepts.length]}.`,
        mastered: false,
        lastReviewed: undefined,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }
  }
  
  return flashcards;
};

export const generateMockExamQuestions = (subject: Subject, topic: string, difficulty: Difficulty, count: number, book?: string, selectedQuotes?: string[]) => {
  const content = getTopicSpecificContent(subject, topic, book, selectedQuotes);
  const questions = [];
  const titleText = book || topic;
  
  for (let i = 1; i <= count; i++) {
    const concept = content.concepts[i % content.concepts.length];
    const example = content.examples[i % content.examples.length];
    
    // ALL QUESTIONS ARE NOW MULTIPLE CHOICE ONLY
    // Generate 4 options with 1 correct answer
    const correctAnswer = `The correct comprehensive definition of ${concept} with proper context`;
    const incorrectOptions = [
      `A definition that is partially correct but missing key elements`,
      `A common misconception about ${concept}`,
      `An unrelated concept from a different area of ${subject}`,
    ];
    
    // Add quote-based questions if quotes are available
    if (content.quotes && content.quotes.length > 0 && i % 3 === 0) {
      const quote = content.quotes[i % content.quotes.length];
      const quoteCorrectAnswer = `This quote demonstrates ${concept} and reveals important aspects of the narrative through ${example}`;
      const quoteIncorrectOptions = [
        `This quote is primarily about a different theme unrelated to ${concept}`,
        `This quote contradicts the main themes of ${book}`,
        `This quote has no significant meaning in the context of ${book}`,
      ];
      
      questions.push({
        id: `question-${i}-${Date.now()}`,
        question: `Analyze the following quote from ${book}: "${quote}". What does this reveal about the themes and characters?`,
        type: 'multiple-choice',
        options: [quoteCorrectAnswer, ...quoteIncorrectOptions].sort(() => Math.random() - 0.5),
        correctAnswer: quoteCorrectAnswer,
        explanation: `Quote analysis is essential for ${subject}. This quote from ${book} demonstrates ${concept} and reveals important aspects of the narrative. It shows ${example} and connects to the broader themes of the text. ${difficulty === 'Hard' ? 'A detailed analysis should include language techniques, symbolism, and contextual significance.' : 'Consider the literal meaning and its importance to the plot.'}`,
        hint: `Think about the context of this quote, who says it, and what it reveals about ${concept}.`,
        marks: difficulty === 'Easy' ? 5 : difficulty === 'Normal' ? 8 : 12,
      });
      continue;
    }
    
    // Standard multiple choice question
    questions.push({
      id: `question-${i}-${Date.now()}`,
      question: `Which of the following best describes ${concept} in ${titleText}?`,
      type: 'multiple-choice',
      options: [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5),
      correctAnswer: correctAnswer,
      explanation: `This question tests your understanding of ${concept} within ${titleText}. ${difficulty === 'Hard' ? 'At this level, you need to demonstrate critical thinking, analysis, and the ability to synthesize information.' : difficulty === 'Normal' ? 'You should be able to explain the concept and apply it to examples.' : 'Focus on understanding the basic principles and being able to explain them clearly.'} The correct answer provides a comprehensive definition with proper context.`,
      hint: `Think about ${concept} and how it relates to ${example}. Consider the key terminology: ${content.keyTerms.slice(0, 3).join(', ')}.`,
      marks: difficulty === 'Easy' ? 2 : difficulty === 'Normal' ? 4 : 6,
    });
  }
  return questions;
};

export const generateMockQuiz = (subject: Subject, topic: string, difficulty: Difficulty, lessonId: string, book?: string, selectedQuotes?: string[]) => {
  return {
    id: `quiz-${lessonId}`,
    questions: generateMockExamQuestions(subject, topic, difficulty, 10, book, selectedQuotes),
    timeLimit: difficulty === 'Easy' ? 20 : difficulty === 'Normal' ? 30 : 45,
    completed: false,
  };
};

export const sampleLessons: Lesson[] = [];
