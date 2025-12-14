
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLesson } from '@/contexts/LessonContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Subject, Level } from '@/types/lesson';
import { subjectTopics } from '@/utils/mockData';

const levels: Level[] = ['GCSE', 'A-Level'];

interface TaskItem {
  id: string;
  type: 'lesson' | 'flashcards' | 'notes' | 'quiz' | 'practice' | 'review';
  title: string;
  description: string;
  subject: Subject;
  subSubject?: string;
  level: Level;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  points: number;
}

// Generate content-based tasks for different subjects and sub-subjects
const generateContentBasedTasks = (subject: Subject, level: Level, subSubject?: string): TaskItem[] => {
  // BTEC Sport sub-subject specific tasks
  if (subject === 'BTEC Sport' && subSubject) {
    const btecSportTasks: Record<string, TaskItem[]> = {
      'Anatomy & Physiology': [
        {
          id: 'btec-sport-anatomy-1',
          type: 'practice',
          title: 'Identify Major Muscle Groups',
          description: 'Learn the location and function of major muscles used in sports performance',
          subject: 'BTEC Sport',
          subSubject: 'Anatomy & Physiology',
          level,
          completed: false,
          priority: 'high',
          points: 60,
        },
        {
          id: 'btec-sport-anatomy-2',
          type: 'practice',
          title: 'Understand Energy Systems',
          description: 'Study aerobic, anaerobic, and ATP-PC energy systems in different sports',
          subject: 'BTEC Sport',
          subSubject: 'Anatomy & Physiology',
          level,
          completed: false,
          priority: 'high',
          points: 65,
        },
        {
          id: 'btec-sport-anatomy-3',
          type: 'review',
          title: 'Analyze Cardiovascular Responses',
          description: 'Examine how the heart and blood vessels respond to exercise',
          subject: 'BTEC Sport',
          subSubject: 'Anatomy & Physiology',
          level,
          completed: false,
          priority: 'medium',
          points: 55,
        },
        {
          id: 'btec-sport-anatomy-4',
          type: 'practice',
          title: 'Study Respiratory System in Exercise',
          description: 'Understand breathing mechanics and gas exchange during physical activity',
          subject: 'BTEC Sport',
          subSubject: 'Anatomy & Physiology',
          level,
          completed: false,
          priority: 'high',
          points: 60,
        },
      ],
      'Fitness Testing': [
        {
          id: 'btec-sport-fitness-1',
          type: 'practice',
          title: 'Conduct VO2 Max Testing',
          description: 'Learn protocols for measuring maximum oxygen uptake',
          subject: 'BTEC Sport',
          subSubject: 'Fitness Testing',
          level,
          completed: false,
          priority: 'high',
          points: 55,
        },
        {
          id: 'btec-sport-fitness-2',
          type: 'practice',
          title: 'Perform Flexibility Assessments',
          description: 'Practice sit-and-reach and other flexibility testing methods',
          subject: 'BTEC Sport',
          subSubject: 'Fitness Testing',
          level,
          completed: false,
          priority: 'medium',
          points: 50,
        },
        {
          id: 'btec-sport-fitness-3',
          type: 'review',
          title: 'Analyze Test Results',
          description: 'Interpret fitness test data and provide recommendations',
          subject: 'BTEC Sport',
          subSubject: 'Fitness Testing',
          level,
          completed: false,
          priority: 'high',
          points: 60,
        },
      ],
      'Training Methods': [
        {
          id: 'btec-sport-training-1',
          type: 'practice',
          title: 'Design Interval Training Programs',
          description: 'Create effective interval training sessions for different sports',
          subject: 'BTEC Sport',
          subSubject: 'Training Methods',
          level,
          completed: false,
          priority: 'high',
          points: 65,
        },
        {
          id: 'btec-sport-training-2',
          type: 'practice',
          title: 'Apply Plyometric Exercises',
          description: 'Learn explosive power training techniques',
          subject: 'BTEC Sport',
          subSubject: 'Training Methods',
          level,
          completed: false,
          priority: 'medium',
          points: 55,
        },
        {
          id: 'btec-sport-training-3',
          type: 'review',
          title: 'Understand Periodization',
          description: 'Study training cycles and progressive overload principles',
          subject: 'BTEC Sport',
          subSubject: 'Training Methods',
          level,
          completed: false,
          priority: 'high',
          points: 60,
        },
      ],
      'Sports Psychology': [
        {
          id: 'btec-sport-psych-1',
          type: 'practice',
          title: 'Apply Motivation Theories',
          description: 'Understand intrinsic and extrinsic motivation in sports',
          subject: 'BTEC Sport',
          subSubject: 'Sports Psychology',
          level,
          completed: false,
          priority: 'high',
          points: 55,
        },
        {
          id: 'btec-sport-psych-2',
          type: 'review',
          title: 'Study Anxiety Management',
          description: 'Learn techniques to manage pre-competition anxiety',
          subject: 'BTEC Sport',
          subSubject: 'Sports Psychology',
          level,
          completed: false,
          priority: 'medium',
          points: 50,
        },
        {
          id: 'btec-sport-psych-3',
          type: 'practice',
          title: 'Develop Mental Imagery Skills',
          description: 'Practice visualization techniques for performance enhancement',
          subject: 'BTEC Sport',
          subSubject: 'Sports Psychology',
          level,
          completed: false,
          priority: 'high',
          points: 60,
        },
      ],
      'Sports Nutrition': [
        {
          id: 'btec-sport-nutrition-1',
          type: 'practice',
          title: 'Plan Pre-Competition Meals',
          description: 'Design optimal nutrition strategies before events',
          subject: 'BTEC Sport',
          subSubject: 'Sports Nutrition',
          level,
          completed: false,
          priority: 'high',
          points: 55,
        },
        {
          id: 'btec-sport-nutrition-2',
          type: 'review',
          title: 'Understand Macronutrients',
          description: 'Study the role of carbs, proteins, and fats in performance',
          subject: 'BTEC Sport',
          subSubject: 'Sports Nutrition',
          level,
          completed: false,
          priority: 'medium',
          points: 50,
        },
        {
          id: 'btec-sport-nutrition-3',
          type: 'practice',
          title: 'Analyze Hydration Strategies',
          description: 'Learn optimal fluid intake before, during, and after exercise',
          subject: 'BTEC Sport',
          subSubject: 'Sports Nutrition',
          level,
          completed: false,
          priority: 'high',
          points: 60,
        },
      ],
    };

    return btecSportTasks[subSubject] || [];
  }

  // Regular subject tasks (existing code)
  const taskMap: Record<string, TaskItem[]> = {
    'English Language': [
      {
        id: 'eng-lang-1',
        type: 'practice',
        title: 'Identify Similes and Metaphors',
        description: 'Practice identifying and analyzing similes and metaphors in text passages',
        subject: 'English Language',
        level,
        completed: false,
        priority: 'high',
        points: 50,
      },
      {
        id: 'eng-lang-2',
        type: 'practice',
        title: 'Analyze Persuasive Language Techniques',
        description: 'Study rhetorical devices, emotive language, and persuasive writing techniques',
        subject: 'English Language',
        level,
        completed: false,
        priority: 'medium',
        points: 40,
      },
      {
        id: 'eng-lang-3',
        type: 'review',
        title: 'Master Sentence Structure',
        description: 'Review simple, compound, and complex sentences with subordinate clauses',
        subject: 'English Language',
        level,
        completed: false,
        priority: 'high',
        points: 45,
      },
    ],
    'English Literature': [
      {
        id: 'eng-lit-1',
        type: 'practice',
        title: 'Analyze Poetic Devices',
        description: 'Identify and explain alliteration, assonance, personification, and imagery in poetry',
        subject: 'English Literature',
        level,
        completed: false,
        priority: 'high',
        points: 55,
      },
      {
        id: 'eng-lit-2',
        type: 'review',
        title: 'Study Character Development',
        description: 'Analyze how characters develop throughout literary texts and their motivations',
        subject: 'English Literature',
        level,
        completed: false,
        priority: 'medium',
        points: 45,
      },
      {
        id: 'eng-lit-3',
        type: 'practice',
        title: 'Explore Themes and Symbolism',
        description: 'Identify recurring themes and symbolic elements in literature',
        subject: 'English Literature',
        level,
        completed: false,
        priority: 'high',
        points: 50,
      },
    ],
    'Mathematics': [
      {
        id: 'math-1',
        type: 'practice',
        title: 'Solve Quadratic Equations',
        description: 'Practice factorizing, completing the square, and using the quadratic formula',
        subject: 'Mathematics',
        level,
        completed: false,
        priority: 'high',
        points: 60,
      },
      {
        id: 'math-2',
        type: 'practice',
        title: 'Work with Trigonometric Ratios',
        description: 'Apply sine, cosine, and tangent to solve problems with right-angled triangles',
        subject: 'Mathematics',
        level,
        completed: false,
        priority: 'medium',
        points: 50,
      },
      {
        id: 'math-3',
        type: 'review',
        title: 'Master Algebraic Manipulation',
        description: 'Practice expanding brackets, factorizing expressions, and simplifying fractions',
        subject: 'Mathematics',
        level,
        completed: false,
        priority: 'high',
        points: 55,
      },
    ],
    'Physics': [
      {
        id: 'physics-1',
        type: 'practice',
        title: 'Apply Newton\'s Laws of Motion',
        description: 'Calculate forces, acceleration, and momentum using F=ma and related equations',
        subject: 'Physics',
        level,
        completed: false,
        priority: 'high',
        points: 60,
      },
      {
        id: 'physics-2',
        type: 'practice',
        title: 'Analyze Electrical Circuits',
        description: 'Calculate current, voltage, and resistance in series and parallel circuits',
        subject: 'Physics',
        level,
        completed: false,
        priority: 'medium',
        points: 50,
      },
      {
        id: 'physics-3',
        type: 'review',
        title: 'Study Energy Transfers',
        description: 'Understand kinetic, potential, and thermal energy with conservation principles',
        subject: 'Physics',
        level,
        completed: false,
        priority: 'high',
        points: 55,
      },
    ],
    'Chemistry': [
      {
        id: 'chem-1',
        type: 'practice',
        title: 'Balance Chemical Equations',
        description: 'Practice balancing equations and understanding stoichiometry',
        subject: 'Chemistry',
        level,
        completed: false,
        priority: 'high',
        points: 50,
      },
      {
        id: 'chem-2',
        type: 'review',
        title: 'Master the Periodic Table',
        description: 'Study element groups, periods, and trends in atomic properties',
        subject: 'Chemistry',
        level,
        completed: false,
        priority: 'medium',
        points: 45,
      },
      {
        id: 'chem-3',
        type: 'practice',
        title: 'Understand Ionic and Covalent Bonding',
        description: 'Analyze electron transfer and sharing in chemical bonds',
        subject: 'Chemistry',
        level,
        completed: false,
        priority: 'high',
        points: 55,
      },
    ],
    'Biology': [
      {
        id: 'bio-1',
        type: 'practice',
        title: 'Study Cell Structure and Function',
        description: 'Identify organelles and explain their roles in cellular processes',
        subject: 'Biology',
        level,
        completed: false,
        priority: 'high',
        points: 50,
      },
      {
        id: 'bio-2',
        type: 'review',
        title: 'Understand Photosynthesis and Respiration',
        description: 'Compare and contrast these key metabolic processes',
        subject: 'Biology',
        level,
        completed: false,
        priority: 'medium',
        points: 45,
      },
      {
        id: 'bio-3',
        type: 'practice',
        title: 'Analyze Genetic Inheritance',
        description: 'Work with Punnett squares and understand dominant/recessive alleles',
        subject: 'Biology',
        level,
        completed: false,
        priority: 'high',
        points: 55,
      },
    ],
    'Physical Education': [
      {
        id: 'pe-1',
        type: 'practice',
        title: 'Identify Muscle Groups and Functions',
        description: 'Study major muscles, their locations, and roles in movement',
        subject: 'Physical Education',
        level,
        completed: false,
        priority: 'high',
        points: 50,
      },
      {
        id: 'pe-2',
        type: 'review',
        title: 'Understand Joint Types and Movements',
        description: 'Learn about hinge, ball-and-socket joints and movements like flexion/extension',
        subject: 'Physical Education',
        level,
        completed: false,
        priority: 'medium',
        points: 45,
      },
      {
        id: 'pe-3',
        type: 'practice',
        title: 'Analyze Energy Systems in Sport',
        description: 'Study aerobic, anaerobic, and ATP-PC systems in different sports',
        subject: 'Physical Education',
        level,
        completed: false,
        priority: 'high',
        points: 55,
      },
    ],
  };

  // Return tasks for the subject, or generate generic content-based tasks
  if (taskMap[subject]) {
    return taskMap[subject];
  }

  // Generic content-based tasks for subjects not specifically mapped
  return [
    {
      id: `${subject}-1`,
      type: 'practice',
      title: `Practice Core ${subject} Concepts`,
      description: `Work through key concepts and principles within ${subject}`,
      subject,
      level,
      completed: false,
      priority: 'high',
      points: 50,
    },
    {
      id: `${subject}-2`,
      type: 'review',
      title: `Review ${subject} Terminology`,
      description: `Master essential terms and definitions in ${subject}`,
      subject,
      level,
      completed: false,
      priority: 'medium',
      points: 40,
    },
    {
      id: `${subject}-3`,
      type: 'practice',
      title: `Apply ${subject} Knowledge`,
      description: `Practice applying ${subject} concepts to real-world scenarios`,
      subject,
      level,
      completed: false,
      priority: 'high',
      points: 55,
    },
  ];
};

