import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudent } from '@/contexts/StudentContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Zap, Shield, Trophy } from 'lucide-react';
import { isAdmin } from '@/data/admins';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const { setStudent } = useStudent();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNo.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // Validate credentials against database
      const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('reg_no', regNo.trim())
        .maybeSingle();

      if (error) throw error;

      // Check if student exists
      if (!student) {
        toast({ 
          title: '❌ Invalid Register Number', 
          description: 'Register number not found. Contact admin.',
          variant: 'destructive' 
        });
        setLoading(false);
        return;
      }

      // Validate name matches (case-insensitive)
      if (student.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
        toast({ 
          title: '❌ Name Mismatch', 
          description: 'Name does not match register number.',
          variant: 'destructive' 
        });
        setLoading(false);
        return;
      }

      // Login successful
      setStudent(student);
      
      // Check if user is an admin
      if (isAdmin(student.reg_no)) {
        toast({ title: '👑 Admin Access', description: `Welcome Admin ${student.name}` });
        navigate('/admin');
      } else {
        toast({ title: '✅ Login Successful', description: `Welcome ${student.name}!` });
        
        // Check which test is active and redirect accordingly
        const { data: control } = await supabase
          .from('test_control')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (control?.aptitude_active) {
          navigate('/aptitude');
        } else if (control?.technical_active) {
          navigate('/technical');
        } else {
          // No test active, show leaderboard
          navigate('/leaderboard');
        }
      }
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Tech Competition 2026</span>
          </div>
          <h1 className="text-4xl font-bold text-glow text-foreground tracking-tight">
            IT TECH ARENA
          </h1>
          <p className="text-muted-foreground mt-2">Battle of minds. Code to conquer.</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card-arena p-8"
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg" className="text-foreground font-medium">Register Number</Label>
              <Input
                id="reg"
                value={regNo}
                onChange={e => setRegNo(e.target.value)}
                placeholder="Enter your register number"
                className="bg-secondary/50 border-border"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold">
              {loading ? 'Logging in...' : 'Enter the Arena'}
            </Button>
          </form>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-6 mt-6 text-muted-foreground text-xs"
        >
          <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />Anti-Cheat</div>
          <div className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" />Live Rankings</div>
          <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" />Real-time</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
