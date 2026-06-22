import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { projects } from '../lib/projects';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectId: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    const inquiryId = 'inq_' + Math.random().toString(36).substring(2, 15);
    const path = `inquiries/${inquiryId}`;

    try {
      const docRef = doc(db, 'inquiries', inquiryId);
      
      // Clean up optional fields
      const cleanData: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        createdAt: serverTimestamp(), // Strict server-side verification: data.createdAt == request.time
      };

      if (formData.phone.trim()) {
        cleanData.phone = formData.phone.trim();
      }
      if (formData.projectId) {
        cleanData.projectId = formData.projectId;
      }

      await setDoc(docRef, cleanData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', projectId: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Could not send your inquiry. Please try again.');
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch (logErr) {
        // Log details but keep app running stably
      }
    }
  };

  return (
    <div className="relative mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-card-bg/60 p-8 md:p-12 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

      <h3 className="text-2xl font-black mb-6 uppercase tracking-tight text-white flex items-center gap-2">
        <span>BOOK A</span>
        <span className="text-stroke text-transparent">COMMISSION</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] uppercase tracking-widest font-black text-gray-500 mb-2">
              Your Name <span className="text-neon-pink">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              disabled={status === 'sending' || status === 'success'}
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-widest font-black text-gray-500 mb-2">
              Your Email <span className="text-neon-pink">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              disabled={status === 'sending' || status === 'success'}
              value={formData.email}
              onChange={handleChange}
              placeholder="john@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] uppercase tracking-widest font-black text-gray-500 mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              disabled={status === 'sending' || status === 'success'}
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 12345 67890"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-widest font-black text-gray-500 mb-2">
              Inquiring For (Optional)
            </label>
            <select
              name="projectId"
              disabled={status === 'sending' || status === 'success'}
              value={formData.projectId}
              onChange={handleChange}
              className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-colors disabled:opacity-50 appearance-none"
            >
              <option value="">General Project / Custom Request</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.title}>
                  Style: {proj.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-widest font-black text-gray-500 mb-2">
            Project Specs & Message <span className="text-neon-pink">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={4}
            maxLength={1000}
            disabled={status === 'sending' || status === 'success'}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about the edits you want, music track preferences, length..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-colors disabled:opacity-50"
          />
        </div>

        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400 text-sm"
            >
              <CheckCircle size={18} className="shrink-0 text-emerald-400" />
              <div>
                <p className="font-bold">Message sent dynamically to Firestore!</p>
                <p className="text-xs text-emerald-400/80">Thank you. Gourav will get back to you shortly.</p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-400 text-sm"
            >
              <AlertTriangle size={18} className="shrink-0 text-rose-400" />
              <p className="font-medium">{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end pt-4">
          <motion.button
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            whileHover={status === 'idle' ? { scale: 1.02 } : {}}
            whileTap={status === 'idle' ? { scale: 0.98 } : {}}
            className="flex items-center gap-2 rounded-full bg-neon-cyan px-8 py-3 text-xs font-black uppercase tracking-widest text-[#0c0c0e] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>Sending...</>
            ) : status === 'success' ? (
              <>Sent!</>
            ) : (
              <>
                Send Message <Send size={12} />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
