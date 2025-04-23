
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const DEMO_MODELS = [
  {
    id: "msy_demo1",
    address: "123 Main St, Springfield",
    image: "/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png",
    modelUrl: "/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png"
  },
  {
    id: "msy_demo2",
    address: "456 Pine Ave, Metropolis",
    image: "/lovable-uploads/0716fc81-957a-490a-b8a1-100fda17e403.png",
    modelUrl: "/lovable-uploads/0716fc81-957a-490a-b8a1-100fda17e403.png"
  },
  {
    id: "msy_demo3",
    address: "789 Oak Dr, Gotham",
    image: "/lovable-uploads/913daccf-062e-43c1-a1ea-61722735d206.jpg",
    modelUrl: "/lovable-uploads/913daccf-062e-43c1-a1ea-61722735d206.jpg"
  },
];

const ModelsGallery: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6 text-tiptop-accent">3D Models Gallery</h1>
      <p className="mb-8 text-muted-foreground">
        View all generated 3D property models.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {DEMO_MODELS.map((model) => (
          <Card key={model.id} className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {model.address}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={model.image}
                alt={model.address}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <a
                href={model.modelUrl}
                download
                className="text-tiptop-accent hover:underline text-sm font-semibold"
              >
                Download 3D Model
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Link to="/" className="text-primary hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ModelsGallery;
