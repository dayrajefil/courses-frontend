import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Alert, useToast, Text, Box } from '@chakra-ui/react';

interface Course {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  total_size_in_mb: number;
  videos?: Video[];
}

interface Video {
  id: number;
  size_in_mb: number;
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

      <h1>Lista de Cursos</h1>
      <Link to={`/courses/new`}>
        <Button>Criar Curso</Button>
      </Link>
      <div>
        {courses.map(course => (
          <div key={course.id}>
            <hr />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Início: {course.start_date}</p>
            <p>Término: {course.end_date}</p>
            <p>Tamanho total dos vídeos: {course.total_size_in_mb} MB</p>

            <Box>
              <h3>Vídeos:</h3>
              {course.videos && course.videos.map(video => (
                <Text key={video.id}>
                  Vídeo {video.id}: {video.size_in_mb} MB
                </Text>
              ))}
            </Box>

            <Link to={`/courses/${course.id}/edit`}>
              <Button>Editar</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
