import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
    <video
      controls
      muted
      style={{ width: '80%', maxWidth: '800px', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <source src={videoUrl} type="video/mp4" />
      Seu navegador não suporta a tag de vídeo.
    </video>
  </div>
);
};

export default VideoPlayer;
