// src/components/CourseList.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Erro ao buscar cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='content'>
      <h1>Lista de Cursos</h1>
      <div>
        {courses.map(course => (
          <div key={course.id}>
            <hr />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Início: {course.start_date}</p>
            <p>Término: {course.end_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
