import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateDivision } from '@/hooks/useCloudKitchenDivisions';

interface CreateDivisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateDivisionDialog: React.FC<CreateDivisionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState('');
  const [slotType, setSlotType] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [cutoffHours, setCutoffHours] = useState(2);

  const createDivision = useCreateDivision();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createDivision.mutateAsync({
      name,
      slot_type: slotType || name,
      start_time: startTime,
      end_time: endTime,
      cutoff_hours_before: cutoffHours,
    });

    // Reset form
    setName('');
    setSlotType('');
    setStartTime('08:00');
    setEndTime('10:00');
    setCutoffHours(2);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Division</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Division Name</Label>
            <Input
              id="name"
              placeholder="e.g., Breakfast, Lunch, Dinner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slotType">Slot Type (for icon)</Label>
            <Input
              id="slotType"
              placeholder="breakfast, lunch, dinner, evening_snacks"
              value={slotType}
              onChange={(e) => setSlotType(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use: breakfast, lunch, evening_snacks, or dinner for icons
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cutoff">Cutoff Hours Before</Label>
            <Input
              id="cutoff"
              type="number"
              min="0"
              max="24"
              value={cutoffHours}
              onChange={(e) => setCutoffHours(parseInt(e.target.value) || 0)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Orders close this many hours before the slot starts
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDivision.isPending}>
              {createDivision.isPending ? 'Creating...' : 'Create Division'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDivisionDialog;
