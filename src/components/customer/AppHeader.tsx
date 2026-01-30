import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Search, User, ChevronDown, LogOut, ShoppingBag, Settings, Truck, Phone, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

const mobileSchema = z.object({
  mobileNumber: z.string()
    .min(10, 'Mobile number must be 10 digits')
    .max(10, 'Mobile number must be 10 digits')
    .regex(/^\d+$/, 'Mobile number must contain only digits'),
});

type MobileFormData = z.infer<typeof mobileSchema>;

interface AppHeaderProps {
  onSearch?: (query: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, profile, signOut, role, customerSignIn } = useAuth();
  const { 
    panchayats, 
    selectedPanchayat, 
    selectedWardNumber, 
    setSelectedPanchayat, 
    setSelectedWardNumber,
    getWardsForPanchayat 
  } = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [customerLoginOpen, setCustomerLoginOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotRegistered, setShowNotRegistered] = useState(false);
  const [attemptedMobile, setAttemptedMobile] = useState('');

  const mobileForm = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobileNumber: '',
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleCustomerLogin = async (data: MobileFormData) => {
    setIsSubmitting(true);
    setShowNotRegistered(false);
    try {
      const { error } = await customerSignIn(data.mobileNumber);
      if (error) {
        if (error.message.includes('not found') || error.message.includes('Invalid login')) {
          setAttemptedMobile(data.mobileNumber);
          setShowNotRegistered(true);
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully",
        });
        setCustomerLoginOpen(false);
        mobileForm.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToRegister = () => {
    setCustomerLoginOpen(false);
    navigate('/customer-auth', { state: { mobileNumber: attemptedMobile, tab: 'signup' } });
  };

  const handlePanchayatChange = (panchayatId: string) => {
    const panchayat = panchayats.find(p => p.id === panchayatId);
    setSelectedPanchayat(panchayat || null);
    setSelectedWardNumber(null);
  };

  const handleWardChange = (wardNumber: string) => {
    setSelectedWardNumber(parseInt(wardNumber, 10));
    setLocationDialogOpen(false);
  };

  const availableWards = selectedPanchayat ? getWardsForPanchayat(selectedPanchayat) : [];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center gap-4 px-4">
          {/* Logo */}
          <img 
            src={logo} 
            alt="Penny Carbs" 
            className="h-10 w-auto cursor-pointer hidden sm:block" 
            onClick={() => navigate('/')}
          />
          {/* Location Selector with Customer Login */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocationDialogOpen(true)}
              className="flex items-center gap-1 text-left"
            >
              <MapPin className="h-5 w-5 text-primary" />
              <div className="hidden sm:block">
                <p className="text-xs text-muted-foreground">Deliver to</p>
                <p className="flex items-center text-sm font-medium">
                  {selectedWardNumber 
                    ? `Ward ${selectedWardNumber}, ${selectedPanchayat?.name}` 
                    : selectedPanchayat?.name || 'Select Location'}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </p>
              </div>
              <ChevronDown className="h-4 w-4 sm:hidden" />
            </button>
            {!user && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setShowNotRegistered(false);
                  mobileForm.reset();
                  setCustomerLoginOpen(true);
                }}
                className="hidden sm:flex"
              >
                Customer
              </Button>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search dishes or kitchens..."
                className="h-10 w-full pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuLabel>
                  <p className="font-medium">{profile?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{profile?.mobile_number}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                {(role === 'super_admin' || role === 'admin') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/auth')} size="sm" variant="ghost" className="gap-1">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Delivery/Food Partner</span>
            </Button>
          )}
        </div>
      </header>

      {/* Location Selection Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Select Your Location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Panchayat</label>
              <Select
                value={selectedPanchayat?.id || ''}
                onValueChange={handlePanchayatChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Panchayat" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {panchayats.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.ward_count} wards)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPanchayat && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Ward</label>
                <Select
                  value={selectedWardNumber?.toString() || ''}
                  onValueChange={handleWardChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover max-h-60">
                    {availableWards.map((wardNum) => (
                      <SelectItem key={wardNum} value={wardNum.toString()}>
                        Ward {wardNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Customer Login Dialog */}
      <Dialog open={customerLoginOpen} onOpenChange={setCustomerLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Customer Login
            </DialogTitle>
            <DialogDescription>
              Enter your registered mobile number to login
            </DialogDescription>
          </DialogHeader>
          
          {!showNotRegistered ? (
            <Form {...mobileForm}>
              <form onSubmit={mobileForm.handleSubmit(handleCustomerLogin)} className="space-y-4 py-4">
                <FormField
                  control={mobileForm.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter your 10-digit mobile number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </Form>
          ) : (
            <div className="py-4 space-y-4">
              <div className="rounded-lg bg-destructive/10 p-4 text-center">
                <p className="text-sm text-destructive font-medium">
                  You are not registered
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mobile number {attemptedMobile} is not found in our system
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleGoToRegister} className="w-full">
                  Register New Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNotRegistered(false)} 
                  className="w-full"
                >
                  Try Another Number
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppHeader;
