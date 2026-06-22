export interface Project {
  id: number;
  title: string;
  role: string;
  software: string[];
  youtubeId?: string;
  videoUrl: string;
  thumbnail: string;
  impact: string;
  tools: string[];
  duration: string;
  date: string;
}

// Helper to extract YouTube ID from various URL formats
export const getYouTubeResourceId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "Goku Ultra Instinct Edit",
    role: "Editor, Motion Designer",
    software: ["Filmora"],
    youtubeId: "9AmT6c-bReg",
    videoUrl: "https://www.youtube.com/watch?v=9AmT6c-bReg",
    thumbnail: "https://img.youtube.com/vi/9AmT6c-bReg/maxresdefault.jpg",
    impact: "High-energy speed ramping and beat-sync choreography.",
    tools: ["Filmora"],
    duration: "0:30",
    date: "JULY 2024"
  },
  {
    id: 2,
    title: "Zenitsu Editz",
    role: "Video Editor",
    software: ["Filmora"],
    videoUrl: "https://www.youtube.com/watch?v=9g0FIIOaJPM",
    thumbnail: "https://images.unsplash.com/photo-1578632738980-420af542dd3e?auto=format&fit=crop&q=80&w=800",
    impact: "Short description of the impact of this edit.",
    tools: ["Filmora"],
    duration: "0:33",
    date: "Aug 2024"
  },
  {
    id: 3,
    title: "Upcoming",
    role: "Editor",
    software: ["Filmora"],
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://images.unsplash.com/photo-1580234811497-9bd7fd0f56ef?auto=format&fit=crop&q=80&w=800",
    impact: "Visual effects and smooth transitions showcase.",
    tools: ["Filmora"],
    duration: "0:00",
    date: "2024"
  }
];
