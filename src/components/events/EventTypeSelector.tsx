import React from 'react';
import { useEventTypes } from '@/hooks/useEventTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { EventType } from '@/types/events';

interface EventTypeSelectorProps {
  selectedEventType: EventType | null;
  onSelect: (eventType: EventType) => void;
}

const EventTypeSelector: React.FC<EventTypeSelectorProps> = ({
  selectedEventType,
  onSelect,
}) => {
  const { data: eventTypes, isLoading } = useEventTypes();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Select Event Type</h3>
      <div className="grid grid-cols-2 gap-3">
        {eventTypes?.map((eventType) => (
          <Card
            key={eventType.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedEventType?.id === eventType.id
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => onSelect(eventType)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <span className="text-3xl mb-2">{eventType.icon}</span>
              <span className="font-medium text-sm">{eventType.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventTypeSelector;
