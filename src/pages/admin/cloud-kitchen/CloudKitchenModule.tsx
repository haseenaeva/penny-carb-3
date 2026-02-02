import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Plus, ChefHat, Settings } from 'lucide-react';
import { useCloudKitchenDivisions, type Division } from '@/hooks/useCloudKitchenDivisions';
import DivisionCard from '@/components/admin/cloud-kitchen/DivisionCard';
import CreateDivisionDialog from '@/components/admin/cloud-kitchen/CreateDivisionDialog';
import EditTimeSlotDialog from '@/components/admin/cloud-kitchen/EditTimeSlotDialog';
import DivisionItemsManager from '@/components/admin/cloud-kitchen/DivisionItemsManager';

const CloudKitchenModule: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editTimeDialogOpen, setEditTimeDialogOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [managingDivision, setManagingDivision] = useState<Division | null>(null);

  const isAdmin = role === 'super_admin' || role === 'admin';
  const isSuperAdmin = role === 'super_admin';

  const { data: divisions, isLoading } = useCloudKitchenDivisions();

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Settings className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Access Denied</h2>
        <Button className="mt-6" onClick={() => navigate('/admin')}>
          Go Back
        </Button>
      </div>
    );
  }

  const handleManage = (division: Division) => {
    setManagingDivision(division);
  };

  const handleEditTime = (division: Division) => {
    setSelectedDivision(division);
    setEditTimeDialogOpen(true);
  };

  // If managing a division, show the items manager
  if (managingDivision) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-cloud-kitchen text-white">
          <div className="flex h-14 items-center px-4">
            <ChefHat className="h-6 w-6 mr-2" />
            <h1 className="font-display text-lg font-semibold">Cloud Kitchen</h1>
          </div>
        </header>
        <main className="p-4 pb-20">
          <DivisionItemsManager
            division={managingDivision}
            onBack={() => setManagingDivision(null)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-cloud-kitchen text-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <ChefHat className="h-6 w-6" />
            <h1 className="font-display text-lg font-semibold">Cloud Kitchen</h1>
          </div>
          {isSuperAdmin && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New Division
            </Button>
          )}
        </div>
      </header>

      <main className="p-4 pb-20">
        {/* Info Section */}
        <div className="mb-6 rounded-lg bg-muted/50 p-4">
          <h2 className="font-semibold mb-1">Meal Divisions</h2>
          <p className="text-sm text-muted-foreground">
            Manage time slots and assign food items as sets. Customers can only order 
            during open slots. Each item is sold in sets with minimum order quantities.
          </p>
        </div>

        {/* Division Cards Grid */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : divisions?.length === 0 ? (
          <div className="text-center py-12">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Divisions Yet</h3>
            <p className="text-muted-foreground mb-4">
              {isSuperAdmin
                ? 'Create your first division to get started'
                : 'Contact super admin to create divisions'}
            </p>
            {isSuperAdmin && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create Division
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {divisions?.map((division) => (
              <DivisionCard
                key={division.id}
                division={division}
                onManage={() => handleManage(division)}
                onEditTime={() => handleEditTime(division)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <CreateDivisionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <EditTimeSlotDialog
        open={editTimeDialogOpen}
        onOpenChange={setEditTimeDialogOpen}
        division={selectedDivision}
      />
    </div>
  );
};

export default CloudKitchenModule;
