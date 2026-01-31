import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Zap, Calculator, CalendarHeart, AlertCircle } from 'lucide-react';
import BottomNav from '@/components/customer/BottomNav';

const IndoorEvents: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-indoor-events text-white">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CalendarHeart className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Indoor Events</h1>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Plan Your Perfect Event
          </h2>
          <p className="text-muted-foreground">
            From intimate gatherings to grand celebrations, we've got you covered.
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-indoor-events/30 bg-indoor-events/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-indoor-events shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                All bookings require admin approval
              </p>
              <p className="text-muted-foreground">
                No instant payment. Get quotation first, then confirm with advance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Choose Your Booking Style
          </h3>

          {/* Quick Booking Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-indoor-events/50 group"
            onClick={() => navigate('/indoor-events/quick-booking')}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indoor-events/10 text-indoor-events group-hover:bg-indoor-events group-hover:text-white transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Quick Booking</CardTitle>
                  <CardDescription>
                    Simple & fast for those who trust us
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  Just fill basic event details
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  No dish-level selection required
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  Admin will send you a quotation
                </li>
              </ul>
              <Button 
                className="w-full mt-4 bg-indoor-events hover:bg-indoor-events/90"
                variant="default"
              >
                Quick Booking
              </Button>
            </CardContent>
          </Card>

          {/* Planning & Budget Builder Card */}
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:border-indoor-events/50 group border-2 border-indoor-events/30"
            onClick={() => navigate('/indoor-events/planner')}
          >
            <div className="absolute -top-2 right-4">
              <span className="bg-indoor-events text-white text-xs px-2 py-1 rounded-full font-medium">
                Recommended
              </span>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indoor-events/10 text-indoor-events group-hover:bg-indoor-events group-hover:text-white transition-colors">
                  <Calculator className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Plan & Estimate Budget</CardTitle>
                  <CardDescription>
                    Build menu, add services, see instant pricing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  Choose dishes from our menu
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  Add services like decoration, staff
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  Real-time budget estimation
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indoor-events" />
                  Use suggested event models
                </li>
              </ul>
              <Button 
                className="w-full mt-4 bg-indoor-events hover:bg-indoor-events/90"
                variant="default"
              >
                Plan & Estimate Budget
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indoor-events/10 text-indoor-events text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Submit Your Request</p>
                  <p className="text-xs text-muted-foreground">Quick booking or detailed planning</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indoor-events/10 text-indoor-events text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Admin Reviews</p>
                  <p className="text-xs text-muted-foreground">We review and send final quotation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indoor-events/10 text-indoor-events text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Confirm & Pay Advance</p>
                  <p className="text-xs text-muted-foreground">Pay advance to confirm booking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indoor-events/10 text-indoor-events text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium text-sm">Enjoy Your Event</p>
                  <p className="text-xs text-muted-foreground">We handle everything on the day</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default IndoorEvents;
