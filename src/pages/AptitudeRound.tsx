import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudent } from '@/contexts/StudentContext';
import { supabase } from '@/integrations/supabase/client';
import { useTimer } from '@/hooks/useTimer';
import { useTabDetection } from '@/hooks/useTabDetection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  content: string;
  options: string[];
  correct_answer: string;
  marks: number;
  image_url?: string;
}

const AptitudeRound = () => {
  const { student } = useStudent();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useTabDetection(student?.id);

  useEffect(() => {
    if (!student) { navigate('/'); return; }
    supabase
      .from('questions')
      .select('*')
      .eq('round', 'aptitude')
      .then(({ data }) => {
        if (data && data.length > 0) setQuestions(data as Question[]);
        else setQuestions([]);
        setLoading(false);
      });
  }, [student, navigate]);

  const submitAnswer = useCallback(async () => {
    if (!student || submitting || finished) return;
    setSubmitting(true);
    const q = questions[currentIdx];
    if (!q) return;

    const answer = selected || '';
    const isCorrect = answer === q.correct_answer;
    const questionScore = isCorrect ? q.marks : 0;

    await supabase.from('submissions').insert({
      student_id: student.id,
      question_id: q.id,
      answer,
      score: questionScore,
      time_taken: 60 - timeLeft,
    });

    const newScore = score + questionScore;
    setScore(newScore);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      reset(60);
    } else {
      // Update leaderboard
      await supabase
        .from('leaderboard')
        .update({ aptitude_score: newScore, total_score: newScore })
        .eq('student_id', student.id);
      setFinished(true);
      toast({ title: '🎉 Round Complete!', description: `You scored ${newScore} points in the Aptitude Round.` });
    }
    setSubmitting(false);
  }, [student, selected, currentIdx, questions, score, finished, submitting]);

  const { timeLeft, reset, percentage } = useTimer(60, submitAnswer);

  if (!student) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading questions...</p>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center">
        <div className="card-arena p-8 text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">No Questions Available</h2>
          <p className="text-muted-foreground">The aptitude round hasn't been set up yet. Please contact the admin.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-arena p-8 text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Aptitude Round Complete!</h2>
          <p className="text-3xl font-bold text-primary mb-4">{score} Points</p>
          <p className="text-muted-foreground mb-6">Wait for the admin to unlock the Technical Round.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/leaderboard')} variant="outline">View Leaderboard</Button>
            <Button onClick={() => navigate('/technical')}>
              Technical Round <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen bg-background bg-grid p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Aptitude Round</p>
            <p className="text-xs text-muted-foreground">Question {currentIdx + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
            <Clock className="w-4 h-4 text-destructive" />
            <span className={`font-mono font-bold text-sm ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Progress */}
        <Progress value={(currentIdx / questions.length) * 100} className="mb-6 h-2" />

        {/* Timer bar */}
        <div className="w-full h-1 bg-secondary rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="card-arena p-6 mb-6"
          >
            {q.image_url && (
              <img src={q.image_url} alt="Question" className="w-full max-h-60 object-contain rounded-lg mb-4 bg-secondary/50" />
            )}
            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {q.content}
            </h2>
            <div className="space-y-3">
              {q.options?.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelected(opt)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selected === opt
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-secondary/30 text-foreground hover:border-primary/40 hover:bg-secondary/60'
                  }`}
                >
                  <span className="font-mono text-xs text-muted-foreground mr-3">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Button
          onClick={submitAnswer}
          disabled={submitting}
          className="w-full h-12 text-base font-semibold"
        >
          {submitting ? 'Submitting...' : currentIdx < questions.length - 1 ? 'Submit & Next' : 'Finish Round'}
        </Button>
      </div>
    </div>
  );
};

export default AptitudeRound;
