import React from 'react';
import ModuleDetailPage from '../../components/ModuleDetailPage';
import { Video, PenSquare, Users, CircleDot, BarChart2, Plug } from 'lucide-react';

const OnlineClassesPage = () => {
  const pageData = {
    title: 'Online Class & Lecture Hosting',
    description: 'Deliver a classroom experience that transcends physical boundaries. Our integrated platform provides robust, high-definition video conferencing and lecture hosting designed for education.',
    image: '/assets/3.jpg',
    inActionImage: '/assets/class.png',
    features: [
      {
        title: 'HD Virtual Classrooms',
        description: 'Host secure, real-time classes with high-definition video and audio. Our platform is optimized for low-latency streaming to ensure a smooth experience for all participants.',
        icon: <Video className="w-6 h-6" />
      },
      {
        title: 'Interactive Whiteboard',
        description: 'Collaborate visually in real-time. Annotate documents, draw diagrams, and solve problems together on a shared digital canvas, making lessons more dynamic and engaging.',
        icon: <PenSquare className="w-6 h-6" />
      },
      {
        title: 'Breakout Rooms',
        description: 'Facilitate small group discussions and collaborative projects. Easily split students into smaller virtual rooms for focused activities and then bring them back to the main session.',
        icon: <Users className="w-6 h-6" />
      },
      {
        title: 'Session Recording & Playback',
        description: 'Automatically record live sessions and make them available for on-demand viewing. Students can review lectures, catch up on missed classes, and study at their own pace.',
        icon: <CircleDot className="w-6 h-6" />
      },
      {
        title: 'Engagement Analytics',
        description: 'Understand student participation in live sessions. Track attendance, monitor chat activity, and view poll results to gain insights into class engagement levels.',
        icon: <BarChart2 className="w-6 h-6" />
      },
      {
        title: 'Seamless LMS Integration',
        description: 'Schedule, launch, and manage virtual classes directly from the course page. Recordings and attendance data are automatically logged within the LMS for easy access.',
        icon: <Plug className="w-6 h-6" />
      }
    ]
  };

  return <ModuleDetailPage {...pageData} />;
};

export default OnlineClassesPage;