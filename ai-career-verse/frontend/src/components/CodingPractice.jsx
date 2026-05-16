import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Play, CheckCircle2, XCircle, Timer, Zap, Trophy, ChevronRight, Flame } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const LANGUAGES = ['All', 'JavaScript', 'Python', 'Java', 'C', 'C++', 'DSA'];
const LANG_ICONS = { JavaScript: '🟨', Python: '🐍', Java: '☕', C: '🔵', 'C++': '🟣', DSA: '🧮' };

const PROBLEMS = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', points: 50, category: 'Arrays', lang: 'JavaScript',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' }],
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: [[2,7,11,15], 9], expected: [0,1] }, { input: [[3,2,4], 6], expected: [1,2] }, { input: [[3,3], 6], expected: [0,1] }],
  },
  {
    id: 2, title: 'Reverse String', difficulty: 'Easy', points: 50, category: 'Strings', lang: 'JavaScript',
    description: 'Write a function that reverses a string given as an array of characters.',
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    starterCode: `function reverseString(s) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] }, { input: [["H","a","n","n","a","h"]], expected: ["h","a","n","n","a","H"] }],
  },
  {
    id: 3, title: 'Valid Parentheses', difficulty: 'Easy', points: 50, category: 'Stack', lang: 'JavaScript',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [{ input: 's = "()"', output: 'true' }, { input: 's = "(]"', output: 'false' }],
    starterCode: `function isValid(s) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: ["()"], expected: true }, { input: ["()[]{}"], expected: true }, { input: ["(]"], expected: false }],
  },
  {
    id: 4, title: 'Maximum Subarray', difficulty: 'Medium', points: 100, category: 'Arrays', lang: 'JavaScript',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has largest sum 6.' }],
    starterCode: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 }, { input: [[1]], expected: 1 }, { input: [[5,4,-1,7,8]], expected: 23 }],
  },
  {
    id: 5, title: 'Fibonacci Number', difficulty: 'Easy', points: 50, category: 'Recursion', lang: 'JavaScript',
    description: 'Given n, calculate the nth Fibonacci number F(n).',
    examples: [{ input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' }],
    starterCode: `function fib(n) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: [2], expected: 1 }, { input: [3], expected: 2 }, { input: [4], expected: 3 }],
  },
  {
    id: 6, title: 'Palindrome Check', difficulty: 'Easy', points: 50, category: 'Strings', lang: 'JavaScript',
    description: 'Given a string s, return true if it is a palindrome (reads same forward and backward).',
    examples: [{ input: 's = "racecar"', output: 'true' }],
    starterCode: `function isPalindrome(s) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: ["racecar"], expected: true }, { input: ["hello"], expected: false }, { input: ["aba"], expected: true }],
  },
  {
    id: 7, title: 'Climbing Stairs', difficulty: 'Medium', points: 100, category: 'DP', lang: 'JavaScript',
    description: 'You are climbing n steps. Each time you can climb 1 or 2 steps. How many distinct ways to reach the top?',
    examples: [{ input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }],
    starterCode: `function climbStairs(n) {\n  // Write your solution here\n  \n}`,
    testCases: [{ input: [2], expected: 2 }, { input: [3], expected: 3 }, { input: [5], expected: 8 }],
  },
  // ─── PYTHON ───
  {
    id: 9, title: 'List Comprehension Sum', difficulty: 'Easy', points: 50, category: 'Lists', lang: 'Python',
    description: 'Given a list of numbers, return the sum of all even numbers using list comprehension.\n\nWrite a function that filters even numbers and sums them.',
    examples: [{ input: 'nums = [1,2,3,4,5,6]', output: '12', explanation: '2+4+6 = 12' }],
    starterCode: `function sumEvens(nums) {\n  # Python: sum of even numbers\n  # return sum(x for x in nums if x % 2 == 0)\n  \n}`,
    editorLang: 'python',
    testCases: [{ input: [[1,2,3,4,5,6]], expected: 12 }, { input: [[2,4,6]], expected: 12 }, { input: [[1,3,5]], expected: 0 }],
  },
  {
    id: 10, title: 'Dictionary Key Count', difficulty: 'Easy', points: 50, category: 'HashMap', lang: 'Python',
    description: 'Given a string, count the frequency of each character and return an object/dictionary with the counts.',
    examples: [{ input: 's = "hello"', output: '{h:1, e:1, l:2, o:1}' }],
    starterCode: `function charCount(s) {\n  # Python: count character frequencies\n  # Use a dict to track counts\n  \n}`,
    editorLang: 'python',
    testCases: [{ input: ["aab"], expected: {a:2, b:1} }, { input: ["xyz"], expected: {x:1, y:1, z:1} }],
  },
  {
    id: 11, title: 'Find Duplicates', difficulty: 'Medium', points: 100, category: 'Sets', lang: 'Python',
    description: 'Given a list of integers, return a sorted list of elements that appear more than once.',
    examples: [{ input: 'nums = [1,2,3,2,4,3]', output: '[2,3]' }],
    starterCode: `function findDuplicates(nums) {\n  # Python: find elements appearing more than once\n  # Use set() for tracking\n  \n}`,
    editorLang: 'python',
    testCases: [{ input: [[1,2,3,2,4,3]], expected: [2,3] }, { input: [[1,1,1]], expected: [1] }, { input: [[1,2,3]], expected: [] }],
  },
  // ─── JAVA ───
  {
    id: 12, title: 'Array Rotation', difficulty: 'Easy', points: 50, category: 'Arrays', lang: 'Java',
    description: 'Rotate an array to the right by k steps. For example, [1,2,3,4,5] rotated by 2 gives [4,5,1,2,3].',
    examples: [{ input: 'nums = [1,2,3,4,5], k = 2', output: '[4,5,1,2,3]' }],
    starterCode: `function rotate(nums, k) {\n  // Java: Rotate array right by k steps\n  // Use modular arithmetic\n  \n}`,
    editorLang: 'java',
    testCases: [{ input: [[1,2,3,4,5], 2], expected: [4,5,1,2,3] }, { input: [[1,2,3], 1], expected: [3,1,2] }],
  },
  {
    id: 13, title: 'String Reversal Words', difficulty: 'Medium', points: 100, category: 'Strings', lang: 'Java',
    description: 'Reverse the order of words in a string. "Hello World" becomes "World Hello".',
    examples: [{ input: 's = "the sky is blue"', output: '"blue is sky the"' }],
    starterCode: `function reverseWords(s) {\n  // Java: Reverse word order\n  // Split, reverse, join\n  \n}`,
    editorLang: 'java',
    testCases: [{ input: ["the sky is blue"], expected: "blue is sky the" }, { input: ["hello world"], expected: "world hello" }],
  },
  // ─── C ───
  {
    id: 14, title: 'Count Digits', difficulty: 'Easy', points: 50, category: 'Math', lang: 'C',
    description: 'Given a positive integer n, return the number of digits in n.',
    examples: [{ input: 'n = 12345', output: '5' }],
    starterCode: `function countDigits(n) {\n  /* C: Count number of digits */\n  /* Use division loop */\n  \n}`,
    editorLang: 'c',
    testCases: [{ input: [12345], expected: 5 }, { input: [0], expected: 1 }, { input: [100], expected: 3 }],
  },
  {
    id: 15, title: 'GCD (Euclidean)', difficulty: 'Easy', points: 50, category: 'Math', lang: 'C',
    description: 'Find the Greatest Common Divisor of two numbers using the Euclidean algorithm.',
    examples: [{ input: 'a = 12, b = 8', output: '4' }],
    starterCode: `function gcd(a, b) {\n  /* C: Euclidean GCD */\n  /* while (b != 0) ... */\n  \n}`,
    editorLang: 'c',
    testCases: [{ input: [12, 8], expected: 4 }, { input: [7, 3], expected: 1 }, { input: [100, 25], expected: 25 }],
  },
  // ─── C++ ───
  {
    id: 16, title: 'Matrix Transpose', difficulty: 'Medium', points: 100, category: 'Matrix', lang: 'C++',
    description: 'Given a 2D matrix, return its transpose (rows become columns).',
    examples: [{ input: 'matrix = [[1,2,3],[4,5,6]]', output: '[[1,4],[2,5],[3,6]]' }],
    starterCode: `function transpose(matrix) {\n  // C++: Return transposed matrix\n  // Swap rows and columns\n  \n}`,
    editorLang: 'cpp',
    testCases: [{ input: [[[1,2,3],[4,5,6]]], expected: [[1,4],[2,5],[3,6]] }, { input: [[[1,2],[3,4]]], expected: [[1,3],[2,4]] }],
  },
  {
    id: 17, title: 'Binary Search', difficulty: 'Easy', points: 50, category: 'Search', lang: 'C++',
    description: 'Given a sorted array nums and a target value, return the index of target or -1 if not found.',
    examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }],
    starterCode: `function search(nums, target) {\n  // C++: Binary search\n  // Use two pointers: left, right\n  \n}`,
    editorLang: 'cpp',
    testCases: [{ input: [[-1,0,3,5,9,12], 9], expected: 4 }, { input: [[-1,0,3,5,9,12], 2], expected: -1 }],
  },
  // ─── DSA ───
  {
    id: 18, title: 'Linked List Cycle', difficulty: 'Easy', points: 50, category: 'Linked List', lang: 'DSA',
    description: 'Given the head of a linked list (as array), determine if there is a cycle. Return true if last element index points back.',
    examples: [{ input: 'head = [3,2,0,-4], pos = 1', output: 'true' }],
    starterCode: `function hasCycle(nums, pos) {\n  // Check if pos creates a cycle\n  return pos >= 0;\n}`,
    testCases: [{ input: [[3,2,0,-4], 1], expected: true }, { input: [[1,2], -1], expected: false }, { input: [[1], -1], expected: false }],
  },
  {
    id: 19, title: 'Infix to Postfix', difficulty: 'Medium', points: 100, category: 'Stack', lang: 'DSA',
    description: 'Convert an infix expression to postfix notation using the Shunting-yard algorithm. Only +, -, *, / operators.',
    examples: [{ input: 'expr = "a+b*c"', output: '"abc*+"' }],
    starterCode: `function infixToPostfix(expr) {\n  // Implement shunting-yard\n  \n}`,
    testCases: [{ input: ["a+b"], expected: "ab+" }, { input: ["a*b+c"], expected: "ab*c+" }],
  },
  {
    id: 20, title: 'BFS Shortest Path', difficulty: 'Medium', points: 100, category: 'Graphs', lang: 'DSA',
    description: 'Given an adjacency list and start node, return the shortest distance to all nodes using BFS. Return array of distances.',
    examples: [{ input: 'adj = [[1,2],[0,3],[0],[1]], start = 0', output: '[0,1,1,2]' }],
    starterCode: `function bfsShortestPath(adj, start) {\n  // BFS to find shortest distances\n  \n}`,
    testCases: [{ input: [[[1],[0]], 0], expected: [0,1] }, { input: [[[1,2],[0],[0]], 0], expected: [0,1,1] }],
  },
  {
    id: 21, title: 'Kth Largest Element', difficulty: 'Medium', points: 100, category: 'Heap', lang: 'DSA',
    description: 'Find the kth largest element in an unsorted array. Note: it is the kth largest, not kth distinct.',
    examples: [{ input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' }],
    starterCode: `function findKthLargest(nums, k) {\n  // Find kth largest\n  \n}`,
    testCases: [{ input: [[3,2,1,5,6,4], 2], expected: 5 }, { input: [[3,2,3,1,2,4,5,5,6], 4], expected: 4 }],
  },
];

const DIFF_COLORS = { Easy: 'text-green-400', Medium: 'text-amber-400', Hard: 'text-red-400' };
const DIFF_BG = { Easy: 'bg-green-500/10 border-green-500/20', Medium: 'bg-amber-500/10 border-amber-500/20', Hard: 'bg-red-500/10 border-red-500/20' };

export default function CodingPractice() {
  const { awardXP } = useGamification();
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(() => {
    try { const s = localStorage.getItem('cv_solved'); return s ? new Set(JSON.parse(s)) : new Set(); } catch { return new Set(); }
  });
  const [filter, setFilter] = useState('All');
  const [langFilter, setLangFilter] = useState('All');

  // Persist solved set to localStorage
  useEffect(() => {
    localStorage.setItem('cv_solved', JSON.stringify([...solved]));
  }, [solved]);

  const totalPoints = [...solved].reduce((sum, id) => {
    const p = PROBLEMS.find(pr => pr.id === id);
    return sum + (p?.points || 0);
  }, 0);

  const selectProblem = (p) => {
    setSelectedProblem(p);
    setCode(p.starterCode);
    setResults(null);
  };

  const runCode = () => {
    setRunning(true);
    setTimeout(() => {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('return ' + code)();
        const testResults = selectedProblem.testCases.map(tc => {
          try {
            const result = fn(...tc.input);
            const passed = JSON.stringify(result) === JSON.stringify(tc.expected);
            return { passed, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), got: JSON.stringify(result) };
          } catch (err) {
            return { passed: false, input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), got: err.message };
          }
        });

        const allPassed = testResults.every(r => r.passed);
        setResults({ tests: testResults, allPassed });

        if (allPassed && !solved.has(selectedProblem.id)) {
          setSolved(prev => new Set([...prev, selectedProblem.id]));
          awardXP('COURSE_COMPLETE', `Solved: ${selectedProblem.title}`);
        }
      } catch (err) {
        setResults({ tests: [{ passed: false, input: '-', expected: '-', got: `Syntax Error: ${err.message}` }], allPassed: false });
      }
      setRunning(false);
    }, 800);
  };

  const filtered = PROBLEMS.filter(p => {
    if (filter !== 'All' && p.difficulty !== filter) return false;
    if (langFilter !== 'All' && p.lang !== langFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {!selectedProblem ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">Coding Practice</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Solve problems, earn XP, build your streak</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-amber-500/10 bg-amber-50 border dark:border-amber-500/20 border-amber-200">
                <Trophy size={14} className="text-amber-400" />
                <span className="text-sm font-bold dark:text-amber-400 text-amber-600">{totalPoints} pts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-green-500/10 bg-green-50 border dark:border-green-500/20 border-green-200">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-sm font-bold dark:text-green-400 text-green-600">{solved.size}/{PROBLEMS.length} solved</span>
              </div>
            </div>
          </div>

          {/* Language + Difficulty Filters */}
          <div className="glass-card p-3 flex items-center justify-between gap-3">
            <div className="flex gap-2 flex-wrap">
              {LANGUAGES.map(l => (
                <button key={l} onClick={() => setLangFilter(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    langFilter === l
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-600 hover:dark:bg-white/[0.08] hover:bg-gray-200'
                  }`}>{l !== 'All' ? `${LANG_ICONS[l]} ` : ''}{l}</button>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {['All', 'Easy', 'Medium', 'Hard'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-400 text-gray-600 hover:dark:bg-white/[0.08] hover:bg-gray-200'
                  }`}>{f}</button>
              ))}
            </div>
          </div>

          {/* Problem Board — Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(p => {
              const isSolved = solved.has(p.id);
              return (
                <motion.button key={p.id} whileHover={{ y: -3, scale: 1.01 }} onClick={() => selectProblem(p)}
                  className={`flex flex-col p-4 rounded-xl text-left transition-all border ${
                    isSolved
                      ? 'dark:bg-green-500/5 bg-green-50 dark:border-green-500/15 border-green-200/60'
                      : 'glass-card hover:dark:border-white/[0.1] hover:border-gray-300 hover:shadow-lg hover:shadow-violet-600/5'
                  }`}>
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSolved ? 'bg-green-500/10 text-green-400' : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-500 text-gray-400'
                    }`}>
                      {isSolved ? <CheckCircle2 size={16} /> : <Code2 size={16} />}
                    </div>
                    <span className="text-xs font-bold font-mono dark:text-amber-400 text-amber-600">+{p.points} XP</span>
                  </div>
                  <h4 className="text-sm font-bold dark:text-white text-gray-900 mb-1">{p.id}. {p.title}</h4>
                  <p className="text-[10px] dark:text-gray-500 text-gray-400 mb-2">{p.category}</p>
                  <div className="flex items-center gap-1.5 mt-auto">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${DIFF_BG[p.difficulty]} ${DIFF_COLORS[p.difficulty]}`}>{p.difficulty}</span>
                    {p.lang && <span className="tag-badge">{LANG_ICONS[p.lang] || ''} {p.lang}</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </>
      ) : (
        /* Problem Detail + Code Editor */
        <>
          <div className="flex items-center justify-between">
            <button onClick={() => { setSelectedProblem(null); setResults(null); }}
              className="btn-ghost text-sm flex items-center gap-1.5">
              ← Back to Problems
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-md border font-semibold ${DIFF_BG[selectedProblem.difficulty]} ${DIFF_COLORS[selectedProblem.difficulty]}`}>
                {selectedProblem.difficulty}
              </span>
              <span className="text-xs font-bold font-mono dark:text-amber-400 text-amber-600">+{selectedProblem.points} XP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left — Problem */}
            <div className="glass-card p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <h3 className="text-lg font-bold dark:text-white text-gray-900">{selectedProblem.id}. {selectedProblem.title}</h3>
              <p className="text-sm dark:text-gray-300 text-gray-600 whitespace-pre-line leading-relaxed">{selectedProblem.description}</p>

              {selectedProblem.examples.map((ex, i) => (
                <div key={i} className="p-3 rounded-xl dark:bg-white/[0.02] bg-gray-50 border dark:border-white/[0.04] border-gray-200/40">
                  <p className="text-xs font-bold dark:text-gray-400 text-gray-500 mb-1">Example {i + 1}:</p>
                  <p className="text-xs font-mono dark:text-cyan-400 text-cyan-600">Input: {ex.input}</p>
                  <p className="text-xs font-mono dark:text-green-400 text-green-600">Output: {ex.output}</p>
                  {ex.explanation && <p className="text-xs dark:text-gray-500 text-gray-400 mt-1">{ex.explanation}</p>}
                </div>
              ))}
            </div>

            {/* Right — Code Editor */}
            <div className="space-y-3">
              <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/[0.04] border-gray-200/40">
                  <span className="text-xs font-bold dark:text-gray-400 text-gray-500 uppercase tracking-wider">{LANG_ICONS[selectedProblem.lang] || '📝'} {selectedProblem.lang || 'JavaScript'}</span>
                  <button onClick={runCode} disabled={running}
                    className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5">
                    {running ? <><Timer size={12} className="animate-spin" /> Running...</> : <><Play size={12} /> Run Code</>}
                  </button>
                </div>
                <textarea value={code} onChange={e => setCode(e.target.value)}
                  className="w-full h-64 p-4 font-mono text-sm dark:bg-[#0D1117] bg-gray-50 dark:text-green-300 text-gray-800 outline-none resize-none border-none"
                  spellCheck={false} />
              </div>

              {/* Results */}
              <AnimatePresence>
                {results && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 space-y-2">
                    <div className={`flex items-center gap-2 mb-2 ${results.allPassed ? 'text-green-400' : 'text-red-400'}`}>
                      {results.allPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      <span className="text-sm font-bold">{results.allPassed ? 'All Tests Passed! 🎉' : 'Some Tests Failed'}</span>
                      {results.allPassed && solved.has(selectedProblem.id) && (
                        <span className="ml-auto text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Zap size={12} /> +{selectedProblem.points} XP earned
                        </span>
                      )}
                    </div>
                    {results.tests.map((t, i) => (
                      <div key={i} className={`p-2.5 rounded-lg text-xs font-mono border ${
                        t.passed
                          ? 'dark:bg-green-500/5 bg-green-50 dark:border-green-500/15 border-green-200/50'
                          : 'dark:bg-red-500/5 bg-red-50 dark:border-red-500/15 border-red-200/50'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {t.passed ? <CheckCircle2 size={11} className="text-green-400" /> : <XCircle size={11} className="text-red-400" />}
                          <span className={t.passed ? 'dark:text-green-400 text-green-600' : 'dark:text-red-400 text-red-600'}>Test {i + 1}: {t.passed ? 'Passed' : 'Failed'}</span>
                        </div>
                        {!t.passed && (
                          <div className="ml-5 space-y-0.5 dark:text-gray-400 text-gray-500">
                            <p>Expected: {t.expected}</p>
                            <p>Got: {t.got}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
