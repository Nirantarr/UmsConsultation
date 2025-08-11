import React from 'react';
import ModuleDetailPage from '../../components/ModuleDetailPage';
import { TrendingUp, HeartPulse, FileCog, LayoutDashboard, BrainCircuit, AlertTriangle } from 'lucide-react';

const PerformanceAnalyticsPage = () => {
  const pageData = {
    title: 'Performance Analytics',
    description: 'Transform raw data into actionable insights. Our powerful analytics engine provides a 360-degree view of student engagement, course effectiveness, and institutional performance.',
    image: '/assets/6.jpg',
    inActionImage: '/assets/analytics.png',
    features: [
      {
        title: 'Student Progress Tracking',
        description: 'Visualize individual student journeys. Track course completions, assignment grades, and activity levels to identify at-risk students and provide timely intervention.',
        icon: <TrendingUp className="w-6 h-6" />
      },
      {
        title: 'Course Health Reports',
        description: 'Understand what works and what doesn’t. Analyze which resources are most accessed, where students drop off, and how engagement correlates with performance in each course.',
        icon: <HeartPulse className="w-6 h-6" />
      },
      {
        title: 'Custom Report Builder',
        description: 'Ask the questions that matter to you. Create and save custom reports using a wide range of data points and filters, then export them for meetings and accreditation.',
        icon: <FileCog className="w-6 h-6" />
      },
      {
        title: 'Administrator-Level Dashboards',
        description: 'Get a high-level overview of the entire institution. Monitor platform adoption rates, peak usage times, and compare performance across different departments or colleges.',
        icon: <LayoutDashboard className="w-6 h-6" />
      },
      {
        title: 'Predictive Analytics',
        description: 'Leverage historical data to identify patterns. Our system can help forecast student success rates and flag individuals who may need additional support before they fall behind.',
        icon: <BrainCircuit className="w-6 h-d-6" />
      },
      {
        title: 'Automated Alerts & Subscriptions',
        description: 'Stay informed automatically. Set up alerts for specific triggers (e.g., a student failing multiple assignments) and subscribe to regular email digests of key reports.',
        icon: <AlertTriangle className="w-6 h-6" />
      }
    ]
  };

  return <ModuleDetailPage {...pageData} />;
};

export default PerformanceAnalyticsPage;