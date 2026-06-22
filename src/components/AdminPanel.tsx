import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, LogIn, LogOut, Trash2, Mail, Phone, Calendar, Clock, X, Lock } from 'lucide-react';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { auth, signInWithGoogle, logOut, db, handleFirestoreError, OperationType } from '../firebase';
import { User } from 'firebase/auth';

export function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Monitor auth changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === 'gouravkashyap289@gmail.com') {
        // Fetch inquiries real-time if validated as admin
        loadInquiriesRealtime();
      } else {
        setInquiries([]);
      }
    });
    return unsubscribe;
  }, []);

  const loadInquiriesRealtime = () => {
    setLoading(true);
    const path = 'inquiries';
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: any[] = [];
      snapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setInquiries(docs);
      setLoading(false);
      setErrorMsg('');
    }, (error) => {
      console.error("Firestore loading error:", error);
      setErrorMsg('Unauthorized: Security Rules blocked the read query.');
      setLoading(false);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e) {}
    });

    return unsubscribe;
  };

  const handleSignIn = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      setInquiries([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client inquiry?')) return;
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (err) {
      setErrorMsg('Could not delete document.');
      try {
        handleFirestoreError(err, OperationType.DELETE, path);
      } catch (e) {}
    }
  };

  const isAdmin = user && user.email === 'gouravkashyap289@gmail.com';

  return (
    <>
      {/* Floating Padlock Access Badge */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-black/60 border border-white/10 text-gray-500 hover:text-neon-cyan hover:border-neon-cyan/50 backdrop-blur-md shadow-2xl transition-all hover:scale-110"
        title="Admin Inbox Console"
      >
        <Shield size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-card-bg border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white leading-none">
                      Admin Console
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                      Secure Client Portal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {user && (
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <span className="text-xs font-bold text-white leading-none">{user.displayName}</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5">{user.email}</span>
                    </div>
                  )}

                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LogOut size={12} /> Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-neon-cyan text-[#0c0c0e] rounded-lg text-[10px] uppercase font-black tracking-widest hover:bg-white transition-colors"
                    >
                      <LogIn size={12} /> Sign In with Google
                    </button>
                  )}

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {errorMsg && (
                  <div className="mb-6 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-rose-400 text-sm">
                    {errorMsg}
                  </div>
                )}

                {!user ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-600 mb-6">
                      <Lock size={36} />
                    </div>
                    <h4 className="text-xl font-black uppercase text-white mb-2">Gate Locked</h4>
                    <p className="text-sm text-gray-500 max-w-sm mb-8">
                      Sign in with Gourav's verified Google workspace account to view client contract submissions and dashboard statistics.
                    </p>
                    <button
                      onClick={handleSignIn}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-neon-cyan text-[#0c0c0e] font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                      Verify Administration
                    </button>
                  </div>
                ) : !isAdmin ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 mb-6">
                      <Shield size={36} />
                    </div>
                    <h4 className="text-xl font-black uppercase text-rose-400 mb-2">Access Restrained</h4>
                    <p className="text-sm text-gray-400 max-w-sm mb-8">
                      Your identity ({user.email}) is authenticated, but you are not recognized as the system owner. Security rules strictly block resource access.
                    </p>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Authenticate with another account
                    </button>
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mb-4" />
                    <p className="text-xs uppercase tracking-widest text-gray-500">Retrieving Inquiries from Firestore...</p>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">No inquiry letters on file yet.</p>
                    <p className="text-xs text-gray-600 mt-1">Wait for client commission proposals to be submitted.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-widest text-neon-cyan">
                        Incoming Inquiries ({inquiries.length})
                      </h4>
                      <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded leading-none">
                        PROTOC_DB_LIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                            <div>
                              <span className="text-xs text-gray-500 font-mono block mb-1">
                                ID: {inq.id}
                              </span>
                              <h5 className="text-lg font-black text-white uppercase tracking-tight">
                                {inq.name}
                              </h5>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                                <a
                                  href={`mailto:${inq.email}`}
                                  className="flex items-center gap-1.5 hover:text-neon-cyan"
                                >
                                  <Mail size={12} /> {inq.email}
                                </a>
                                {inq.phone && (
                                  <a
                                    href={`tel:${inq.phone}`}
                                    className="flex items-center gap-1.5 hover:text-neon-cyan"
                                  >
                                    <Phone size={12} /> {inq.phone}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {inq.createdAt && (
                                <div className="text-right text-[10px] font-mono text-gray-500 select-none">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(inq.createdAt?.seconds * 1000).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1 mt-0.5 justify-end">
                                    <Clock size={10} />
                                    {new Date(inq.createdAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={() => handleDelete(inq.id)}
                                className="p-2 text-gray-500 hover:text-neon-pink rounded bg-white/5 border border-white/5 hover:border-neon-pink/30 hover:bg-neon-pink/10 transition-all self-start"
                                title="Delete Proposal"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="bg-black/40 rounded-lg p-4 border border-white/5 text-sm text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                            {inq.message}
                          </div>

                          <div className="flex justify-between items-center text-[10px] uppercase font-black text-gray-400 border-t border-white/5 pt-3">
                            <span className="text-neon-cyan">
                              Interested In: {inq.projectId || 'General commission proposal'}
                            </span>
                            <a
                              href={`mailto:${inq.email}?subject=Commission Proposal Response&body=Hi ${inq.name}, thanks for reaching out regarding your interest in ${inq.projectId || 'working together'}...`}
                              className="text-white hover:text-neon-cyan flex items-center gap-1"
                            >
                              Compose Email Reply →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
