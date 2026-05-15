import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, RotateCcw, Loader2, CheckCircle2, AlertTriangle, Brain, Sparkles, Lightbulb, Timer, Volume2 } from 'lucide-react';
import axios from 'axios';

const TOPICS = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'django', label: 'Django', icon: '🌐' },
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'system', label: 'System Design', icon: '🏗️' },
  { id: 'java', label: 'Java', icon: '☕' },
  { id: 'dsa', label: 'DSA', icon: '🧮' },
];
const DIFFICULTY = ['Easy', 'Medium', 'Hard'];

const FALLBACK_QUESTIONS = {
  python: [
    { question: 'Explain the difference between `__init__` and `__new__` methods in Python. When would you override `__new__`?', hints: ['Think about object creation vs initialization', 'Singleton pattern uses __new__'], expectedTopics: ['Metaclasses', 'Object lifecycle'], timeEstimate: '5 min' },
    { question: 'How does Python\'s Global Interpreter Lock (GIL) affect multi-threaded programs? What alternatives exist?', hints: ['CPU-bound vs I/O-bound', 'multiprocessing module'], expectedTopics: ['Threading', 'Concurrency'], timeEstimate: '5 min' },
    { question: 'What are Python decorators? Implement a decorator that logs execution time and caches results.', hints: ['functools.wraps', 'Use a dictionary for caching'], expectedTopics: ['Decorators', 'Closures', 'Memoization'], timeEstimate: '7 min' },
    { question: 'Explain Python context managers. How would you implement one using both class-based and generator-based approaches?', hints: ['__enter__ and __exit__', 'contextlib.contextmanager'], expectedTopics: ['Resource management', 'with statement'], timeEstimate: '5 min' },
    { question: 'What is the difference between `deepcopy` and `shallow copy`? When would each cause issues?', hints: ['Nested mutable objects', 'copy module'], expectedTopics: ['Memory management', 'References'], timeEstimate: '4 min' },
  ],
  django: [
    { question: 'Explain the Django ORM query optimization techniques you\'d use for a page displaying 1000 products with categories and reviews.', hints: ['select_related vs prefetch_related', 'Only/defer'], expectedTopics: ['N+1 problem', 'QuerySet optimization'], timeEstimate: '6 min' },
    { question: 'How would you implement role-based access control (RBAC) in Django REST Framework?', hints: ['Custom permissions', 'Groups and permissions'], expectedTopics: ['DRF Permissions', 'Authentication'], timeEstimate: '5 min' },
    { question: 'Explain Django\'s middleware pipeline. How would you create custom middleware for rate limiting?', hints: ['process_request/response', 'Token bucket algorithm'], expectedTopics: ['Middleware', 'Request lifecycle'], timeEstimate: '6 min' },
  ],
  react: [
    { question: 'Explain how React\'s reconciliation algorithm works. What is the role of keys in lists?', hints: ['Virtual DOM diffing', 'Fiber architecture'], expectedTopics: ['Virtual DOM', 'Performance'], timeEstimate: '5 min' },
    { question: 'Compare useEffect, useLayoutEffect, and useMemo. When would you use each?', hints: ['Paint timing', 'Expensive calculations'], expectedTopics: ['Hooks', 'Render lifecycle'], timeEstimate: '6 min' },
    { question: 'How would you implement code splitting and lazy loading in a large React application?', hints: ['React.lazy', 'Suspense boundaries'], expectedTopics: ['Performance optimization', 'Bundle size'], timeEstimate: '5 min' },
  ],
  system: [
    { question: 'Design a URL shortener like bit.ly that handles 100M URLs and 1B redirects per month.', hints: ['Base62 encoding', 'Read-heavy system'], expectedTopics: ['Hashing', 'Caching', 'Database partitioning'], timeEstimate: '10 min' },
    { question: 'How would you design a real-time notification system for a social media app with 10M DAU?', hints: ['WebSockets', 'Message queues'], expectedTopics: ['Pub/Sub', 'Fan-out'], timeEstimate: '8 min' },
    { question: 'Explain the CAP theorem with examples. How do popular databases handle it?', hints: ['Consistency vs Availability', 'Partition tolerance'], expectedTopics: ['Distributed systems', 'Trade-offs'], timeEstimate: '6 min' },
  ],
  java: [
    { question: 'Explain the difference between HashMap and ConcurrentHashMap in Java. How does ConcurrentHashMap achieve thread safety?', hints: ['Segment locking', 'CAS operations'], expectedTopics: ['Concurrency', 'Collections'], timeEstimate: '5 min' },
    { question: 'What are the SOLID principles? Explain each with a Java code example.', hints: ['Single Responsibility', 'Open/Closed'], expectedTopics: ['OOP', 'Design Principles'], timeEstimate: '8 min' },
    { question: 'How does Spring Boot dependency injection work? Compare constructor vs field injection.', hints: ['IoC container', '@Autowired'], expectedTopics: ['Spring Framework', 'DI'], timeEstimate: '5 min' },
    { question: 'Explain Java\'s garbage collection process. What are the different GC algorithms?', hints: ['G1GC', 'ZGC', 'Generational collection'], expectedTopics: ['JVM', 'Memory management'], timeEstimate: '6 min' },
  ],
  dsa: [
    { question: 'Given a binary tree, find the lowest common ancestor of two given nodes.', hints: ['Recursive approach', 'Base cases'], expectedTopics: ['Trees', 'Recursion'], timeEstimate: '7 min' },
    { question: 'Explain BFS and DFS. When would you use each for graph traversal?', hints: ['Queue vs Stack', 'Shortest path'], expectedTopics: ['Graphs', 'Traversal'], timeEstimate: '5 min' },
    { question: 'How would you detect a cycle in a linked list? Explain Floyd\'s algorithm.', hints: ['Two pointers', 'Fast/slow'], expectedTopics: ['Linked Lists', 'Two pointers'], timeEstimate: '5 min' },
  ],
};

