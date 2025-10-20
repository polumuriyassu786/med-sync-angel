import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { Medication, MedicationLog } from '@/types/medication';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Pill, Check, X } from 'lucide-react';

const Schedule = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);

  useEffect(() => {
    setMedications(storage.getMedications());
    setLogs(storage.getLogs());
  }, []);

  const getWeekSchedule = () => {
    const today = new Date();
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      weekDays.push(date);
    }

    return weekDays;
  };

  const getDaySchedule = (date: Date) => {
    const dateStr = date.toDateString();
    const schedule: Array<{ 
      medication: Medication; 
      time: string; 
      status: 'pending' | 'taken' | 'missed' 
    }> = [];

    medications.forEach(med => {
      med.times.forEach(time => {
        const scheduledDateTime = new Date(`${dateStr} ${time}`);
        const log = logs.find(l => 
          l.medicationId === med.id && 
          new Date(l.scheduledTime).toDateString() === dateStr &&
          new Date(l.scheduledTime).toTimeString().slice(0, 5) === time
        );

        const isPast = scheduledDateTime < new Date();
        const status = log?.status || (isPast ? 'missed' : 'pending');
        
        schedule.push({ medication: med, time, status });
      });
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  };

  const weekDays = getWeekSchedule();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-primary" size={32} />
        <h2 className="text-3xl font-bold text-foreground">Weekly Schedule</h2>
      </div>

      <div className="space-y-6">
        {weekDays.map((date, index) => {
          const daySchedule = getDaySchedule(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <Card 
              key={index} 
              className={`p-6 shadow-card ${isToday ? 'border-2 border-primary' : ''}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold ${
                  isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {date.getDate()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h3>
                  <p className="text-muted-foreground">
                    {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {daySchedule.length === 0 ? (
                <p className="text-lg text-muted-foreground text-center py-4">
                  No medications scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {daySchedule.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-background rounded-lg"
                    >
                      <div className={`rounded-full p-2 ${
                        item.status === 'taken' ? 'bg-success/20 text-success' :
                        item.status === 'missed' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {item.status === 'taken' ? <Check size={20} /> :
                         item.status === 'missed' ? <X size={20} /> :
                         <Pill size={20} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{item.medication.name}</p>
                        <p className="text-muted-foreground">{item.medication.dose}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={18} />
                        <span className="font-medium">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
