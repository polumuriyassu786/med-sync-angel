import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Medication, MedicationLog } from '@/types/medication';
import MedicationCard from '@/components/MedicationCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todayLogs, setTodayLogs] = useState<MedicationLog[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const meds = storage.getMedications();
    setMedications(meds);
    
    const logs = storage.getLogs();
    const today = new Date().toDateString();
    setTodayLogs(logs.filter(log => 
      new Date(log.scheduledTime).toDateString() === today
    ));
  };

  const getTodaySchedule = () => {
    const today = new Date().toDateString();
    const schedule: Array<{ medication: Medication; time: string; log?: MedicationLog }> = [];

    medications.forEach(med => {
      med.times.forEach(time => {
        const scheduledDate = new Date(`${today} ${time}`);
        const log = todayLogs.find(l => 
          l.medicationId === med.id && 
          new Date(l.scheduledTime).toTimeString().slice(0, 5) === time
        );
        
        schedule.push({ medication: med, time, log });
      });
    });

    return schedule.sort((a, b) => {
      const timeA = new Date(`${today} ${a.time}`).getTime();
      const timeB = new Date(`${today} ${b.time}`).getTime();
      return timeA - timeB;
    });
  };

  const handleMarkTaken = (medication: Medication, time: string) => {
    const today = new Date().toDateString();
    const scheduledTime = new Date(`${today} ${time}`);
    
    const newLog: MedicationLog = {
      id: `${medication.id}-${scheduledTime.getTime()}`,
      medicationId: medication.id,
      scheduledTime: scheduledTime.toISOString(),
      takenAt: new Date().toISOString(),
      status: 'taken',
    };

    storage.addLog(newLog);
    loadData();
    toast.success(`Marked ${medication.name} as taken`);
  };

  const schedule = getTodaySchedule();
  const currentHour = currentTime.getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-2xl font-bold text-foreground mb-2">{greeting}!</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon size={20} />
          <p className="text-lg">{currentTime.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-foreground">Today's Schedule</h3>
        <Link to="/add">
          <Button size="lg" className="gap-2">
            <Plus size={20} />
            Add Medicine
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {schedule.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl shadow-card">
            <p className="text-xl text-muted-foreground mb-6">No medications scheduled</p>
            <Link to="/add">
              <Button size="lg" className="gap-2">
                <Plus size={20} />
                Add Your First Medicine
              </Button>
            </Link>
          </div>
        ) : (
          schedule.map(({ medication, time, log }, index) => (
            <MedicationCard
              key={`${medication.id}-${time}-${index}`}
              medication={medication}
              scheduledTime={time}
              onMarkTaken={() => handleMarkTaken(medication, time)}
              isTaken={log?.status === 'taken'}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
