import { Medication } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Pill, Check } from 'lucide-react';

interface MedicationCardProps {
  medication: Medication;
  scheduledTime: string;
  onMarkTaken: () => void;
  isTaken?: boolean;
}

const MedicationCard = ({ 
  medication, 
  scheduledTime, 
  onMarkTaken, 
  isTaken = false 
}: MedicationCardProps) => {
  return (
    <Card className={`p-6 shadow-card transition-all ${
      isTaken ? 'bg-success/10 border-success' : 'bg-card'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="text-primary" size={24} />
            <h3 className="text-2xl font-bold text-foreground">{medication.name}</h3>
          </div>
          <p className="text-xl text-muted-foreground mb-1">Dose: {medication.dose}</p>
          <div className="flex items-center gap-2 text-lg text-muted-foreground">
            <Clock size={18} />
            <span>{scheduledTime}</span>
          </div>
        </div>
        {isTaken && (
          <div className="bg-success text-success-foreground rounded-full p-3">
            <Check size={28} strokeWidth={3} />
          </div>
        )}
      </div>

      {medication.instructions && (
        <p className="text-base text-muted-foreground mb-4 p-3 bg-muted rounded-lg">
          {medication.instructions}
        </p>
      )}

      {!isTaken && (
        <Button 
          onClick={onMarkTaken}
          size="lg"
          className="w-full text-xl py-6 bg-gradient-success hover:opacity-90 transition-opacity"
        >
          <Check size={24} className="mr-2" />
          Mark as Taken
        </Button>
      )}
    </Card>
  );
};

export default MedicationCard;
