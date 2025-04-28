
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { getWebhookUrl, setWebhookUrl } from '@/utils/webhookConfig';

const WebhookConfig: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    const savedUrl = getWebhookUrl();
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  const handleSaveWebhook = () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Basic URL validation
      new URL(url);
      setWebhookUrl(url);

      toast({
        title: "Webhook Configured",
        description: "Property screenshots will be sent to this webhook",
      });

      console.log("Webhook URL saved:", url);
      setIsConfiguring(false);
      
      // Test the webhook connection
      fetch(url, { 
        method: 'POST', 
        body: JSON.stringify({ test: true, timestamp: new Date().toISOString() }),
        headers: { 'Content-Type': 'application/json' }
      }).catch(e => console.log("Test connection error (expected for CORS):", e));
      
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  const handleTestWebhook = () => {
    if (!url.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a webhook URL first",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Testing Connection",
      description: "Sending test data to webhook"
    });
    
    fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        test: true, 
        timestamp: new Date().toISOString(),
        source: window.location.origin
      }),
      mode: 'no-cors'
    })
    .then(() => {
      toast({
        title: "Test Completed",
        description: "Test request sent. Check your webhook logs."
      });
    })
    .catch(error => {
      console.error("Test webhook error:", error);
      toast({
        title: "Test Failed",
        description: "Could not send test request"
      });
    });
  };

  if (!isConfiguring && getWebhookUrl()) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">Webhook Configuration</h3>
            <p className="text-sm text-gray-600">Property screenshots will be sent to your webhook</p>
            <p className="text-xs text-gray-500 mt-1 break-all">{url}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleTestWebhook}>
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsConfiguring(true)}>
              Change
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <h3 className="font-medium text-gray-800 mb-2">Webhook Configuration</h3>
      <p className="text-sm text-gray-600 mb-4">
        Enter your Make.com or other webhook URL to receive property screenshots
      </p>
      
      <div className="flex flex-col gap-3">
        <Input
          placeholder="https://hook.make.com/your-webhook"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2">
          <Button onClick={handleSaveWebhook} className="bg-tiptop-accent hover:bg-tiptop-accent/90">
            Save Webhook
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleTestWebhook}
          >
            Test Connection
          </Button>
          
          {getWebhookUrl() && (
            <Button 
              variant="outline" 
              onClick={() => setIsConfiguring(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebhookConfig;
