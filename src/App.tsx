import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hero3D } from './components/Hero3D';
import { ProjectGrid } from './components/ProjectGrid';
import { Header, Footer } from './components/Navigation';
import { ContactForm } from './components/ContactForm';
import { AdminPanel } from './components/AdminPanel';
import { projects, Project, getYouTubeResourceId } from './lib/projects';
import { CheckCircle2, Award, Zap, Users, X } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // Simulate loading for the intro animation
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const activeYoutubeId = selectedProject ? (selectedProject.youtubeId || getYouTubeResourceId(selectedProject.videoUrl)) : null;

  return (
    <div className="relative font-sans selection:bg-neon-cyan selection:text-black bg-dark-bg">
      {/* Background Atmospheric Gradients */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none" />
      
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-screen"
          >
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 animate-spin rounded-full border-t-2 border-neon-cyan" />
              <div className="absolute inset-0.5 animate-spin-slow rounded-full border-b-2 border-neon-pink" />
              <div className="absolute inset-0 flex items-center justify-center font-black text-white">
                G
              </div>
            </div>
            <p className="loading-text uppercase tracking-[0.5em]">Loading Creativity</p>
          </motion.div>
        )}

        {/* Video Modal */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-card-bg border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute right-6 top-6 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="col-span-2 aspect-video bg-black">
                  {activeYoutubeId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1`}
                      title={selectedProject.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video src={selectedProject.videoUrl} autoPlay controls className="h-full w-full" />
                  )}
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">{selectedProject.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {selectedProject.impact}
                    </p>
                    <div className="mb-8">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neon-cyan mb-2">Used Tools</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tools.map(tool => (
                          <span key={tool} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] uppercase font-bold text-gray-400">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black text-gray-600">{selectedProject.date}</span>
                    <a 
                      href={`mailto:gouravkashyap289@gmail.com?subject=Inquiry about ${selectedProject.title}`}
                      className="text-[10px] uppercase font-black text-neon-cyan hover:underline"
                    >
                      Inquire Now →
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />

      <main>
        {/* Hero Section */}
        <Hero3D />

        {/* Work Section */}
        <section id="work" className="relative z-10 px-6 py-32 md:px-12 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-neon-cyan">
                  Selected Works
                </span>
                <h2 className="text-5xl font-black tracking-tight md:text-7xl">
                  FEATURED <span className="text-stroke text-transparent">EDITS</span>
                </h2>
              </div>
              <p className="max-w-md text-gray-400 text-sm font-medium uppercase tracking-widest opacity-60">
                Crafting visual experiences that demand attention and evoke emotion.
              </p>
            </div>

            <ProjectGrid projects={projects} onProjectClick={(p) => setSelectedProject(p)} />
          </div>
        </section>

        {/* Stats / About Section */}
        <section id="about" className="relative z-10 px-6 py-32 md:px-12 lg:px-24 border-y border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black uppercase tracking-widest mb-6">
                  Available for Commissions
                </div>
                <h2 className="mb-8 text-5xl font-black tracking-tight md:text-7xl leading-[0.9]">
                  STORYTELLING AS <br />
                  <span className="text-stroke text-transparent">ARCHITECTURE</span>
                </h2>
                <p className="mb-12 text-lg leading-relaxed text-gray-400">
                  I'm Gourav, a Video Editor and Motion Designer specializing in high-energy anime edits and cinematic storytelling. With 2+ years of experience, I've mastered the art of turning raw footage into emotionally resonant visual narratives.
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <span className="text-neon-cyan text-4xl font-black">15+</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Projects Delivered</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-4xl font-black">2+</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Years Experience</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-4xl font-black">3</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Pro Tools Mastered</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-neon-pink text-4xl font-black">100%</span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Client Satisfaction</span>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Editor workspace" 
                  className="h-full w-full object-cover grayscale opacity-40 hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-cyan">Muzaffarnagar, IN</p>
                  <p className="text-xl font-bold uppercase tracking-tighter">Global Vision</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="relative z-10 px-6 py-32 text-center md:px-12">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-6xl font-black tracking-tight md:text-8xl leading-[0.85]">
              TELL YOUR <br />
              <span className="text-stroke text-transparent">STORY.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-lg text-gray-500 font-medium uppercase tracking-widest opacity-60">
              Reach out via Email or Phone to start our collaboration.
            </p>
            <div className="mb-12 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 text-center">
              <a href="mailto:gouravkashyap289@gmail.com" className="text-xl md:text-2xl font-bold text-neon-cyan hover:underline tracking-tight">gouravkashyap289@gmail.com</a>
              <a href="tel:7310711027" className="text-xl md:text-2xl font-bold text-white tracking-tight">7310711027</a>
            </div>

            {/* Premium, Interactive Contact Form Linked to Firebase Firestore */}
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Secure Administration Control Console */}
      <AdminPanel />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-6 transition-colors hover:border-white/10 hover:bg-white/[0.07]">
      <div className="mb-4">{icon}</div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{label}</div>
    </div>
  );
}

