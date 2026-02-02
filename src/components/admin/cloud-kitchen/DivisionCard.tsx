import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coffee, Sun, Sunset, Moon, Clock, Settings, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Division } from '@/hooks/useCloudKitchenDivisions';
import { formatSlotTime } from '@/hooks/useCloudKitchenSlots';

interface DivisionCardProps {
  division: Division;
  onManage: () => void;
  onEditTime: () => void;
}

const slotIcons: Record<string, React.ReactNode> = {
  breakfast: <Coffee className="h-6 w-6" />,
  lunch: <Sun className="h-6 w-6" />,
  evening_snacks: <Sunset className="h-6 w-6" />,
  dinner: <Moon className="h-6 w-6" />,
};

const slotColors: Record<string, string> = {
  breakfast: 'from-amber-500 to-orange-500',
  lunch: 'from-orange-500 to-red-500',
  evening_snacks: 'from-purple-500 to-pink-500',
  dinner: 'from-indigo-500 to-purple-500',
};

const DivisionCard: React.FC<DivisionCardProps> = ({
  division,
  onManage,
  onEditTime,
}) => {
  const gradientClass = slotColors[division.slot_type] || 'from-gray-500 to-gray-600';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className={cn('bg-gradient-to-r p-4 text-white', gradientClass)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2">
              {slotIcons[division.slot_type] || <Clock className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="font-bold text-lg">{division.name}</h3>
              <p className="text-white/80 text-sm">
                {formatSlotTime(division.start_time)} - {formatSlotTime(division.end_time)}
              </p>
            </div>
          </div>
          <Badge
            variant={division.is_active ? 'secondary' : 'outline'}
            className={cn(
              'text-xs',
              division.is_active
                ? 'bg-white/20 text-white border-white/30'
                : 'bg-red-500/20 text-white border-red-300'
            )}
          >
            {division.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <UtensilsCrossed className="h-4 w-4" />
            <span>{division.food_items_count || 0} items</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Cutoff: {division.cutoff_hours_before}h before</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onEditTime}
          >
            <Settings className="h-4 w-4 mr-1" />
            Time Settings
          </Button>
          <Button size="sm" className="flex-1" onClick={onManage}>
            Manage Items
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DivisionCard;
