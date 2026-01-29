import React from 'react';
import { usePackages } from '@/hooks/usePackages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Crown, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Package } from '@/types/events';

interface PackageSelectorProps {
  selectedPackage: Package | null;
  onSelect: (pkg: Package) => void;
}

const packageIcons: Record<string, React.ReactNode> = {
  'Basic': <Star className="h-5 w-5" />,
  'Standard': <Sparkles className="h-5 w-5" />,
  'Premium': <Crown className="h-5 w-5" />,
};

const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackage,
  onSelect,
}) => {
  const { data: packages, isLoading } = usePackages();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  const getFeatures = (pkg: Package): string[] => {
    const features: string[] = ['Food included'];
    if (pkg.includes_decoration) features.push('Decoration');
    if (pkg.includes_service_staff) features.push('Service staff');
    if (pkg.includes_venue) features.push('Venue coordination');
    return features;
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Select Package</h3>
      <div className="space-y-3">
        {packages?.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedPackage?.id === pkg.id
                ? "border-primary bg-primary/5 ring-2 ring-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => onSelect(pkg)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-full",
                    pkg.name === 'Premium' ? 'bg-amber-100 text-amber-600' :
                    pkg.name === 'Standard' ? 'bg-blue-100 text-blue-600' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {packageIcons[pkg.name] || <Star className="h-5 w-5" />}
                  </div>
                  <CardTitle className="text-lg">{pkg.name}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm font-semibold">
                  {pkg.service_charge_percent}% service charge
                </Badge>
              </div>
              {pkg.description && (
                <CardDescription className="text-xs mt-1">
                  {pkg.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getFeatures(pkg).map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-1 text-xs text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-success" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PackageSelector;
