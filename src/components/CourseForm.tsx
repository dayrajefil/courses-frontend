import React, { useState, useEffect } from 'react';
import { Alert, Box, Button, Input, Textarea, useToast, Text } from '@chakra-ui/react';
import api from '../services/api';
import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Video {
  id: number;
  filename: string;
  size_in_mb: number;
}

type VideoType = Video | File;

const CourseForm: React.FC = () => {
  const { id } = useParams();
  const courseId = id ? parseInt(id) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const response = await api.get(`/courses/${courseId}`);
          const course = response.data;

          setTitle(course.title);
          setDescription(course.description);
          setStartDate(course.start_date);
          setEndDate(course.end_date);
          setVideos(course.videos || []);

        } catch (err) {
          toast({
            title: 'Erro ao carregar dados do curso.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files);
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    
    formData.append('course[title]', title);
    formData.append('course[description]', description);
    formData.append('course[start_date]', startDate);
    formData.append('course[end_date]', endDate);

    videos.forEach((video, index) => {
      if (video instanceof File) {
        formData.append(`course[videos_attributes][${index}][file]`, video);
      } else {
        formData.append(`course[videos_attributes][${index}][id]`, String(video.id));
      }
    });

    try {
      let response;
      if (courseId) {
        response = await api.put(`/courses/${courseId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/courses', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast({
        title: response.data.success,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/', { state: { successMessage: response.data.success } });

    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.data.errors) {
          const apiErrors = err.response.data.errors.reduce(
            (acc: { [key: string]: string[] }, error: { attribute: string; message: string }) => {
              const attr = error.attribute;
              const message = error.message;

              if (!acc[attr]) {
                acc[attr] = [];
              }
              acc[attr].push(message);
              return acc;
            },
            {}
          );

          setErrors(apiErrors);
        }
      } else {
        toast({
          title: 'Erro inesperado. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    try {
      const response = await api.delete(`courses/${courseId}/videos/${videoId}`);
      setVideos(videos.filter(video => !(video instanceof File) && video.id !== videoId));

      setMessage({ text: response.data.success, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage = err.response.data.error;
        setMessage({ text: errorMessage, type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: 'Erro inesperado ao excluir o vídeo.', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };
  
  const handleDeleteCourse = async () => {
    try {
      const response = await api.delete(`/courses/${courseId}`);

      setMessage({ text: response.data.success, type: 'success' });
      setTimeout(() => setMessage(null), 3000);

      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage = err.response.data.error;
        setMessage({ text: errorMessage, type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: 'Erro inesperado ao excluir o curso.', type: 'error' });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };
  

  return (
    <Box as="form" onSubmit={handleSubmit}>
      {message && (
        <Alert status={message.type} color={message.type === 'success' ? 'green' : 'red'}>
          {message.text}
        </Alert>
      )}

      <div>
        Título
        <Input
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        {errors.title && <div color="red">{errors.title[0]}</div>}
      </div>

      <div>
        Descrição
        <Textarea
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        {errors.description && <div color="red">{errors.description[0]}</div>}
      </div>

      <div>
        Início
        <Input
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />
        {errors.start_date && <div color="red">{errors.start_date[0]}</div>}
      </div>

      <div>
        Término
        <Input
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />
        {errors.end_date && <div color="red">{errors.end_date[0]}</div>}
      </div>

      <Input type="file" multiple accept="video/*" onChange={handleVideoChange} />

      <Box>
        <h3>Vídeos:</h3>
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Text>
                {video instanceof File ? video.name : `${video.filename} - ${video.size_in_mb} MB`}
              </Text>
              {!(video instanceof File) && (
                <Button onClick={() => handleDeleteVideo(video.id)}>Excluir</Button>
              )}
            </Box>
          ))
        ) : (
          <Text>Nenhum vídeo associado a este curso.</Text>
        )}
      </Box>

      <Button type="submit">
        {courseId ? 'Atualizar Curso' : 'Criar Curso'}
      </Button>

      <Button onClick={handleDeleteCourse}>
        Excluir Curso
      </Button>

      <Button onClick={() => navigate('/')}>
        Voltar para a listagem
      </Button>
    </Box>
  );
};

export default CourseForm;
