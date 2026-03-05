import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Trophy, AlertTriangle, FileWarning, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [violations, setViolations] = useState<any[]>([]);
  const [plagiarism, setPlagiarism] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  const fetchAll = async () => {
    const [s, l, v, p, sub] = await Promise.all([
      supabase.from('students').select('*').order('login_time', { ascending: false }),
      supabase.from('leaderboard').select('*, students(name, reg_no)').order('total_score', { ascending: false }),
      supabase.from('violations').select('*, students(name, reg_no)').order('timestamp', { ascending: false }),
      supabase.from('plagiarism_logs').select('*').order('timestamp', { ascending: false }),
      supabase.from('submissions').select('*, students(name, reg_no), questions(content, round, type)').order('created_at', { ascending: false }).limit(100),
    ]);
    setStudents(s.data || []);
    setLeaderboard((l.data || []).map((e: any, i: number) => ({ ...e, rank: i + 1 })));
    setViolations(v.data || []);
    setPlagiarism(p.data || []);
    setSubmissions(sub.data || []);
  };

  useEffect(() => {
    fetchAll();
    const ch = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, fetchAll)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'violations' }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground text-glow">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={fetchAll}>Refresh</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Students', value: students.length, icon: Users, color: 'text-primary' },
            { label: 'Submissions', value: submissions.length, icon: ClipboardList, color: 'text-accent' },
            { label: 'Violations', value: violations.length, icon: AlertTriangle, color: 'text-destructive' },
            { label: 'Plagiarism Flags', value: plagiarism.length, icon: FileWarning, color: 'text-destructive' },
          ].map(s => (
            <Card key={s.label} className="card-arena">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon className={`w-8 h-8 ${s.color} opacity-50`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="leaderboard">
          <TabsList className="bg-secondary/50 mb-6">
            <TabsTrigger value="leaderboard"><Trophy className="w-4 h-4 mr-1" />Leaderboard</TabsTrigger>
            <TabsTrigger value="students"><Users className="w-4 h-4 mr-1" />Students</TabsTrigger>
            <TabsTrigger value="submissions"><ClipboardList className="w-4 h-4 mr-1" />Submissions</TabsTrigger>
            <TabsTrigger value="violations"><AlertTriangle className="w-4 h-4 mr-1" />Violations</TabsTrigger>
            <TabsTrigger value="plagiarism"><FileWarning className="w-4 h-4 mr-1" />Plagiarism</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <div className="card-arena overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Rank</TableHead><TableHead>Name</TableHead><TableHead>Reg No</TableHead><TableHead className="text-right">Aptitude</TableHead><TableHead className="text-right">Technical</TableHead><TableHead className="text-right">Total</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((e: any) => (
                    <TableRow key={e.student_id}>
                      <TableCell className="font-bold">#{e.rank}</TableCell>
                      <TableCell>{e.students?.name}</TableCell>
                      <TableCell className="font-mono text-sm">{e.students?.reg_no}</TableCell>
                      <TableCell className="text-right">{e.aptitude_score}</TableCell>
                      <TableCell className="text-right">{e.technical_score}</TableCell>
                      <TableCell className="text-right font-bold text-primary">{e.total_score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <div className="card-arena overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Name</TableHead><TableHead>Reg No</TableHead><TableHead>Login Time</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell className="font-mono text-sm">{s.reg_no}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(s.login_time).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="card-arena overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Student</TableHead><TableHead>Question</TableHead><TableHead>Round</TableHead><TableHead>Answer</TableHead><TableHead className="text-right">Score</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.students?.name}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm">{s.questions?.content}</TableCell>
                      <TableCell className="capitalize text-sm">{s.questions?.round}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm font-mono">{s.answer}</TableCell>
                      <TableCell className="text-right font-bold">{s.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="violations">
            <div className="card-arena overflow-hidden">
              {violations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No violations detected.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Student</TableHead><TableHead>Reg No</TableHead><TableHead>Type</TableHead><TableHead>Time</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {violations.map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell>{v.students?.name}</TableCell>
                        <TableCell className="font-mono text-sm">{v.students?.reg_no}</TableCell>
                        <TableCell><span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-semibold">{v.type}</span></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(v.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="plagiarism">
            <div className="card-arena overflow-hidden">
              {plagiarism.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No plagiarism detected.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Student 1</TableHead><TableHead>Student 2</TableHead><TableHead>Similarity</TableHead><TableHead>Time</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {plagiarism.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-sm">{p.student1}</TableCell>
                        <TableCell className="font-mono text-sm">{p.student2}</TableCell>
                        <TableCell><span className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-bold">{Number(p.similarity).toFixed(1)}%</span></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(p.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
