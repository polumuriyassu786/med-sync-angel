import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { UserProfile } from '@/types/medication';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { User, Heart, Phone } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 65,
    caregiverName: '',
    caregiverContact: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.name || !profile.age) {
      toast.error('Please fill in required fields');
      return;
    }

    storage.saveProfile(profile);
    setIsEditing(false);
    toast.success('Profile saved successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-primary" size={32} />
        <h2 className="text-3xl font-bold text-foreground">My Profile</h2>
      </div>

      <Card className="p-6 shadow-card">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-lg font-semibold mb-2 block">
              Full Name *
            </Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="text-lg h-14"
              disabled={!isEditing}
              required
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-lg font-semibold mb-2 block">
              Age *
            </Label>
            <Input
              id="age"
              type="number"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
              className="text-lg h-14"
              disabled={!isEditing}
              required
            />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-secondary" size={24} />
              <h3 className="text-xl font-bold text-foreground">Caregiver Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="caregiverName" className="text-lg font-semibold mb-2 block">
                  Caregiver Name
                </Label>
                <Input
                  id="caregiverName"
                  value={profile.caregiverName}
                  onChange={(e) => setProfile({ ...profile, caregiverName: e.target.value })}
                  placeholder="Enter caregiver name"
                  className="text-lg h-14"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="caregiverContact" className="text-lg font-semibold mb-2 block">
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>Caregiver Contact</span>
                  </div>
                </Label>
                <Input
                  id="caregiverContact"
                  type="tel"
                  value={profile.caregiverContact}
                  onChange={(e) => setProfile({ ...profile, caregiverContact: e.target.value })}
                  placeholder="Phone or email"
                  className="text-lg h-14"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 text-lg py-6"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="flex-1 text-lg py-6 bg-gradient-primary"
                >
                  Save Profile
                </Button>
              </>
            ) : (
              <Button 
                type="button"
                size="lg" 
                className="w-full text-lg py-6 bg-gradient-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
