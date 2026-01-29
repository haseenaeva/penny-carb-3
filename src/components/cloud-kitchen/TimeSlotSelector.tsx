import React from 'react';
import { useCloudKitchenSlots, isSlotAvailable, getTimeUntilCutoff, formatSlotTime } from '@/hooks/useCloudKitchenSlots';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, AlertCircle, Coffee, Sun, Moon, Sunset } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CloudKitchenSlot } from '@/types/events';

interface TimeSlotSelectorProps {
  selectedSlot: CloudKitchenSlot | null;
  onSelect: (slot: CloudKitchenSlot) => void;
}

const slotIcons: Record<string, React.ReactNode> = {
  'breakfast': <Coffee className="h-5 w-5" />,
  'lunch': <Sun className="h-5 w-5" />,
  'evening_snacks': <Sunset className="h-5 w-5" />,
  'dinner': <Moon className="h-5 w-5" />,
};

const slotColors: Record<string, string> = {
  'breakfast': 'bg-amber-100 text-amber-600',
  'lunch': 'bg-orange-100 text-orange-600',
  'evening_snacks': 'bg-purple-100 text-purple-600',
  'dinner': 'bg-indigo-100 text-indigo-600',
};

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedSlot,
  onSelect,
}) => {
  const { data: slots, isLoading } = useCloudKitchenSlots();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Select Time Slot</h3>
      <div className="grid grid-cols-2 gap-3">
        {slots?.map((slot) => {
          const available = isSlotAvailable(slot);
          const timeRemaining = getTimeUntilCutoff(slot);

          return (
            <Card
              key={slot.id}
              className={cn(
                "transition-all",
                available ? "cursor-pointer hover:shadow-md" : "opacity-50 cursor-not-allowed",
                selectedSlot?.id === slot.id && available
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : available ? "hover:border-primary/50" : ""
              )}
              onClick={() => available && onSelect(slot)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className={cn(
                    "p-3 rounded-full mb-2",
                    slotColors[slot.slot_type] || 'bg-muted text-muted-foreground'
                  )}>
                    {slotIcons[slot.slot_type] || <Clock className="h-5 w-5" />}
                  </div>
                  <span className="font-semibold">{slot.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatSlotTime(slot.start_time)} - {formatSlotTime(slot.end_time)}
                  </span>
                  
                  <div className="mt-2">
                    {available ? (
                      timeRemaining && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeRemaining.hours}h {timeRemaining.minutes}m left
                        </Badge>
                      )
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Closed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
