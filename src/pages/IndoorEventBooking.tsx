import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarDays, Users, MapPin, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import EventTypeSelector from '@/components/events/EventTypeSelector';
import PackageSelector from '@/components/events/PackageSelector';
import BottomNav from '@/components/customer/BottomNav';
import type { EventType, Package, OrderType } from '@/types/events';

const IndoorEventBooking: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { selectedPanchayat, selectedWardNumber } = useLocation();

  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('food_only');
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState<number>(10);
  const [eventDetails, setEventDetails] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Minimum date is tomorrow
  const minDate = addDays(startOfDay(new Date()), 1);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedEventType || !selectedPackage || !eventDate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (isBefore(eventDate, minDate)) {
      toast({
        title: "Invalid Date",
        description: "Event must be at least 1 day in advance",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPanchayat || !selectedWardNumber) {
      toast({
        title: "Location Required",
        description: "Please select your delivery location",
        variant: "destructive",
      });
      return;
    }

    // Navigate to menu with event context
    navigate(`/menu/indoor_events`, {
      state: {
        eventTypeId: selectedEventType.id,
        packageId: selectedPackage.id,
        orderType,
        eventDate: eventDate.toISOString(),
        guestCount,
        eventDetails,
        deliveryAddress,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Book Indoor Event</h1>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Info Banner */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Advance booking required
              </p>
              <p className="text-amber-700 dark:text-amber-300">
                Orders must be placed minimum 1 day in advance. Advance payment is mandatory.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Event Type Selection */}
        <EventTypeSelector
          selectedEventType={selectedEventType}
          onSelect={setSelectedEventType}
        />

        {/* Order Type */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Choose Service</h3>
          <RadioGroup
            value={orderType}
            onValueChange={(value) => setOrderType(value as OrderType)}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="food_only"
              className={cn(
                "flex items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all",
                orderType === 'food_only'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="food_only" id="food_only" className="sr-only" />
              <div className="text-center">
                <span className="text-2xl mb-1 block">🍽️</span>
                <span className="font-medium text-sm">Food Only</span>
              </div>
            </Label>
            <Label
              htmlFor="full_event"
              className={cn(
                "flex items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all",
                orderType === 'full_event'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="full_event" id="full_event" className="sr-only" />
              <div className="text-center">
                <span className="text-2xl mb-1 block">🎊</span>
                <span className="font-medium text-sm">Full Event</span>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {/* Package Selection */}
        <PackageSelector
          selectedPackage={selectedPackage}
          onSelect={setSelectedPackage}
        />

        {/* Event Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    disabled={(date) => isBefore(date, minDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guest Count */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Input
                type="number"
                min={selectedPackage?.min_guests || 10}
                max={selectedPackage?.max_guests || 500}
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 10)}
              />
              {selectedPackage && (
                <p className="text-xs text-muted-foreground">
                  Min: {selectedPackage.min_guests} | Max: {selectedPackage.max_guests} guests
                </p>
              )}
            </div>

            {/* Event Details */}
            <div className="space-y-2">
              <Label>Special Instructions (Optional)</Label>
              <Textarea
                placeholder="Any special requirements or instructions..."
                value={eventDetails}
                onChange={(e) => setEventDetails(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Event Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Full Address</Label>
              <Textarea
                placeholder="Enter complete venue/delivery address..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              {selectedPanchayat && selectedWardNumber && (
                <p className="text-xs text-muted-foreground">
                  📍 Ward {selectedWardNumber}, {selectedPanchayat.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!selectedEventType || !selectedPackage || !eventDate}
        >
          Continue to Menu
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default IndoorEventBooking;
