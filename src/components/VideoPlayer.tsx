import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div>
      <video controls style={{ width: '100%' }}>
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta a tag de vídeo.
      </video>
    </div>
  );
};

export default VideoPlayer;
