import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarHeart } from 'lucide-react';

type Props = {
  title: string;
  children: React.ReactNode;
};

const IndoorEventsShell: React.FC<Props> = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-indoor-events text-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/indoor-events')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CalendarHeart className="h-6 w-6" />
            <h1 className="font-display text-lg font-semibold">{title}</h1>
          </div>
        </div>
      </header>

      <main className="p-4 pb-20">{children}</main>
    </div>
  );
};

export default IndoorEventsShell;
