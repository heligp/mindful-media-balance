import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface PrivacyPolicyProps {
  onAccept: () => void;
  onDecline: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onAccept, onDecline }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] rounded border p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">TimeGuardian App Privacy Policy</h3>
            
            <p>Effective Date: April 12, 2025</p>
            
            <p className="text-sm">
              TimeGuardian ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information
              when you use our mobile application (the "App").
            </p>
            
            <h4 className="font-medium mt-4">1. Information We Collect</h4>
            <p className="text-sm">
              We collect the following information:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>App Usage Statistics:</strong> Through Android's UsageStats API, we collect data about your usage of other applications, including time spent and launch frequency.</li>
              <li><strong>Device Information:</strong> Basic device information required for app functionality.</li>
              <li><strong>Google Play Services:</strong> We use Google Play Services for basic app functionality and analytics.</li>
            </ul>
            
            <h4 className="font-medium mt-2">2. Required Permissions</h4>
            <p className="text-sm">
              Our app requires the following Android permissions:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>PACKAGE_USAGE_STATS:</strong> To monitor app usage patterns</li>
              <li><strong>DEVICE_ADMIN:</strong> To enable app blocking features</li>
            </ul>
            
            <h4 className="font-medium mt-2">3. How We Use Your Information</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>To monitor and display your app usage patterns</li>
              <li>To provide personalized insights and recommendations</li>
              <li>To award points based on your usage habits</li>
              <li>To improve our app and develop new features</li>
            </ul>
            
            <h4 className="font-medium mt-2">4. Data Storage and Security</h4>
            <p className="text-sm">
              All usage data is stored locally on your device. We use industry-standard security 
              measures to protect your information. We do not share your personal information 
              with third parties.
            </p>
            
            <h4 className="font-medium mt-2">5. Your Rights</h4>
            <p className="text-sm">
              You can request access to your data, correction of inaccurate data, or deletion
              of your data at any time through the app settings.
            </p>
            
            <h4 className="font-medium mt-2">6. Changes to This Policy</h4>
            <p className="text-sm">
              We may update our Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the "Effective Date."
            </p>
            
            <h4 className="font-medium mt-2">7. Contact Us</h4>
            <p className="text-sm">
              If you have questions about this Privacy Policy, please contact us at:
              privacy@timeguardian.app
            </p>
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="accept-policy" 
            checked={accepted} 
            onCheckedChange={(checked) => setAccepted(checked === true)}
          />
          <label htmlFor="accept-policy" className="text-sm font-medium">
            I have read and accept the Privacy Policy
          </label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button disabled={!accepted} onClick={onAccept}>
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicy;
