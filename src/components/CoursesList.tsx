import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Alert, useToast, HStack } from '@chakra-ui/react';

interface Course {
  id: number;
  title: string;
  description: string;
  total_size_in_mb: number;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      setError('Erro ao buscar cursos');
    }
  };

  useEffect(() => {
    fetchCourses();

    if (location.state?.successMessage) {
      toast({
        title: location.state.successMessage,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setSuccessMessage(location.state.successMessage);

      const timeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [location.state, toast, navigate, location.pathname]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='content'>
      {successMessage && (
        <Alert status='success' color='green'>
          {successMessage}
        </Alert>
      )}

      <h1>Cursos</h1>
      <div className='button-container'>
        <Link to={`/courses/new`}>
          <Button>Criar Curso</Button>
        </Link>
      </div><br />

      <div>
        {courses.map(course => (
          <div key={course.id} className="hover-effect" style={{ padding: '10px' }}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Tamanho dos vídeos: {course.total_size_in_mb} MB</p>

            <HStack spacing={4} className='button-container'>
              <Link to={`/courses/${course.id}/edit`}>
                <Button>Editar</Button>
              </Link>
              <Link to={`/courses/${course.id}`}>
                <Button colorScheme='teal'>Assistir</Button>
              </Link>
            </HStack>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
