import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Play, Clock, Calendar, Heart } from 'lucide-react';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Project } from '../lib/projects';

export function ProjectGrid({ projects, onProjectClick }: { projects: Project[]; onProjectClick: (project: Project) => void }) {
  const [likes, setLikes] = useState<Record<string, number>>({});

  useEffect(() => {
    const path = 'likes';
    const unsubscribe = onSnapshot(collection(db, 'likes'), (snapshot) => {
      const newLikes: Record<string, number> = {};
      snapshot.forEach((d) => {
        const data = d.data();
        newLikes[d.id] = data.likesCount || 0;
      });
      setLikes(newLikes);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {}
    });

    return unsubscribe;
  }, []);

  const handleLike = async (projectId: string) => {
    const path = `likes/${projectId}`;
    try {
      const docRef = doc(db, 'likes', projectId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const currentLikes = snap.data().likesCount || 0;
        await updateDoc(docRef, {
          likesCount: currentLikes + 1
        });
      } else {
        await setDoc(docRef, {
          projectId,
          likesCount: 1
        });
      }
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch (e) {}
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => {
        const projectIdStr = String(project.id);
        const projectLikesCount = likes[projectIdStr] || 0;
        return (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            likesCount={projectLikesCount}
            onLike={(e) => {
              e.stopPropagation();
              handleLike(projectIdStr);
            }}
            onClick={() => onProjectClick(project)}
          />
        );
      })}
    </div>
  );
}

function ProjectCard({ 
  project, 
  index, 
  likesCount, 
  onLike, 
  onClick 
}: { 
  project: Project; 
  index: number; 
  likesCount: number;
  onLike: (e: React.MouseEvent) => void;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isYouTube = project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be');

  // Helper to get high res youtube thumbnail if needed
  const getYouTubeThumbnail = (url: string) => {
    const id = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop()?.split('?')[0];
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : project.thumbnail;
  };

  const displayThumbnail = isYouTube ? getYouTubeThumbnail(project.videoUrl) : project.thumbnail;

  useEffect(() => {
    if (videoRef.current && !isYouTube) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, isYouTube]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative aspect-video overflow-hidden rounded-lg bg-card-bg border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:rotate-1 cursor-pointer"
    >
      {/* Video Preview or YouTube Thumbnail */}
      {isYouTube ? (
        <img
          src={displayThumbnail}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105"
        />
      ) : (
        <video
          ref={videoRef}
          src={project.videoUrl}
          poster={project.thumbnail}
          muted
          loop
          playsInline
          className="h-full w-full object-cover transition-transform duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105"
        />
      )}

      {/* Tags (Top left) */}
      <div className="absolute top-3 left-3 flex gap-1 z-20">
        {project.tools.map(tool => (
          <span key={tool} className="px-2 py-0.5 bg-black/60 text-[8px] font-bold uppercase rounded border border-white/5 text-white/70">
            {tool}
          </span>
        ))}
      </div>

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-90'}`}>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors leading-tight tracking-tight">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              <motion.button 
                onClick={onLike}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-white/10 hover:border-neon-pink/40 hover:bg-neon-pink/10 text-gray-300 hover:text-neon-pink transition-all text-[9px] font-bold uppercase tracking-wider leading-none z-30"
              >
                <Heart size={10} className={`${likesCount > 0 ? "fill-neon-pink text-neon-pink" : "fill-none text-gray-400 group-hover:text-neon-pink"}`} />
                <span>{likesCount}</span>
              </motion.button>
              <span className="text-[10px] font-mono text-neon-cyan mt-1 leading-none">{project.duration}</span>
            </div>
          </div>
          
          <motion.div 
            initial={false}
            animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {project.impact}
            </p>
            
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/5">
              <span className="text-[9px] uppercase tracking-tighter text-gray-400">{project.role}</span>
              <button className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-white hover:text-neon-cyan transition-colors">
                View Case Study <ExternalLink size={10} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="rounded-full border-2 border-white p-4 transition-transform group-hover:scale-110">
            <Play className="text-white fill-white ml-0.5" size={16} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
