import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='flex h-screen'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${isCollapsed ? 'ml-20' : 'ml-64'} w-full bg-slate-50 min-h-screen p-8 overflow-y-auto transition-all duration-300`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
