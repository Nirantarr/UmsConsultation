import React from 'react';
import ModuleDetailPage from '../../components/ModuleDetailPage';
import { MessagesSquare, Send, Megaphone, Briefcase, BellRing, Phone } from 'lucide-react';

const CommunicationPage = () => {
  const pageData = {
    title: 'Integrated Communication',
    description: 'Foster a vibrant and connected learning community. Our suite of communication tools is woven directly into the LMS, making collaboration and information sharing seamless and intuitive.',
    image: '/assets/5.jpg',
    inActionImage: '/assets/communication.png',
    features: [
      {
        title: 'Course-Specific Discussion Forums',
        description: 'Create threaded discussion forums for each course where students can ask questions, debate topics, and collaborate on projects, extending learning beyond the lecture.',
        icon: <MessagesSquare className="w-6 h-6" />
      },
      {
        title: 'Direct & Group Messaging',
        description: 'Enable secure, one-on-one and small group messaging. Students can easily contact instructors, and faculty can communicate with their classes without relying on external apps.',
        icon: <Send className="w-6 h-6" />
      },
      {
        title: 'Campus-Wide Announcements',
        description: 'Broadcast important information to the entire institution, specific departments, or custom user groups. Announcements appear on the dashboard and can trigger email notifications.',
        icon: <Megaphone className="w-6 h-6" />
      },
      {
        title: 'Collaborative Workspaces',
        description: 'Provide dedicated virtual spaces for group projects where students can share files, manage tasks, and communicate in a private environment, all within the LMS.',
        icon: <Briefcase className="w-6 h-6" />
      },
      {
        title: 'Email & Push Notifications',
        description: 'Keep everyone in the loop. The system automatically sends notifications for key events like new grades, upcoming deadlines, and direct messages, configurable by each user.',
        icon: <BellRing className="w-6 h-6" />
      },
      {
        title: 'Virtual Office Hours',
        description: 'Faculty can easily schedule and host virtual office hours using the integrated video conferencing tool, providing students with accessible, one-on-one support.',
        icon: <Phone className="w-6 h-6" />
      }
    ]
  };

  return <ModuleDetailPage {...pageData} />;
};

export default CommunicationPage;