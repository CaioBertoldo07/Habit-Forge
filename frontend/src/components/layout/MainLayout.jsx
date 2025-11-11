import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

const MainLayout = ({ children, title, subtitle }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} subtitle={subtitle} />
        <main className="content-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;