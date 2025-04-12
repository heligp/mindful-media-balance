
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfServiceProps {
  onAccept: () => void;
  onDecline: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onAccept, onDecline }) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[300px] rounded border p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">TimeGuardian Terms of Service</h3>
            
            <p>Last Updated: April 12, 2025</p>
            
            <p className="text-sm">
              Please read these Terms of Service ("Terms") carefully before using the TimeGuardian 
              mobile application (the "App") operated by TimeGuardian ("we," "us," or "our").
            </p>
            
            <h4 className="font-medium mt-4">1. Acceptance of Terms</h4>
            <p className="text-sm">
              By accessing or using our App, you agree to be bound by these Terms. If you disagree 
              with any part of the Terms, you may not access the App.
            </p>
            
            <h4 className="font-medium mt-2">2. App Permissions</h4>
            <p className="text-sm">
              Our App requires specific permissions to function properly:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Usage Stats Permission:</strong> Required to monitor app usage</li>
              <li><strong>Device Administrator Permission:</strong> Required to enable app blocking features</li>
              <li><strong>Notification Permission:</strong> Required to send you usage alerts</li>
            </ul>
            <p className="text-sm">
              By using our App, you agree to grant these permissions. Without these permissions, 
              some features may be limited or unavailable.
            </p>
            
            <h4 className="font-medium mt-2">3. User Responsibilities</h4>
            <p className="text-sm">
              You are responsible for maintaining the confidentiality of your account and for all 
              activities that occur under your account. You agree to notify us immediately of any 
              unauthorized use of your account.
            </p>
            
            <h4 className="font-medium mt-2">4. Limitations of Liability</h4>
            <p className="text-sm">
              Our App is provided "as is" without warranties of any kind, either express or implied.
              We do not guarantee that the App will function without interruption or error.
            </p>
            <p className="text-sm">
              In no event shall TimeGuardian be liable for any indirect, incidental, special, 
              consequential, or punitive damages arising out of or relating to your use of the App.
            </p>
            
            <h4 className="font-medium mt-2">5. Changes to Terms</h4>
            <p className="text-sm">
              We reserve the right to modify these Terms at any time. We will provide notice of any 
              material changes by updating the "Last Updated" date and notifying you within the App.
            </p>
            
            <h4 className="font-medium mt-2">6. Contact Us</h4>
            <p className="text-sm">
              If you have questions about these Terms, please contact us at: terms@timeguardian.app
            </p>
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="accept-terms" 
            checked={accepted} 
            onCheckedChange={(checked) => setAccepted(checked === true)}
          />
          <label htmlFor="accept-terms" className="text-sm font-medium">
            I have read and accept the Terms of Service
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

export default TermsOfService;
