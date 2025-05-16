"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Disclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const acceptedPolicies = localStorage.getItem("acceptedPolicies");
    if (!acceptedPolicies) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    if (isChecked) {
      localStorage.setItem("acceptedPolicies", "true");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-h-[90%] overflow-y-auto bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">
            Disclaimer
          </DialogTitle>
          <DialogDescription className="space-y-4 text-lg text-justify">
            <p>
              The rankings and ratings displayed on this website are entirely
              community-driven and are not verified or endorsed by NadsVerify.
              While we strive to maintain a safe and transparent platform, we do
              not take responsibility for the accuracy, reliability, or
              legitimacy of any project listed. A high rank does not imply a
              project is trustworthy or a good investment.
            </p>
            <p>
              This website does not provide financial advice. Always conduct
              your own thorough research before making any investment decisions.
              Crypto assets are volatile and risky, proceed with caution.
            </p>
            <p>
              Although we actively monitor for scams and malicious activity, we
              cannot guarantee that all fraudulent projects are prevented or
              removed.
            </p>
            <p>
              When logging in through Discord, you consent to the collection and
              storage of your Discord user data (such as your user ID, username,
              and avatar). This data is used solely for platform functionality
              and will never be shared with third parties. We respect your
              privacy and are committed to protecting your personal information.
            </p>
            <p>
              By using this site, you agree to this disclaimer and the
              associated terms.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(!!checked)}
            />
            <span>I agree to the disclaimer and terms.</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleConfirm}
            disabled={!isChecked}
            className={cn(
              "px-4 py-2 rounded-lg text-white transition-all cursor-pointer",
              isChecked
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            )}
          >
            Confirm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
