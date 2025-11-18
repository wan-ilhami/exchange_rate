'use client';

import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

export default function AdminHeader({ refreshing, fetchCurrencies, openCreateModal, handleExport }) {
  return (
    <div
      className={`bg-white shadow-lg rounded-xl mx-auto mt-6 transition-all duration-500 ease-in-out ${refreshing
          ? "max-w-xs ring-2 ring-blue-500"
          : "max-w-3xl"
        }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {!refreshing && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-800">Currency Rates Admin</h1>
            </div>
          )}

          <div className="flex items-center gap-2 flex-shrink-0">

            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchCurrencies(true)}
              disabled={refreshing}
              aria-label="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>

            {!refreshing && (
              <Button onClick={openCreateModal} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Currency
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}