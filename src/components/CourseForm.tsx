import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, useToast } from '@chakra-ui/react';
import api from '../services/api';
import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CourseForm: React.FC = () => {
  const { id } = useParams();
  const courseId = id ? parseInt(id) : undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      course: {
        title,
        description,
        start_date: startDate,
        end_date: endDate,
      },
    };

    try {
      let response;
      if (courseId) {
        response = await api.put(`/courses/${courseId}`, courseData);
      } else {
        response = await api.post('/courses', courseData);
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

  return (
    <Box as="form" onSubmit={handleSubmit}>
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

      <Button type="submit">
        {courseId ? 'Atualizar Curso' : 'Criar Curso'}
      </Button>

      <Button onClick={() => navigate('/')}>
        Voltar para a listagem
      </Button>
    </Box>
  );
};

export default CourseForm;
