
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
  const notes = `# ${subject} - ${topic}
## ${level} Level (${difficulty} Difficulty)

## Introduction
Welcome to this comprehensive lesson on **${topic}** in ${subject}. This AI-generated content is specifically tailored for ${level} students studying at ${difficulty.toLowerCase()} difficulty level. Understanding ${topic} is essential for your academic success and forms a crucial foundation for more advanced concepts.

## Key Concepts

### Understanding ${topic}
${topic} is a fundamental concept in ${subject} that you need to master for your ${level} examinations. This topic connects to many other areas of ${subject} and has practical applications in real-world scenarios.

**Core Principles:**
- **Foundation**: The basic principles that underpin ${topic} and why they matter
- **Application**: How ${topic} is used in practical situations and problem-solving
- **Connection**: How ${topic} relates to other concepts in ${subject}
- **Importance**: Why mastering ${topic} is crucial for exam success

### Deep Dive
Let's explore ${topic} in greater detail. At ${difficulty.toLowerCase()} difficulty, you need to understand not just the basic concepts, but also how to apply them effectively.

#### Essential Terms
- **Key Term 1**: A critical concept that forms the foundation of ${topic}
- **Key Term 2**: An important principle that builds on the foundation
- **Key Term 3**: Advanced terminology essential for ${level} success
- **Key Term 4**: Practical application concept for real-world problems

### Practical Application
Understanding theory is important, but ${level} examinations require you to demonstrate practical application. Here's how ${topic} is used:

1. **Problem-Solving**: Apply ${topic} principles to solve complex problems
2. **Analysis**: Break down questions and identify key elements
3. **Evaluation**: Assess different approaches and choose the most effective method

### Exam Techniques
For ${level} success in ${subject}, you must:
- Clearly explain ${topic} concepts using appropriate terminology
- Demonstrate understanding through worked examples
- Apply knowledge to unfamiliar situations
- Show critical thinking and analytical skills

## Practice Approach
To master ${topic}, follow this study plan:
- Review these notes daily for 10-15 minutes
- Create your own examples and practice problems
- Test yourself regularly to identify weak areas
- Connect ${topic} to other concepts you've learned

## Summary
This lesson has introduced the essential aspects of ${topic} in ${subject} at ${level} level. The key to success is consistent practice and active engagement with the material. Make sure you understand each concept before moving forward.

## Next Steps
Once you've thoroughly reviewed these notes, you can generate additional study materials including flashcards for spaced repetition and interactive quizzes to test your understanding. Focus on mastering the core concepts first before moving to practice questions.`;

  return notes;
};

export const generateMockFlashcards = (subject: Subject, topic: string, count: number) => {
  const flashcards = [];
  for (let i = 1; i <= count; i++) {
    flashcards.push({
      id: `flashcard-${i}-${Date.now()}`,
      question: `What is key concept ${i} in ${topic}?`,
      answer: `This is the answer to concept ${i} in ${topic}. It explains the fundamental principle and demonstrates how it applies to ${subject}. Understanding this concept is crucial for exam success and builds the foundation for more advanced topics.`,
      mastered: false,
      lastReviewed: undefined,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }
  return flashcards;
};

export const generateMockExamQuestions = (subject: Subject, topic: string, difficulty: Difficulty, count: number) => {
  const questions = [];
  for (let i = 1; i <= count; i++) {
    const isMultipleChoice = i % 2 === 0;
    questions.push({
      id: `question-${i}-${Date.now()}`,
      question: `${difficulty} question ${i}: Explain the main principle of ${topic} in ${subject} and how it applies to real-world scenarios.`,
      type: isMultipleChoice ? 'multiple-choice' : 'short-answer',
      options: isMultipleChoice ? [
        `Option A: First possible answer about ${topic}`,
        `Option B: Correct answer explaining ${topic} principles`,
        `Option C: Third possible answer about ${topic}`,
        `Option D: Fourth possible answer about ${topic}`,
      ] : undefined,
      correctAnswer: isMultipleChoice ? `Option B: Correct answer explaining ${topic} principles` : `A detailed explanation of ${topic} demonstrating understanding of key concepts and their application.`,
      explanation: `This question tests your understanding of ${topic} in ${subject}. The correct answer demonstrates knowledge of the key principles, their application, and critical thinking. ${difficulty === 'Hard' ? 'At this difficulty level, you need to show deep analysis and synthesis of concepts.' : ''}`,
      hint: `Think about the core principles of ${topic} and how they relate to ${subject}. Consider real-world examples.`,
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
