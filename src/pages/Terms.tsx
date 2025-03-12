
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">ZeroVacancy Terms and Conditions</h1>
          <Link to="/">
            <Button variant="ghost">Back to Home</Button>
          </Link>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-muted-foreground mb-4">Last Updated: February 25, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Overview</h2>
            <p className="text-muted-foreground mb-4">
              ZeroVacancy operates a specialized online marketplace that connects real estate property managers and owners ("Clients") with content creators specializing in real estate marketing ("Creators"). This document outlines the terms and conditions governing the use of our platform, services, and content.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Payment Policies</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">1.1 Transaction Process</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>All payments are processed securely through our platform using established payment processors.</li>
              <li>Fees are held in escrow until project completion and content approval.</li>
              <li>All prices displayed are in USD unless otherwise specified.</li>
              <li>Platform fees are calculated as a percentage of the total transaction value and will be clearly displayed before checkout.</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">1.2 Refund Policy</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Refunds may be issued if a Creator fails to deliver the agreed-upon content within the specified timeframe.</li>
              <li>If the delivered content does not meet the agreed-upon specifications, clients may request revisions or a refund.</li>
              <li>Refund requests must be submitted within 14 days of content delivery.</li>
              <li>Subscription fees are non-refundable after the first 7 days of service.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. User Accounts</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">2.1 Account Creation and Maintenance</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Users must provide accurate and complete information when creating an account.</li>
              <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
              <li>Users must promptly update their account information if it changes.</li>
              <li>ZeroVacancy reserves the right to suspend or terminate accounts that violate our terms or engage in fraudulent activity.</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">2.2 Creator Accounts</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Creators must verify their identity and qualifications before offering services on the platform.</li>
              <li>Portfolio content must accurately represent the Creator's own work.</li>
              <li>Creators are responsible for accurately describing their services, qualifications, and pricing.</li>
              <li>Creators must maintain a professional standard of communication and service delivery.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Content Ownership and Rights</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">3.1 Intellectual Property</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Upon full payment, Clients typically receive full commercial usage rights to the commissioned content unless otherwise specified in a custom agreement.</li>
              <li>Creators may retain the right to display the work in their portfolios unless otherwise agreed upon.</li>
              <li>Clients are responsible for ensuring they have the rights to use any materials provided to Creators.</li>
              <li>ZeroVacancy does not claim ownership of any content created through the platform.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Platform Usage</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">4.1 Prohibited Activities</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Users may not circumvent the platform to avoid fees.</li>
              <li>Users may not post content that is illegal, harmful, or infringing on third-party rights.</li>
              <li>Users may not manipulate ratings or reviews.</li>
              <li>Harassment, discrimination, or abusive behavior toward other users is prohibited.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              All disputes between users shall first attempt to be resolved through our platform's dispute resolution process. If this is unsuccessful, disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Privacy Policy</h2>
            <p className="text-muted-foreground mb-4">
              Our Privacy Policy, available at <a href="/privacy" className="text-brand-purple hover:underline">zerovacancy.ai/privacy</a>, is incorporated into these Terms and Conditions and explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Modifications to Terms</h2>
            <p className="text-muted-foreground mb-4">
              ZeroVacancy reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant changes, and continued use of the platform constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              ZeroVacancy is not liable for disputes between users, content quality issues, or indirect, consequential, or incidental damages arising from platform use. Our liability is limited to the amount paid by the user for the specific service in question.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="text-muted-foreground">
              <p><strong>ZeroVacancy Legal Department</strong></p>
              <p>Email: legal@zerovacancy.ai</p>
            </div>

            <p className="text-muted-foreground mt-8 italic">
              By using ZeroVacancy, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Terms;
