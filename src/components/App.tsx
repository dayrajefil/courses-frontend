// src/components/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CourseList from './CoursesList';
import CourseForm from './CourseForm';
import Header from './Header';
import Footer from './Footer';
import Homepage from './Homepage';
import WatchCourse from './WatchCourse';

const App: React.FC = () => {
  return (
    <Router>
      <div className="wrapper">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/new" element={<CourseForm />} />
            <Route path="/courses/:id/edit" element={<CourseForm />} />
            <Route path="/courses/:id" element={<WatchCourse />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
