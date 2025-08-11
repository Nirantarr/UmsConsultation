import React from 'react';
import ModuleDetailPage from '../../components/ModuleDetailPage';
import { ListChecks, ShieldCheck, Database, FileCheck, PieChart, Timer } from 'lucide-react';

const ExamsAssessmentsPage = () => {
  const pageData = {
    title: 'Exams & Assessment Tools',
    description: 'Uphold academic integrity while delivering flexible and insightful evaluations. Our secure assessment suite offers powerful tools for creating, administering, and grading a wide variety of tests and quizzes.',
    image: '/assets/4.jpg',
    inActionImage: '/assets/exam.png',
    features: [
      {
        title: 'Diverse Question Types',
        description: 'Go beyond multiple choice. Build robust exams using over 15 question types, including fill-in-the-blank, matching, ordering, essay, and file upload questions.',
        icon: <ListChecks className="w-6 h-6" />
      },
      {
        title: 'Secure Exam Browser & Proctoring',
        description: 'Ensure academic integrity with features that lock down the student\'s browser during an exam. Integrate with leading online proctoring services for enhanced monitoring.',
        icon: <ShieldCheck className="w-6 h-6" />
      },
      {
        title: 'Question Banks & Randomization',
        description: 'Create large repositories of questions and build exams that pull a random selection for each student, minimizing cheating and ensuring unique test instances.',
        icon: <Database className="w-6 h-6" />
      },
      {
        title: 'Automated & Manual Grading',
        description: 'Save countless hours with auto-graded questions. For essays and subjective assessments, use detailed rubrics and annotation tools for efficient and consistent manual grading.',
        icon: <FileCheck className="w-6 h-6" />
      },
      {
        title: 'Advanced Assessment Analytics',
        description: 'Analyze exam results on a deeper level. Generate reports on question difficulty, student performance statistics, and identify areas where the class may be struggling.',
        icon: <PieChart className="w-6 h-6" />
      },
      {
        title: 'Flexible Timed Assessments',
        description: 'Set time limits, enforce start and end windows, and configure special accommodations for students who require extra time, providing a fair and controlled testing environment.',
        icon: <Timer className="w-6 h-6" />
      }
    ]
  };

  return <ModuleDetailPage {...pageData} />;
};

export default ExamsAssessmentsPage;