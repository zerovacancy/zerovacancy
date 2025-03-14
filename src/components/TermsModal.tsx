
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">ZeroVacancy Terms and Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-100px)] pr-4">
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

            {/* Continue with other sections similarly structured... */}
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
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;
