import { motion } from 'motion/react';
import { Youtube, Instagram, Linkedin, Mail } from 'lucide-react';

export function Header() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-dark-bg/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-12 py-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 border-2 border-neon-cyan flex items-center justify-center font-black text-xl tracking-tighter">
            G
          </div>
          <span className="font-bold tracking-widest text-xs uppercase opacity-80 hidden sm:block">Gourav</span>
        </motion.div>
        
        <div className="hidden items-center gap-10 md:flex">
          {['Work', 'Showreel', 'Process', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[11px] font-semibold tracking-[0.2em] uppercase opacity-70 transition-colors hover:text-neon-cyan hover:opacity-100"
              whileHover={{ y: -1 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          whileHover={{ backgroundColor: 'white', color: 'black' }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full border border-white/20 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center"
        >
          Let's Create
        </motion.a>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-dark-bg border-t border-white/10">
      <div className="mx-auto max-w-7xl px-12 py-16">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Gourav</h3>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-[0.2em] text-[10px]">Crafting Visual Stories That Resonate</p>
          </div>
          
          <div className="flex gap-10 opacity-60">
            <SocialLink label="Youtube" href="https://www.youtube.com/@gktech890" />
            <SocialLink label="Instagram" href="https://www.instagram.com/gouravkashyap090/" />
            <SocialLink label="LinkedIn" href="https://www.linkedin.com/in/gourav-kashyap-40640325b" />
          </div>
        </div>
        
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 md:flex-row">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">
            © 2025 Gourav. All Rights Reserved.
          </p>
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-bold">
            Based in Muzaffarnagar, Working Globally
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ label, href }: { label: string; href: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs uppercase tracking-tighter font-bold text-white transition-colors hover:text-neon-cyan"
      whileHover={{ y: -2 }}
    >
      {label}
    </motion.a>
  );
}
