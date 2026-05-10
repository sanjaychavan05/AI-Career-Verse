import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Play, CheckCircle2, XCircle, Timer, Zap, Trophy, ChevronRight, Flame } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';

const PROBLEMS = [
  {
    id: 1, title: 'Two Sum', difficulty: 'Easy', points: 50, category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: [[2,7,11,15], 9], expected: [0,1] },
      { input: [[3,2,4], 6], expected: [1,2] },
      { input: [[3,3], 6], expected: [0,1] },
    ],
  },
  {
    id: 2, title: 'Reverse String', difficulty: 'Easy', points: 50, category: 'Strings',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    starterCode: `function reverseString(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] },
      { input: [["H","a","n","n","a","h"]], expected: ["h","a","n","n","a","H"] },
    ],
  },
  {
    id: 3, title: 'Valid Parentheses', difficulty: 'Easy', points: 50, category: 'Stack',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    starterCode: `function isValid(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
    ],
  },
  {
    id: 4, title: 'Maximum Subarray', difficulty: 'Medium', points: 100, category: 'Arrays',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: [[-2,1,-3,4,-1,2,1,-5,4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5,4,-1,7,8]], expected: 23 },
    ],
  },
  {
    id: 5, title: 'Fibonacci Number', difficulty: 'Easy', points: 50, category: 'Recursion',
    description: 'The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1.\n\nGiven n, calculate F(n).',
    examples: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1' },
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
    ],
    starterCode: `function fib(n) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: [2], expected: 1 },
      { input: [3], expected: 2 },
      { input: [4], expected: 3 },
    ],
  },
  {
    id: 6, title: 'Palindrome Check', difficulty: 'Easy', points: 50, category: 'Strings',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { input: 's = "race a car"', output: 'false' },
    ],
    starterCode: `function isPalindrome(s) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: ["racecar"], expected: true },
      { input: ["hello"], expected: false },
      { input: ["aba"], expected: true },
    ],
  },
  {
    id: 7, title: 'Merge Two Sorted Lists', difficulty: 'Medium', points: 100, category: 'Linked List',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.',
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    ],
    starterCode: `function mergeTwoLists(list1, list2) {\n  // Treat inputs as arrays for simplicity\n  // Return merged sorted array\n  \n}`,
    testCases: [
      { input: [[1,2,4],[1,3,4]], expected: [1,1,2,3,4,4] },
      { input: [[],[]], expected: [] },
      { input: [[],[0]], expected: [0] },
    ],
  },
  {
    id: 8, title: 'Climbing Stairs', difficulty: 'Medium', points: 100, category: 'DP',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    starterCode: `function climbStairs(n) {\n  // Write your solution here\n  \n}`,
    testCases: [
      { input: [2], expected: 2 },
      { input: [3], expected: 3 },
      { input: [5], expected: 8 },
    ],
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
  const [solved, setSolved] = useState(new Set());
  const [filter, setFilter] = useState('All');

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

  const filtered = filter === 'All' ? PROBLEMS : PROBLEMS.filter(p => p.difficulty === filter);

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

          {/* Filters */}
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                    : 'dark:bg-white/[0.03] bg-gray-100 dark:text-gray-300 text-gray-600'
                }`}>{f}</button>
            ))}
          </div>

          {/* Problem List */}
          <div className="space-y-2">
            {filtered.map(p => {
              const isSolved = solved.has(p.id);
              return (
                <motion.button key={p.id} whileHover={{ x: 3 }} onClick={() => selectProblem(p)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all border ${
                    isSolved
                      ? 'dark:bg-green-500/5 bg-green-50 dark:border-green-500/15 border-green-200/60'
                      : 'glass-card hover:dark:border-white/[0.1] hover:border-gray-300'
                  }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSolved ? 'bg-green-500/10 text-green-400' : 'dark:bg-white/[0.04] bg-gray-100 dark:text-gray-500 text-gray-400'
                  }`}>
                    {isSolved ? <CheckCircle2 size={16} /> : <Code2 size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold dark:text-white text-gray-900">{p.id}. {p.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md border font-semibold ${DIFF_BG[p.difficulty]} ${DIFF_COLORS[p.difficulty]}`}>{p.difficulty}</span>
                    </div>
                    <p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{p.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono dark:text-amber-400 text-amber-600">+{p.points} XP</span>
                    <ChevronRight size={14} className="dark:text-gray-600 text-gray-400" />
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
                  <span className="text-xs font-bold dark:text-gray-400 text-gray-500 uppercase tracking-wider">JavaScript</span>
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
