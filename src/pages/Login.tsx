
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-tiptop-light p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-2 text-gray-600">
            Please sign in to your account
          </p>
        </div>
        
        <div className="text-center mt-4">
          <p>
            Login functionality coming soon
          </p>
          <Button 
            className="mt-4 w-full bg-tiptop-accent hover:bg-tiptop-accent/90"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/signup');
              }}
              className="text-tiptop-accent hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
