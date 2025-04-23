
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building } from "lucide-react";

interface Property3DModelNoJobProps {
  address: string;
  className?: string;
}

const Property3DModelNoJob: React.FC<Property3DModelNoJobProps> = ({ address, className }) => {
  return (
    <Card
      className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription>
          Generate a 3D model for {address}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-8">
        <p className="text-center text-muted-foreground mb-4">
          Click "Generate 3D Model" on the map to generate a 3D model of this property
        </p>
        <Building className="h-16 w-16 text-muted-foreground/50 mb-4" />
      </CardContent>
    </Card>
  );
};

export default Property3DModelNoJob;

