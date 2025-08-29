import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface MobileCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  action?: string;
}

const MobileCard: React.FC<MobileCardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  action = "View" 
}) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-blue-600">{icon}</div>}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        {onClick && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClick}
            className="w-full"
          >
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileCard;