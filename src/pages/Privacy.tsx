import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">ZeroVacancy Privacy Policy</h1>
          <Link to="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-muted-foreground mb-4">Last Updated: February 25, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              At ZeroVacancy, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
            
            <h3 className="text-lg font-medium mt-4 mb-2">2.1 Personal Data</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Register for an account</li>
              <li>Express interest in obtaining information about our services</li>
              <li>Participate in activities on our platform</li>
              <li>Contact us for customer support</li>
            </ul>
            <p className="text-muted-foreground mt-4 mb-4">
              This personal information may include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Business information</li>
              <li>Portfolio examples (for Creators)</li>
              <li>Payment information</li>
              <li>Other information you choose to provide</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">2.2 Automatically Collected Data</h3>
            <p className="text-muted-foreground mb-4">
              When you access our platform, we may automatically collect certain information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device information (browser type, operating system, device type)</li>
              <li>IP address</li>
              <li>Browsing actions and patterns</li>
              <li>Referring websites</li>
              <li>Usage data (pages visited, features used)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect for various purposes, including to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our platform</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Process transactions and send related information</li>
              <li>Communicate with you about updates, security alerts, and support</li>
              <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity</li>
              <li>For marketing and promotional purposes with your consent</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Sharing Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>With Clients and Creators:</strong> To facilitate connections and transactions between users on our platform</li>
              <li><strong>With Service Providers:</strong> With third-party vendors, consultants, and other service providers who need access to your information to perform services on our behalf</li>
              <li><strong>For Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition</li>
              <li><strong>With Your Consent:</strong> When you have given us your consent to share your information for a specific purpose</li>
              <li><strong>For Legal Compliance:</strong> When required by law, such as to comply with a subpoena or similar legal process</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>The right to access the personal information we have about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p className="text-muted-foreground mt-4 mb-4">
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, no data transmission over the Internet or storage system can be guaranteed to be 100% secure.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Third-Party Websites</h2>
            <p className="text-muted-foreground mb-4">
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn we have collected personal information from a child under 18, we will delete this information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this privacy policy frequently to stay informed about how we are protecting your information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions or concerns about this privacy policy or our practices, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p><strong>ZeroVacancy Privacy Department</strong></p>
              <p>Email: privacy@zerovacancy.ai</p>
            </div>

            <p className="text-muted-foreground mt-8 italic">
              By using ZeroVacancy, you acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Privacy;