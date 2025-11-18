"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CurrencyFormModal({
  open,
  setOpen,
  editingCurrency,
  onSubmit
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCurrency) {
      setCode(editingCurrency.code || "");
      setName(editingCurrency.name || "");
      setRate(String(editingCurrency.rate || ""));
      setError("");
    } else {
      setCode("");
      setName("");
      setRate("");
      setError("");
    }
  }, [editingCurrency, open]);

  const handleSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    const parsedRate = parseFloat(rate);

    if (!code || !name || isNaN(parsedRate) || parsedRate <= 0) {
      setError("Currency Code, Name, and a valid Exchange Rate (> 0) are required.");
      setIsSubmitting(false);
      return;
    }

    if (!/^[A-Z]{3}$/i.test(code)) {
      setError("Currency code must be exactly 3 letters.");
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit({
        code: code.toUpperCase(),
        name: name,
        rate: parsedRate
      });

      setOpen(false);
    } catch (err) {
      setError(err.message || "Failed to save currency. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setName("");
    setRate("");
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingCurrency ? "Edit Currency" : "Add New Currency"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {error && (
            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="currency-code" className="text-sm font-medium">
              Currency Code
            </label>
            <Input
              id="currency-code"
              placeholder="USD"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={!!editingCurrency || isSubmitting}
              maxLength={3}
              className="uppercase"
            />
            {editingCurrency && (
              <p className="text-xs text-gray-500 mt-1">
                Currency code cannot be changed when editing
              </p>
            )}
          </div>

          <div>
            <label htmlFor="currency-name" className="text-sm font-medium">
              Currency Name
            </label>
            <Input
              id="currency-name"
              placeholder="United States Dollar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="exchange-rate" className="text-sm font-medium">
              Exchange Rate
            </label>
            <Input
              id="exchange-rate"
              type="number"
              step="0.000001"
              min="0"
              placeholder="1.0000"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              Rate relative to USD (e.g., 1 USD = {rate || "X"} {code || "XXX"})
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : editingCurrency ? "Save Changes" : "Add Currency"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}