export default function TasksScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { lessons } = useLesson();
  const [selectedLevel, setSelectedLevel] = useState<Level>('GCSE');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedSubSubject, setSelectedSubSubject] = useState<string | null>(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showSubSubjectDropdown, setShowSubSubjectDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Get sub-subjects for selected subject
  const currentSubjectData = subjectTopics.find(item => item.subject === selectedSubject);
  const hasSubSubjects = currentSubjectData?.subSubjects && currentSubjectData.subSubjects.length > 0;

  // Generate tasks based on selected level, subject, and sub-subject
  useEffect(() => {
    const allTasks: TaskItem[] = [];
    
    if (selectedSubject) {
      if (hasSubSubjects && selectedSubSubject) {
        // Generate tasks for specific sub-subject
        allTasks.push(...generateContentBasedTasks(selectedSubject, selectedLevel, selectedSubSubject));
      } else if (!hasSubSubjects) {
        // Generate tasks for subject without sub-subjects
        allTasks.push(...generateContentBasedTasks(selectedSubject, selectedLevel));
      }
    } else {
      // Generate tasks for all subjects at the selected level
      const subjects = getSubjectsForLevel(selectedLevel);
      subjects.slice(0, 5).forEach(subject => {
        allTasks.push(...generateContentBasedTasks(subject, selectedLevel).slice(0, 2));
      });
    }
    
    setTasks(allTasks);
  }, [selectedLevel, selectedSubject, selectedSubSubject]);

  if (!isAuthenticated) {
    return (
      <View style={[commonStyles.container, commonStyles.centerContent]}>
        <IconSymbol
          ios_icon_name="checklist"
          android_material_icon_name="task"
          size={80}
          color={colors.textSecondary}
        />
        <Text style={[commonStyles.subtitle, styles.notAuthTitle]}>
          Sign In Required
        </Text>
        <Text style={[commonStyles.textSecondary, styles.notAuthText]}>
          Sign in to track your tasks and progress
        </Text>
      </View>
    );
  }

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getSubjectsForLevel = (level: Level): Subject[] => {
    return subjectTopics.map(st => st.subject);
  };

  const filteredTasks = tasks.filter(task => {
    const levelMatch = task.level === selectedLevel;
    const subjectMatch = selectedSubject ? task.subject === selectedSubject : true;
    const subSubjectMatch = selectedSubSubject ? task.subSubject === selectedSubSubject : true;
    return levelMatch && subjectMatch && subSubjectMatch;
  });

  const completedTasksCount = filteredTasks.filter(t => t.completed).length;
  const totalTasksCount = filteredTasks.length;
  const remainingTasksCount = totalTasksCount - completedTasksCount;

  const renderSubjectDropdown = () => (
    <Modal
      visible={showSubjectDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSubjectDropdown(false)}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowSubjectDropdown(false)}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Select Subject</Text>
            <TouchableOpacity onPress={() => setShowSubjectDropdown(false)}>
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedSubject === null && styles.dropdownItemSelected,
              ]}
              onPress={() => {
                setSelectedSubject(null);
                setSelectedSubSubject(null);
                setShowSubjectDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedSubject === null && styles.dropdownItemTextSelected,
                ]}
              >
                All Subjects
              </Text>
              {selectedSubject === null && (
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={20}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

            {getSubjectsForLevel(selectedLevel).map((subject, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedSubject === subject && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedSubject(subject);
                    setSelectedSubSubject(null);
                    setShowSubjectDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedSubject === subject && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {subject}
                  </Text>
                  {selectedSubject === subject && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderSubSubjectDropdown = () => (
    <Modal
      visible={showSubSubjectDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSubSubjectDropdown(false)}
    >
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowSubSubjectDropdown(false)}
      >
        <View style={styles.dropdownContainer}>
          <View style={styles.dropdownHeader}>
            <Text style={styles.dropdownTitle}>Select Sub-Subject</Text>
            <TouchableOpacity onPress={() => setShowSubSubjectDropdown(false)}>
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.dropdownItem,
                selectedSubSubject === null && styles.dropdownItemSelected,
              ]}
              onPress={() => {
                setSelectedSubSubject(null);
                setShowSubSubjectDropdown(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedSubSubject === null && styles.dropdownItemTextSelected,
                ]}
              >
                All Sub-Subjects
              </Text>
              {selectedSubSubject === null && (
                <IconSymbol
                  ios_icon_name="checkmark"
                  android_material_icon_name="check"
                  size={20}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>

            {currentSubjectData?.subSubjects?.map((subSubject, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedSubSubject === subSubject && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedSubSubject(subSubject);
                    setShowSubSubjectDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedSubSubject === subSubject && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {subSubject}
                  </Text>
                  {selectedSubSubject === subSubject && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Task Planner</Text>
            <Text style={commonStyles.textSecondary}>
              Content-based study tasks
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <IconSymbol
              ios_icon_name="flame.fill"
              android_material_icon_name="local-fire-department"
              size={20}
              color={colors.accent}
            />
            <Text style={styles.streakText}>{user?.streak || 0} days</Text>
          </View>
        </View>

        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'daily' && styles.viewModeButtonActive,
            ]}
            onPress={() => setViewMode('daily')}
          >
            <Text
              style={[
                styles.viewModeText,
                viewMode === 'daily' && styles.viewModeTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewModeButton,
              viewMode === 'weekly' && styles.viewModeButtonActive,
            ]}
            onPress={() => setViewMode('weekly')}
          >
            <Text
              style={[
                styles.viewModeText,
                viewMode === 'weekly' && styles.viewModeTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Level</Text>
          <View style={styles.levelFilters}>
            {levels.map((level, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.levelChip,
                    selectedLevel === level && styles.levelChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedLevel(level);
                    setSelectedSubject(null);
                    setSelectedSubSubject(null);
                  }}
                >
                  <Text
                    style={[
                      styles.levelChipText,
                      selectedLevel === level && styles.levelChipTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Subject</Text>
          <TouchableOpacity
            style={styles.subjectDropdownButton}
            onPress={() => setShowSubjectDropdown(true)}
          >
            <Text style={styles.subjectDropdownButtonText}>
              {selectedSubject || 'All Subjects'}
            </Text>
            <IconSymbol
              ios_icon_name="chevron.down"
              android_material_icon_name="expand-more"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {hasSubSubjects && selectedSubject && (
          <View style={styles.filtersSection}>
            <Text style={styles.filterLabel}>Sub-Subject</Text>
            <TouchableOpacity
              style={styles.subjectDropdownButton}
              onPress={() => setShowSubSubjectDropdown(true)}
            >
              <Text style={styles.subjectDropdownButtonText}>
                {selectedSubSubject || 'All Sub-Subjects'}
              </Text>
              <IconSymbol
                ios_icon_name="chevron.down"
                android_material_icon_name="expand-more"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalTasksCount}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {completedTasksCount}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {remainingTasksCount}
            </Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <Text style={commonStyles.subtitle}>
            {viewMode === 'daily' ? "Today's Tasks" : "This Week's Tasks"}
          </Text>
          
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="checkmark.circle"
                android_material_icon_name="check-circle"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyStateTitle}>No Tasks Found</Text>
              <Text style={styles.emptyStateText}>
                {hasSubSubjects && selectedSubject && !selectedSubSubject
                  ? `Please select a sub-subject for ${selectedSubject}`
                  : `No tasks for ${selectedSubject || 'any subject'} at ${selectedLevel} level`}
              </Text>
            </View>
          ) : (
            <View style={styles.tasksList}>
              {filteredTasks.map((task, index) => (
                <React.Fragment key={index}>
                  <View style={styles.taskCard}>
                    <TouchableOpacity
                      style={[
                        styles.taskCheckbox,
                        task.completed && styles.taskCheckboxCompleted,
                      ]}
                      onPress={() => toggleTaskCompletion(task.id)}
                    >
                      {task.completed && (
                        <IconSymbol
                          ios_icon_name="checkmark"
                          android_material_icon_name="check"
                          size={16}
                          color="#FFFFFF"
                        />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.taskContent}>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && styles.taskTitleCompleted,
                        ]}
                      >
                        {task.title}
                      </Text>
                      <Text style={styles.taskDescription} numberOfLines={2}>
                        {task.description}
                      </Text>
                      <View style={styles.taskMeta}>
                        <View style={styles.taskBadge}>
                          <Text style={styles.taskBadgeText}>{task.subject}</Text>
                        </View>
                        {task.subSubject && (
                          <View style={[styles.taskBadge, { backgroundColor: colors.highlight + '30' }]}>
                            <Text style={styles.taskBadgeText}>{task.subSubject}</Text>
                          </View>
                        )}
                        <View style={styles.taskBadge}>
                          <Text style={styles.taskBadgeText}>{task.level}</Text>
                        </View>
                        <View style={styles.taskPoints}>
                          <IconSymbol
                            ios_icon_name="star.fill"
                            android_material_icon_name="star"
                            size={12}
                            color={colors.highlight}
                          />
                          <Text style={styles.taskPointsText}>{task.points}</Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={[
                        styles.priorityIndicator,
                        task.priority === 'high' && styles.priorityHigh,
                        task.priority === 'medium' && styles.priorityMedium,
                        task.priority === 'low' && styles.priorityLow,
                      ]}
                    />
                  </View>
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        <View style={styles.aiSuggestions}>
          <View style={styles.aiHeader}>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto-awesome"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.aiTitle}>AI Suggestions</Text>
          </View>
          <Text style={styles.aiText}>
            {selectedSubSubject 
              ? `Focus on ${selectedSubSubject} within ${selectedSubject} to strengthen your understanding.`
              : `Focus on practicing ${selectedSubject || 'core concepts'} to strengthen your understanding.`} Complete {remainingTasksCount} more {remainingTasksCount === 1 ? 'task' : 'tasks'} today to maintain your streak!
          </Text>
        </View>
      </ScrollView>

      {renderSubjectDropdown()}
      {renderSubSubjectDropdown()}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 0,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewModeButtonActive: {
    backgroundColor: colors.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  filtersSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  levelFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  levelChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  levelChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  levelChipTextSelected: {
    color: '#FFFFFF',
  },
  subjectDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  subjectDropdownButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  dropdownScroll: {
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  dropdownItemText: {
    fontSize: 15,
    color: colors.text,
  },
  dropdownItemTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 28,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  tasksSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  tasksList: {
    marginTop: 16,
    gap: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCheckboxCompleted: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  taskDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  taskBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  taskPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskPointsText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  priorityHigh: {
    backgroundColor: colors.error,
  },
  priorityMedium: {
    backgroundColor: colors.warning,
  },
  priorityLow: {
    backgroundColor: colors.success,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  aiSuggestions: {
    marginHorizontal: 20,
    backgroundColor: colors.primary + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  notAuthTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    textAlign: 'center',
  },
});
