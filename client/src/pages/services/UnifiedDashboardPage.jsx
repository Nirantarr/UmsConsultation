import React from 'react';
import ModuleDetailPage from '../../components/ModuleDetailPage';
// Import the icons you want to use
import { LayoutDashboard, Users, Bell, Calendar, Link2, Palette } from 'lucide-react';

const UnifiedDashboardPage = () => {
  const pageData = {
    title: 'Unified Dashboard',
    description: 'The command center for your entire institution. Our Unified Dashboard provides a personalized, at-a-glance overview of everything that matters, driving efficiency and engagement from the moment users log in.',
    image: '/assets/1.jpg',
    inActionImage: '/assets/dashboard.png', // A different, more detailed image for the "In Action" section
    features: [
      {
        title: 'Role-Based Personalization',
        description: 'The dashboard intelligently adapts to the user. Students see their upcoming assignments, faculty view their courses, and administrators monitor institutional health.',
        icon: <Users className="w-6 h-6" /> // <-- Pass the icon component
      },
      {
        title: 'Customizable Widgets',
        description: 'Empower users to make the dashboard their own by adding, removing, and rearranging widgets for weather, news, quick links, and more.',
        icon: <LayoutDashboard className="w-6 h-6" />
      },
      {
        title: 'Real-Time Notification Hub',
        description: 'Consolidates all alerts—from new grades and forum replies to campus-wide announcements—into a single, easy-to-manage feed.',
        icon: <Bell className="w-6 h-6" />
      },
      {
        title: 'Calendar Integration',
        description: 'A comprehensive calendar aggregates academic deadlines, campus events, personal appointments, and class schedules.',
        icon: <Calendar className="w-6 h-6" />
      },
      {
        title: 'Quick Access Toolbar',
        description: 'Navigate to the most-used features of the LMS with a single click, intelligently populated based on user roles and frequency of use.',
        icon: <Link2 className="w-6 h-6" />
      },
      {
        title: 'Institutional Branding',
        description: 'Fully brand the dashboard with your university’s logo, color scheme, and imagery to create a seamless, professional user experience.',
        icon: <Palette className="w-6 h-6" />
      }
    ]
  };

  return <ModuleDetailPage {...pageData} />;
};

export default UnifiedDashboardPage;