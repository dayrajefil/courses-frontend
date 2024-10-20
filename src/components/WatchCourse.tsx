import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Button, SimpleGrid, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, HStack } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import VideoPlayer from './VideoPlayer';

const WatchCourse: React.FC = () => {
  const { id } = useParams();
  const courseId = id ? parseInt(id) : undefined;
  const [course, setCourse] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        try {
          const response = await api.get(`/courses/${courseId}`);
          setCourse(response.data);
        } catch (error) {
          console.error('Erro ao carregar dados do curso', error);
        }
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleVideoSelect = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedVideo(null);
  };

  return (
    <Box p={5}>
      {course ? (
        <VStack align="start">
          <Text fontSize="2xl" fontWeight="bold">{course.title}</Text>
          <Text>{course.description}</Text>

          <SimpleGrid columns={1} width="100%">
            {course.videos.map((video: any) => (
              <Box
                key={video.id}
                padding={10}
                className="hover-effect"
                onClick={() => handleVideoSelect(video.url)}
              >
                <Text>{video.filename} - {video.size_in_mb} MB</Text>
              </Box>
            ))}
          </SimpleGrid>

          <HStack spacing={4} justifyContent="flex-end" width="100%"> 
            <Button onClick={() => navigate('/courses')}>Voltar para a listagem</Button>
          </HStack>

          <Modal isOpen={isOpen} onClose={handleClose} size="full">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                {selectedVideo && <VideoPlayer videoUrl={selectedVideo} />}
              </ModalBody>
            </ModalContent>
          </Modal>
        </VStack>
      ) : (
        <Text>Carregando...</Text>
      )}
    </Box>
  );
};

export default WatchCourse;
