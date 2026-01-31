import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Sparkles, Wallet } from 'lucide-react';
import type { SelectedFood, SelectedService } from '@/pages/IndoorEventsPlanner';

interface EventModelsStepProps {
  guestCount: number;
  onApplyModel: (foods: SelectedFood[], services: SelectedService[]) => void;
  onNext: () => void;
  onBack: () => void;
}

// Predefined event models
const EVENT_MODELS = [
  {
    id: 'popular-birthday',
    name: 'Most Chosen for Birthday – 50 Guests',
    description: 'Perfect balance of variety and value',
    icon: '🎂',
    badge: 'Popular',
    badgeColor: 'bg-indoor-events',
    foods: [
      { id: 'biryani', name: 'Chicken Biryani', price: 150, quantity: 1, category: 'Main Course' },
      { id: 'paneer', name: 'Paneer Butter Masala', price: 120, quantity: 1, category: 'Main Course' },
      { id: 'samosa', name: 'Samosa', price: 30, quantity: 2, category: 'Starters' },
      { id: 'gulab-jamun', name: 'Gulab Jamun', price: 40, quantity: 1, category: 'Desserts' },
    ],
    services: [
      { id: 'serving-staff', name: 'Serving Staff', price: 25, priceType: 'per_guest' as const, enabled: true },
      { id: 'decoration', name: 'Decoration', price: 5000, priceType: 'fixed' as const, enabled: true },
    ],
  },
  {
    id: 'low-budget',
    name: 'Low Budget Model',
    description: 'Essential items for budget-conscious events',
    icon: '💰',
    badge: 'Budget Friendly',
    badgeColor: 'bg-success',
    foods: [
      { id: 'veg-biryani', name: 'Veg Biryani', price: 100, quantity: 1, category: 'Main Course' },
      { id: 'dal-fry', name: 'Dal Fry', price: 60, quantity: 1, category: 'Main Course' },
      { id: 'raita', name: 'Raita', price: 25, quantity: 1, category: 'Sides' },
    ],
    services: [
      { id: 'rental-vessels', name: 'Rental Vessels', price: 15, priceType: 'per_guest' as const, enabled: true },
    ],
  },
  {
    id: 'premium',
    name: 'Premium Event Model',
    description: 'Full-service luxury experience',
    icon: '👑',
    badge: 'Premium',
    badgeColor: 'bg-amber-500',
    foods: [
      { id: 'mutton-biryani', name: 'Mutton Biryani', price: 250, quantity: 1, category: 'Main Course' },
      { id: 'butter-chicken', name: 'Butter Chicken', price: 180, quantity: 1, category: 'Main Course' },
      { id: 'paneer-tikka', name: 'Paneer Tikka', price: 140, quantity: 1, category: 'Starters' },
      { id: 'chicken-kebab', name: 'Chicken Kebab', price: 160, quantity: 1, category: 'Starters' },
      { id: 'ice-cream', name: 'Ice Cream', price: 50, quantity: 1, category: 'Desserts' },
      { id: 'rasmalai', name: 'Rasmalai', price: 60, quantity: 1, category: 'Desserts' },
    ],
    services: [
      { id: 'live-counter', name: 'Live Counter', price: 50, priceType: 'per_guest' as const, enabled: true },
      { id: 'decoration', name: 'Decoration', price: 5000, priceType: 'fixed' as const, enabled: true },
      { id: 'serving-staff', name: 'Serving Staff', price: 25, priceType: 'per_guest' as const, enabled: true },
      { id: 'dj-music', name: 'DJ / Music', price: 8000, priceType: 'fixed' as const, enabled: true },
    ],
  },
];

const EventModelsStep: React.FC<EventModelsStepProps> = ({
  guestCount,
  onApplyModel,
  onNext,
  onBack,
}) => {
  const calculateModelTotal = (model: typeof EVENT_MODELS[0]) => {
    const foodTotal = model.foods.reduce(
      (sum, f) => sum + f.price * f.quantity * guestCount,
      0
    );
    const serviceTotal = model.services.reduce((sum, s) => {
      if (s.priceType === 'per_guest') {
        return sum + s.price * guestCount;
      }
      return sum + s.price;
    }, 0);
    return foodTotal + serviceTotal;
  };

  const handleApplyModel = (model: typeof EVENT_MODELS[0]) => {
    onApplyModel(model.foods, model.services);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-display font-bold">Suggested Event Models</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Quick-start with pre-configured packages
        </p>
      </div>

      <div className="space-y-4">
        {EVENT_MODELS.map((model) => {
          const total = calculateModelTotal(model);
          const perPerson = Math.round(total / guestCount);

          return (
            <Card key={model.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{model.icon}</span>
                    <div>
                      <CardTitle className="text-base">{model.name}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={model.badgeColor + ' text-white'}>
                    {model.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Food Items */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Food Items:</p>
                  <div className="flex flex-wrap gap-1">
                    {model.foods.map((food) => (
                      <Badge key={food.id} variant="outline" className="text-xs">
                        {food.name} ×{food.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {model.services.map((service) => (
                      <Badge key={service.id} variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        {service.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      For {guestCount} guests
                    </p>
                    <p className="text-lg font-bold text-indoor-events">
                      ₹{total.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{perPerson}/person
                    </p>
                  </div>
                  <Button
                    onClick={() => handleApplyModel(model)}
                    className="bg-indoor-events hover:bg-indoor-events/90"
                  >
                    Apply This Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Or continue with your custom selection
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            className="flex-1 border-indoor-events text-indoor-events hover:bg-indoor-events hover:text-white"
          >
            Skip & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventModelsStep;
