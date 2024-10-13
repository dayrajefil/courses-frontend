// src/App.tsx
import React from 'react';
import CourseList from './CoursesList';
import Header from './Header';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <CourseList />
      </div>
      <Footer />
    </div>
  );
};

export default App;
