import React from 'react';
import ModuleDetailPage from '../../components/ModuleDetailPage';
import { LayoutGrid, FileVideo, Library, ClipboardEdit, GitBranchPlus, History } from 'lucide-react';
const CourseManagementPage = () => {
const pageData = {
title: 'Content & Course Management',
description: 'Build and manage world-class digital learning experiences. Our intuitive tools empower educators to create, organize, and deliver rich, engaging course content with unparalleled ease and flexibility.',
image: '/assets/2.jpg',
inActionImage: '/assets/course.png',
features: [
{
title: 'Drag-and-Drop Course Builder',
description: 'Visually structure your entire curriculum. Effortlessly arrange modules, lessons, and activities, creating a logical and intuitive learning path for students.',
icon: <LayoutGrid className="w-6 h-6" />
},
{
title: 'Rich Multimedia Integration',
description: 'Go beyond text. Seamlessly embed interactive videos, upload SCORM/xAPI packages, link to external resources, and host large files to create a dynamic learning environment.',
icon: <FileVideo className="w-6 h-6" />
},
{
title: 'Centralized Content Repository',
description: 'Create a powerful, reusable asset library. Store, tag, and manage all your course materials in one place, and easily share them across different courses and departments.',
icon: <Library className="w-6 h-6" />
},
{
title: 'Advanced Assignment & Grading',
description: 'Design diverse assessments, from simple file submissions to complex group projects. Utilize rubrics for consistent grading and provide rich, inline feedback.',
icon: <ClipboardEdit className="w-6 h-6" />
},
{
title: 'Automated Learning Paths',
description: 'Guide students through their learning journey. Set content release schedules, enforce prerequisites, and create rules that unlock new material based on student performance.',
icon: <GitBranchPlus className="w-6 h-6" />
},
{
title: 'Version Control & History',
description: 'Maintain full control over your content. Track changes, view revision history, and restore previous versions of any course material with a single click, ensuring content integrity.',
icon: <History className="w-6 h-6" />
}
]
};
return <ModuleDetailPage {...pageData} />;
};
export default CourseManagementPage;