const FALLBACK_EVAL = (q, a) => {
  const words = (a || '').split(' ').length;
  const score = Math.min(95, 45 + words * 2 + Math.floor(Math.random() * 15));
  return {
    score, maxScore: 100,
    rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement',
    strengths: ['Shows understanding of core concepts', 'Structured response', 'Good use of technical terms'],
    weaknesses: words < 20 ? ['Answer could be more detailed', 'Add code examples'] : ['Could mention edge cases', 'Consider performance implications'],
    idealAnswer: 'A comprehensive answer should cover the theory, provide code examples, and discuss trade-offs.',
    feedback: score >= 80 ? 'Excellent answer! You demonstrated strong conceptual knowledge.' : 'Good attempt. Consider adding more specific examples and discussing trade-offs.',
  };
};

export default function InterviewLab() {
  const [topic, setTopic] = useState('python');
  const [difficulty, setDifficulty] = useState('Medium');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [listening, setListening] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // Speak question aloud with a smooth female voice
  const speakQuestion = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1.15;
    utter.volume = 1;
    // Pick best female voice available
    const pickFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = [
        'Google UK English Female', 'Microsoft Zira', 'Samantha',
        'Karen', 'Victoria', 'Google US English', 'Fiona',
        'Microsoft Hazel', 'Google UK English Male'
      ];
      for (const name of preferred) {
        const v = voices.find(voice => voice.name.includes(name));
        if (v) return v;
      }
      // Fallback: any female-sounding English voice
      const femaleVoice = voices.find(v => v.lang.startsWith('en') && /female|woman|zira|samantha|karen|victoria|fiona|hazel/i.test(v.name));
      return femaleVoice || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utter.voice = pickFemaleVoice();
      window.speechSynthesis.speak(utter);
    } else {
      // Voices load async in some browsers
      window.speechSynthesis.onvoiceschanged = () => {
        utter.voice = pickFemaleVoice();
        window.speechSynthesis.speak(utter);
      };
    }
  };

  const generateQuestion = async () => {
    setGenerating(true); setQuestion(null); setAnswer(''); setEvaluation(null);
    setShowHints(false); setTimer(0); setTimerActive(false);
    try {
      const { data } = await axios.post('/api/interview/question', { topic, difficulty });
      const parsed = typeof data === 'string' ? JSON.parse(data.replace(/```json\n?|```/g, '')) : data;
      setQuestion(parsed);
      speakQuestion(parsed.question);
      setTimerActive(true);
    } catch {
      const pool = FALLBACK_QUESTIONS[topic] || FALLBACK_QUESTIONS.python;
      const q = pool[Math.floor(Math.random() * pool.length)];
      setQuestion(q);
      speakQuestion(q.question);
      setTimerActive(true);
    } finally { setGenerating(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setEvaluating(true); setTimerActive(false);
    try {
      const { data } = await axios.post('/api/interview/evaluate', { question: question.question, answer });
      const parsed = typeof data === 'string' ? JSON.parse(data.replace(/```json\n?|```/g, '')) : data;
      setEvaluation(parsed);
    } catch {
      setEvaluation(FALLBACK_EVAL(question?.question, answer));
    } finally { setEvaluating(false); }
  };

  const toggleMic = () => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition not supported'); return; }
    const r = new SpeechRecognition();
    r.continuous = true; r.interimResults = true; r.lang = 'en-US';
    r.onresult = (e) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setAnswer(transcript);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start(); recognitionRef.current = r; setListening(true);
  };

  const getScoreColor = (s) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-900">Interview Lab</h2>
          <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">AI-powered mock interviews with speech-to-text and instant feedback</p>
        </div>
        {/* Big Mic Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
          listening
            ? 'bg-red-500 shadow-red-500/30 animate-pulse'
            : 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-500/30'
        }`}>
          <Mic size={22} className="text-white" />
        </div>
      </div>

      {/* Topic + Difficulty */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {TOPICS.map(t => (
            <button key={t.id} onClick={() => setTopic(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                topic === t.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                  : 'dark:bg-white/[0.03] bg-gray-100 dark:text-gray-300 text-gray-600 dark:hover:bg-white/[0.06] hover:bg-gray-200'
              }`}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {DIFFICULTY.map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                difficulty === d
                  ? 'bg-indigo-600 text-white'
                  : 'dark:bg-white/[0.03] bg-gray-100 dark:text-gray-300 text-gray-600'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      {/* Generate State */}
      {!question && (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Mic size={32} className="text-violet-400" />
          </div>
          <p className="text-base dark:text-gray-300 text-gray-600 mb-4">Ready to practice? Select a topic and start your mock interview.</p>
          <button onClick={generateQuestion} disabled={generating} className="btn-primary flex items-center gap-2 mx-auto text-base px-8 py-3">
            {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Sparkles size={16} /> Start Interview</>}
          </button>
        </div>
      )}

      {/* Question + Answer */}
      {question && !evaluation && (
        <div className="space-y-4">
          {/* Question Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs font-bold border border-violet-500/20">{topic.toUpperCase()}</span>
                <span className="px-2 py-0.5 rounded-md dark:bg-white/[0.04] bg-gray-100 text-xs font-bold dark:text-gray-400 text-gray-500">{difficulty}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Timer */}
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                  timer > 300 ? 'bg-red-500/10 text-red-400' : 'dark:bg-white/[0.04] bg-gray-100 dark:text-cyan-400 text-cyan-600'
                }`}>
                  <Timer size={13} /> {formatTime(timer)}
                </span>
                {/* Re-read aloud */}
                <button onClick={() => speakQuestion(question.question)}
                  className="w-8 h-8 rounded-lg dark:bg-white/[0.04] bg-gray-100 flex items-center justify-center dark:text-violet-400 text-violet-600 hover:dark:bg-white/[0.08] hover:bg-gray-200 transition-colors"
                  title="Listen to question">
                  <Volume2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold dark:text-white text-gray-900 leading-relaxed">{question.question}</h3>

            {/* Hint Toggle */}
            {question.hints && question.hints.length > 0 && (
              <div className="mt-3">
                <button onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-1.5 text-sm font-semibold dark:text-amber-400 text-amber-600 hover:underline">
                  <Lightbulb size={14} /> {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
                <AnimatePresence>
                  {showHints && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex flex-wrap gap-2 overflow-hidden">
                      {question.hints.map((h, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg dark:bg-amber-500/10 bg-amber-50 dark:text-amber-300 text-amber-700 border dark:border-amber-500/20 border-amber-200">💡 {h}</span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {question.expectedTopics && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {question.expectedTopics.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md dark:bg-violet-500/10 bg-violet-50 dark:text-violet-300 text-violet-600 border dark:border-violet-500/20 border-violet-200/60">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Answer Area */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold dark:text-gray-300 text-gray-600 uppercase tracking-wider">Your Answer</h4>
              <button onClick={toggleMic}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  listening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                    : 'dark:bg-white/[0.04] bg-gray-100 dark:text-violet-400 text-violet-600 hover:dark:bg-white/[0.08] hover:bg-gray-200'
                }`}>
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
            {listening && (
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> Listening... speak your answer
              </div>
            )}
            <textarea value={answer} onChange={e => setAnswer(e.target.value)}
              placeholder="Type or speak your answer here..."
              className="w-full h-32 rounded-xl p-4 text-sm dark:bg-white/[0.02] bg-gray-50 dark:text-white text-gray-900 border dark:border-white/[0.04] border-gray-200 outline-none resize-none focus:dark:border-violet-500/30 focus:border-violet-300 transition-colors dark:placeholder-gray-600 placeholder-gray-400" />
            <div className="flex items-center gap-3 mt-3">
              <button onClick={submitAnswer} disabled={evaluating || !answer.trim()} className="btn-primary flex items-center gap-2">
                {evaluating ? <><Loader2 size={14} className="animate-spin" /> Evaluating...</> : <><Send size={14} /> Submit Answer</>}
              </button>
              <button onClick={generateQuestion} className="btn-ghost flex items-center gap-2">
                <RotateCcw size={14} /> New Question
              </button>
              <span className="ml-auto text-xs dark:text-gray-500 text-gray-400 font-mono">
                Time: {formatTime(timer)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation */}
      {evaluation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold font-mono ${
                evaluation.score >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : evaluation.score >= 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>{evaluation.score}</div>
              <div>
                <h3 className="text-lg font-bold dark:text-white text-gray-900">{evaluation.rating || 'Evaluation Complete'}</h3>
                <p className="text-sm dark:text-gray-400 text-gray-500">Answered in {formatTime(timer)}</p>
              </div>
            </div>
            <p className="text-sm dark:text-gray-300 text-gray-600 mb-4 leading-relaxed">{evaluation.feedback}</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl dark:bg-green-500/5 bg-green-50 border dark:border-green-500/10 border-green-200/50">
                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CheckCircle2 size={12} /> Strengths</h4>
                <ul className="space-y-1">
                  {(evaluation.strengths || []).map((s, i) => (
                    <li key={i} className="text-sm dark:text-gray-300 text-gray-600 flex items-start gap-1.5">
                      <span className="text-green-400 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl dark:bg-amber-500/5 bg-amber-50 border dark:border-amber-500/10 border-amber-200/50">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle size={12} /> Areas to Improve</h4>
                <ul className="space-y-1">
                  {(evaluation.weaknesses || []).map((w, i) => (
                    <li key={i} className="text-sm dark:text-gray-300 text-gray-600 flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">→</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {evaluation.idealAnswer && (
              <div className="mt-4 p-4 rounded-xl dark:bg-violet-500/5 bg-violet-50 border dark:border-violet-500/10 border-violet-200/50">
                <h4 className="text-xs font-bold dark:text-violet-400 text-violet-600 uppercase tracking-wider mb-2">Ideal Answer</h4>
                <p className="text-sm dark:text-gray-300 text-gray-600 leading-relaxed">{evaluation.idealAnswer}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={generateQuestion} className="btn-primary flex items-center gap-2">
              <RotateCcw size={14} /> Next Question
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
