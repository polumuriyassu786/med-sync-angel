import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Medication } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const AddMedication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    frequency: 'daily',
    instructions: '',
  });
  const [times, setTimes] = useState<string[]>(['09:00']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dose || times.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      ...formData,
      times: times.sort(),
      startDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    storage.addMedication(medication);
    toast.success('Medication added successfully!');
    navigate('/');
  };

  const addTime = () => {
    setTimes([...times, '09:00']);
  };

  const removeTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground mb-6">Add New Medicine</h2>
      
      <Card className="p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold mb-2 block">
              Medicine Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Aspirin"
              className="text-lg h-14"
              required
            />
          </div>

          <div>
            <Label htmlFor="dose" className="text-lg font-semibold mb-2 block">
              Dosage *
            </Label>
            <Input
              id="dose"
              value={formData.dose}
              onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
              placeholder="e.g., 100mg, 2 tablets"
              className="text-lg h-14"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency" className="text-lg font-semibold mb-2 block">
              Frequency
            </Label>
            <select
              id="frequency"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full h-14 text-lg px-4 rounded-lg border border-input bg-background"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as-needed">As Needed</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-lg font-semibold">Times *</Label>
              <Button type="button" onClick={addTime} variant="outline" size="sm" className="gap-2">
                <Plus size={16} />
                Add Time
              </Button>
            </div>
            <div className="space-y-3">
              {times.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(index, e.target.value)}
                    className="text-lg h-14 flex-1"
                    required
                  />
                  {times.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeTime(index)}
                      variant="destructive"
                      size="icon"
                      className="h-14 w-14"
                    >
                      <X size={20} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="instructions" className="text-lg font-semibold mb-2 block">
              Instructions
            </Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g., Take with food"
              className="text-lg min-h-28"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="flex-1 text-lg py-6"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="lg" 
              className="flex-1 text-lg py-6 bg-gradient-primary"
            >
              Add Medicine
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddMedication;
