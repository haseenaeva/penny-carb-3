import React, { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { useUpdateDivision, useDeleteDivision, type Division } from '@/hooks/useCloudKitchenDivisions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface EditTimeSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division: Division | null;
}

const EditTimeSlotDialog: React.FC<EditTimeSlotDialogProps> = ({
  open,
  onOpenChange,
  division,
}) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [cutoffHours, setCutoffHours] = useState(2);
  const [isActive, setIsActive] = useState(true);

  const updateDivision = useUpdateDivision();
  const deleteDivision = useDeleteDivision();

  useEffect(() => {
    if (division) {
      setName(division.name);
      setStartTime(division.start_time.slice(0, 5));
      setEndTime(division.end_time.slice(0, 5));
      setCutoffHours(division.cutoff_hours_before);
      setIsActive(division.is_active);
    }
  }, [division]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!division) return;

    await updateDivision.mutateAsync({
      id: division.id,
      name,
      start_time: startTime,
      end_time: endTime,
      cutoff_hours_before: cutoffHours,
      is_active: isActive,
    });

    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!division) return;
    await deleteDivision.mutateAsync(division.id);
    onOpenChange(false);
  };

  if (!division) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Time Slot - {division.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Division Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startTime">Start Time</Label>
              <Input
                id="edit-startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endTime">End Time</Label>
              <Input
                id="edit-endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cutoff">Cutoff Hours Before</Label>
            <Input
              id="edit-cutoff"
              type="number"
              min="0"
              max="24"
              value={cutoffHours}
              onChange={(e) => setCutoffHours(parseInt(e.target.value) || 0)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Orders close {cutoffHours} hours before slot starts
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="is-active">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Inactive divisions won't appear for customers
              </p>
            </div>
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Division?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the "{division.name}" division. 
                    Food items assigned to this division will be unassigned.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateDivision.isPending}>
                {updateDivision.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeSlotDialog;
