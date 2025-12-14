
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
    notes: generateMockNotes(subject, topic, level, difficulty),
    flashcards: generateMockFlashcards(subject, topic, 8),
    examQuestions: generateMockExamQuestions(subject, topic, difficulty, 5),
    quiz: {
      id: `quiz-${lessonId}`,
      questions: generateMockExamQuestions(subject, topic, difficulty, 10),
      timeLimit: difficulty === 'Easy' ? 20 : difficulty === 'Normal' ? 30 : 45,
      completed: false,
    },
    createdAt: new Date(),
    progress: 0,
  };
};

const generateMockNotes = (subject: Subject, topic: string, level: Level, difficulty: Difficulty): string => {
  return `# ${subject} - ${topic}
## ${level} (${difficulty} Difficulty)

## Introduction
Welcome to this comprehensive lesson on **${topic}** in ${subject}. This AI-generated content is tailored for ${level} students at ${difficulty.toLowerCase()} difficulty level.

## Key Concepts

### Understanding ${topic}
${topic} is a fundamental concept in ${subject} that forms the basis for more advanced study. Understanding this topic is essential for success in your ${level} examinations.

**Core Principles:**
- **Principle 1**: The foundational concept that underpins ${topic}
- **Principle 2**: How ${topic} relates to other areas of ${subject}
- **Principle 3**: Practical applications of ${topic} in real-world scenarios

### Deep Dive into ${topic}
Let's explore ${topic} in greater detail. This section will help you develop a thorough understanding of the key ideas and how they interconnect.

#### Important Terms
- **Term 1**: A critical concept you must understand
- **Term 2**: Another essential principle
- **Term 3**: Key terminology for exam success
- **Term 4**: Advanced concept for deeper understanding

### Application and Analysis
Understanding theory is important, but being able to apply your knowledge is crucial for ${level} success. Here's how ${topic} is used in practice:

1. **Practical Application**: How to use ${topic} to solve problems
2. **Critical Analysis**: Evaluating different approaches to ${topic}
3. **Synthesis**: Combining ${topic} with other concepts

### Exam Techniques
For ${level} examinations, you need to demonstrate:
- Clear understanding of ${topic}
- Ability to explain concepts clearly
- Application of knowledge to new situations
- Critical evaluation and analysis

## Practice Questions
1. Define ${topic} and explain its significance in ${subject}
2. How would you apply ${topic} to solve a real-world problem?
3. Compare and contrast ${topic} with related concepts
4. Evaluate the importance of ${topic} in modern ${subject}

## Summary
This lesson has covered the essential aspects of ${topic} in ${subject}. Make sure to:
- Review the key concepts regularly
- Practice with flashcards for spaced repetition
- Complete exam-style questions
- Test yourself with the quiz

## Next Steps
- **Daily Review**: Spend 10-15 minutes reviewing flashcards
- **Practice**: Complete at least 3 exam questions
- **Quiz**: Test your understanding with the full quiz
- **Identify Gaps**: Note areas that need more study

Remember: Consistent practice and active recall are key to mastering ${topic}!`;
};

const generateMockFlashcards = (subject: Subject, topic: string, count: number) => {
  const flashcards = [];
  for (let i = 1; i <= count; i++) {
    flashcards.push({
      id: `flashcard-${i}-${Date.now()}`,
      question: `What is key concept ${i} in ${topic}?`,
      answer: `This is the answer to concept ${i} in ${topic}. It explains the fundamental principle and demonstrates how it applies to ${subject}. Understanding this concept is crucial for exam success and builds the foundation for more advanced topics.`,
      mastered: false,
      lastReviewed: undefined,
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    });
  }
  return flashcards;
};

const generateMockExamQuestions = (subject: Subject, topic: string, difficulty: Difficulty, count: number) => {
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

export const sampleLessons: Lesson[] = [];
