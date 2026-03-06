import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Editor from '@monaco-editor/react';
import { useStudent } from '@/contexts/StudentContext';
import { supabase } from '@/integrations/supabase/client';
import { useTimer } from '@/hooks/useTimer';
import { useTabDetection } from '@/hooks/useTabDetection';
import { levenshteinSimilarity } from '@/utils/plagiarism';
import { SortableItem } from '@/components/SortableItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Clock, CheckCircle, Code2, Shield } from 'lucide-react';
import { isAdmin } from '@/data/admins';

interface Question {
  id: string;
  type: string;
  content: string;
  options: any;
  correct_answer: string;
  marks: number;
  image_url?: string;
}

const TechnicalRound = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [sortItems, setSortItems] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testActive, setTestActive] = useState(false);

  useTabDetection(student?.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!student) { 
      navigate('/'); 
      return; 
    }
    
    // Check if user is admin - admins cannot take tests
    if (isAdmin(student.reg_no)) {
      toast({ 
        title: '⚠️ Admin Access Restricted', 
        description: 'Admins cannot take tests. Redirecting to dashboard...',
        variant: 'destructive'
      });
      navigate('/admin');
      return;
    }
    
    // Load technical questions function
    const loadQuestions = () => {
      supabase
        .from('questions')
        .select('*')
        .eq('round', 'technical')
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching technical questions:', error);
            setLoading(false);
            return;
          }
          
          if (data && data.length > 0) {
            // Sort by section from options
            const sorted = data.sort((a, b) => {
              const sectionA = (a.options as any)?.section || 0;
              const sectionB = (b.options as any)?.section || 0;
              return sectionA - sectionB;
            });
            
            setQuestions(sorted as Question[]);
            
            if (sorted[0].type === 'rearrange') {
              const opts = sorted[0].options as any;
              const shuffled = opts?.shuffled_lines || opts?.code_lines || [];
              setSortItems([...shuffled]);
            }
          }
          
          setLoading(false);
        });
    };

    // Check if technical round is active
    const checkTestStatus = async () => {
      const { data: control } = await supabase
        .from('test_control')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!control?.technical_active) {
        setTestActive(false);
        setLoading(false);
        return;
      }

      // Test is active, load questions
      setTestActive(true);
      loadQuestions();
    };

    checkTestStatus();

    // Subscribe to real-time test control changes
    const channel = supabase
      .channel('test-control-technical')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'test_control',
        filter: 'id=eq.1'
      }, (payload: any) => {
        const newControl = payload.new;
        if (newControl.technical_active && !testActive) {
          // Test just started!
          setTestActive(true);
          setLoading(true);
          loadQuestions();
          toast({
            title: '▶️ Test Started!',
            description: 'Technical round has started. Good luck!',
          });
        } else if (!newControl.technical_active && testActive) {
          // Test was stopped
          setTestActive(false);
          toast({
            title: '⏸️ Test Stopped',
            description: 'Technical round has been stopped by admin.',
            variant: 'destructive',
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [student, navigate, testActive]);

  const getTimerDuration = (type: string) => (type === 'coding' ? 300 : 60);

  const submitAnswer = useCallback(async () => {
    if (!student || submitting || finished) return;
    setSubmitting(true);
    const q = questions[currentIdx];
    if (!q) return;

    let finalAnswer = answer;
    if (q.type === 'rearrange') finalAnswer = sortItems.join('|'); // Use pipe separator for database comparison

    const isCorrect = finalAnswer.trim() === q.correct_answer.trim();
    const questionScore = isCorrect ? q.marks : 0;

    await supabase.from('submissions').insert({
      student_id: student.id,
      question_id: q.id,
      answer: finalAnswer,
      score: questionScore,
      time_taken: getTimerDuration(q.type) - timeLeft,
    });

    // Plagiarism check for coding questions
    if (q.type === 'coding' && finalAnswer.trim()) {
      const { data: others } = await supabase
        .from('submissions')
        .select('student_id, answer')
        .eq('question_id', q.id)
        .neq('student_id', student.id);
      if (others) {
        for (const other of others) {
          if (other.answer) {
            const sim = levenshteinSimilarity(finalAnswer, other.answer);
            if (sim > 85) {
              await supabase.from('plagiarism_logs').insert({
                student1: student.id,
                student2: other.student_id,
                similarity: sim,
                question_id: q.id,
              });
            }
          }
        }
      }
    }

    const newScore = score + questionScore;
    setScore(newScore);

    if (currentIdx < questions.length - 1) {
      const nextQ = questions[currentIdx + 1];
      setCurrentIdx(i => i + 1);
      setAnswer('');
      if (nextQ.type === 'rearrange') {
        const opts = (nextQ.options as any);
        const shuffled = opts?.shuffled_lines || opts?.code_lines || [];
        setSortItems([...shuffled]);
      }
      reset(getTimerDuration(nextQ.type));
    } else {
      await supabase
        .from('leaderboard')
        .update({ technical_score: newScore })
        .eq('student_id', student.id);
      // Update total
      const { data: lb } = await supabase.from('leaderboard').select('aptitude_score').eq('student_id', student.id).single();
      if (lb) {
        await supabase.from('leaderboard').update({ total_score: (lb.aptitude_score || 0) + newScore }).eq('student_id', student.id);
      }
      setFinished(true);
      toast({ title: '🏆 Competition Complete!', description: `Technical Round score: ${newScore}` });
    }
    setSubmitting(false);
  }, [student, answer, sortItems, currentIdx, questions, score, finished, submitting]);

  const { timeLeft, reset, percentage } = useTimer(
    questions[currentIdx] ? getTimerDuration(questions[currentIdx].type) : 60,
    submitAnswer
  );

  if (!student) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading technical questions...</p>
        </motion.div>
      </div>
    );
  }

  if (!testActive) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-arena p-8 text-center max-w-md">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-foreground mb-2">⏳ Waiting for Test to Start</h2>
          <p className="text-muted-foreground mb-4">The technical round has not been started yet. Please wait for the admin to activate it.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/leaderboard')} variant="outline">View Leaderboard</Button>
            <Button onClick={() => navigate('/')} variant="ghost">Back to Home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <div className="card-arena p-8 text-center max-w-md">
          <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-2">Technical Round Not Available</h2>
          <p className="text-muted-foreground">Please wait for the admin to set up technical questions.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-arena p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Competition Complete!</h2>
          <p className="text-3xl font-bold text-primary mb-6">{score} Points</p>
          <Button onClick={() => navigate('/leaderboard')} className="w-full">View Leaderboard</Button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const timerDuration = getTimerDuration(q.type);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSortItems(items => {
        const oldIdx = items.indexOf(active.id);
        const newIdx = items.indexOf(over.id);
        return arrayMove(items, oldIdx, newIdx);
      });
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-foreground">Technical Round</p>
            <p className="text-xs text-muted-foreground">
              Question {currentIdx + 1} of {questions.length}
              {((q.options as any)?.section_name) && ` • ${String((q.options as any).section_name)}`}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
            <Clock className="w-4 h-4 text-destructive" />
            <span className={`font-mono font-bold text-sm ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <Progress value={(currentIdx / questions.length) * 100} className="mb-4 h-2" />
        <div className="w-full h-1 bg-secondary rounded-full mb-6 overflow-hidden">
          <motion.div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={q.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card-arena p-6 mb-6">
            {((q.options as any)?.section_name) && (
              <div className="inline-block px-3 py-1 rounded bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wide">
                {String((q.options as any).section_name)}
              </div>
            )}
            <h2 className="text-base font-normal text-foreground mb-4 whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              {q.content}
            </h2>

            {q.image_url && <img src={q.image_url} alt="Question" className="w-full max-h-60 object-contain rounded-lg mb-4 bg-secondary/50" />}

            {/* Rearrange */}
            {q.type === 'rearrange' && (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortItems} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sortItems.map(item => (
                      <SortableItem key={item} id={item}>{item}</SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Text input types */}
            {['write_output'].includes(q.type) && (
              <Input
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type what the code prints..."
                className="bg-secondary/50"
              />
            )}

            {/* MCQ for pseudocode, syntax_error, output_prediction */}
            {['pseudocode', 'syntax_error', 'output_prediction', 'mcq'].includes(q.type) && q.options && (
              <div className="space-y-3">
                {(() => {
                  // Extract options array - handle JSONB structure from database
                  const opts = (q.options as any);
                  let optionsArray: string[] = [];
                  
                  if (Array.isArray(opts)) {
                    // Direct array
                    optionsArray = opts;
                  } else if (opts && typeof opts === 'object') {
                    // Check for 'options' property first (nested array)
                    if (Array.isArray(opts.options)) {
                      optionsArray = opts.options;
                    } else {
                      // Extract numeric keys only (0, 1, 2, 3) from JSONB
                      const keys = Object.keys(opts).filter(k => !isNaN(Number(k))).sort();
                      optionsArray = keys.map(k => opts[k]).filter(v => typeof v === 'string' && v.length > 0);
                    }
                  }
                  
                  return optionsArray.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setAnswer(opt)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        answer === opt ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30 hover:border-primary/40'
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-foreground mr-3">{String.fromCharCode(65 + i)}</span>
                      <span className="whitespace-pre-wrap">{String(opt)}</span>
                    </button>
                  ));
                })()}
              </div>
            )}

            {/* Coding */}
            {q.type === 'coding' && (
              <div className="rounded-lg overflow-hidden border border-border">
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={answer}
                  onChange={v => setAnswer(v || '')}
                  theme="vs-dark"
                  options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Conditionally show submit button only after answer is provided */}
        {(() => {
          const hasAnswer = q.type === 'rearrange' 
            ? (sortItems && sortItems.length > 0)
            : (answer && answer.trim() !== '');
          
          if (!hasAnswer) {
            return (
              <div className="w-full h-12 flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {q.type === 'rearrange' ? 'Arrange the code lines to continue' : 'Select an answer to continue'}
                </p>
              </div>
            );
          }

          return (
            <Button 
              onClick={submitAnswer}
              disabled={submitting}
              className="w-full h-12 text-base font-semibold"
            >
              {submitting ? 'Submitting...' : currentIdx < questions.length - 1 ? 'Submit & Next' : 'Finish Competition'}
            </Button>
          );
        })()}
      </div>
    </div>
  );
};

export default TechnicalRound;
