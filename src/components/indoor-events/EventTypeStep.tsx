import React from 'react';
import { Button } from '@/components/ui/button';
import EventTypeSelector from '@/components/events/EventTypeSelector';
import type { EventType } from '@/types/events';

interface EventTypeStepProps {
  selectedEventType: EventType | null;
  onSelect: (eventType: EventType) => void;
  onNext: () => void;
}

const EventTypeStep: React.FC<EventTypeStepProps> = ({
  selectedEventType,
  onSelect,
  onNext,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-display font-bold">What's the Occasion?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the type of event you're planning
        </p>
      </div>

      <EventTypeSelector
        selectedEventType={selectedEventType}
        onSelect={onSelect}
      />

      <Button
        className="w-full bg-indoor-events hover:bg-indoor-events/90"
        size="lg"
        onClick={onNext}
        disabled={!selectedEventType}
      >
        Continue
      </Button>
    </div>
  );
};

export default EventTypeStep;
