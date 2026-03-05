import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';

interface LeaderboardEntry {
  student_id: string;
  aptitude_score: number;
  technical_score: number;
  total_score: number;
  rank: number;
  students: { name: string; reg_no: string } | null;
}

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('leaderboard')
      .select('*, students(name, reg_no)')
      .order('total_score', { ascending: false });
    if (data) {
      setEntries(data.map((e, i) => ({ ...e, rank: i + 1 })) as LeaderboardEntry[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    const channel = supabase
      .channel('leaderboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background bg-grid p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground text-glow flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" /> Live Leaderboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Real-time rankings • Updates automatically</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-accent text-xs font-semibold">● LIVE</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : entries.length === 0 ? (
          <div className="card-arena p-8 text-center">
            <p className="text-muted-foreground">No participants yet.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-arena overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Reg No</TableHead>
                  <TableHead className="text-right">Aptitude</TableHead>
                  <TableHead className="text-right">Technical</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {entries.map(e => (
                    <motion.tr
                      key={e.student_id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-border"
                    >
                      <TableCell>
                        <span className={`font-bold ${getRankStyle(e.rank)}`}>
                          {e.rank <= 3 ? <Medal className="w-5 h-5 inline" /> : `#${e.rank}`}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{e.students?.name || '—'}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{e.students?.reg_no || '—'}</TableCell>
                      <TableCell className="text-right">{e.aptitude_score}</TableCell>
                      <TableCell className="text-right">{e.technical_score}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{e.total_score}</TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
