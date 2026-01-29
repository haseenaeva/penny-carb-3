import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Clock, AlertCircle } from 'lucide-react';
import TimeSlotSelector from '@/components/cloud-kitchen/TimeSlotSelector';
import BottomNav from '@/components/customer/BottomNav';
import type { CloudKitchenSlot } from '@/types/events';
import { isSlotAvailable } from '@/hooks/useCloudKitchenSlots';

const CloudKitchenOrder: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedPanchayat, selectedWardNumber } = useLocation();

  const [selectedSlot, setSelectedSlot] = useState<CloudKitchenSlot | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

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

    if (!selectedSlot) {
      toast({
        title: "Select Time Slot",
        description: "Please select a delivery time slot",
        variant: "destructive",
      });
      return;
    }

    if (!isSlotAvailable(selectedSlot)) {
      toast({
        title: "Slot Closed",
        description: "This time slot is no longer available for orders",
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

    // Navigate to menu with cloud kitchen context
    navigate(`/menu/cloud_kitchen`, {
      state: {
        cloudKitchenSlotId: selectedSlot.id,
        slotName: selectedSlot.name,
        deliveryAddress,
        deliveryInstructions,
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
          <h1 className="text-lg font-semibold">Cloud Kitchen</h1>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Info Banner */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-blue-600 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Order before cut-off time
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Each slot closes 2 hours before delivery. Order early!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Slot Selection */}
        <TimeSlotSelector
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
        />

        {/* Delivery Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Info */}
            {selectedPanchayat && selectedWardNumber ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Ward {selectedWardNumber}, {selectedPanchayat.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Please select your location first</span>
              </div>
            )}

            {/* Address */}
            <div className="space-y-2">
              <Label>Delivery Address</Label>
              <Textarea
                placeholder="House name, landmark, street..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label>Delivery Instructions (Optional)</Label>
              <Textarea
                placeholder="Any special delivery instructions..."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={!selectedSlot || !selectedPanchayat || !selectedWardNumber}
        >
          Browse Menu
        </Button>
      </main>

      <BottomNav />
    </div>
  );
};

export default CloudKitchenOrder;
