
import React from 'react';
import { getWebhookUrl } from '@/utils/webhookConfig';

const WebhookConfig: React.FC = () => {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">Webhook Configuration</h3>
          <p className="text-sm text-gray-600">Property screenshots will be sent to Make.com for 3D model generation</p>
        </div>
      </div>
    </div>
  );
};

export default WebhookConfig;
