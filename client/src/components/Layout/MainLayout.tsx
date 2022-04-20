import React from 'react';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { Sidebar } from './Sidebar';

type MainLayoutProps = {
 children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { width } = useWindowDimensions();

  const leftStyle = {
    maxWidth: width > 1024 ? 'calc(100vw - 288px)' : '100vw'
  };

  return (
    <div className='flex bg-gray-200 dark:bg-gray-700'>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className='grow min-h-screen transition-all duration-300 ease-out lg:ml-72' style={leftStyle}>
        <main className='flex-1 relative overflow-y-auto focus:outline-none mx-auto px-0 lg:px-5 lg:py-2'>
          {children}
        </main>
      </div>
    </div>
  );
};