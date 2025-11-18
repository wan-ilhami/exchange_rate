import { Pencil, Trash2, ArrowUpDown, Search, DollarSign, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CurrencyTable({
  loading,
  filteredCurrencies,
  searchTerm,
  handleSort,
  openEditModal,
  setDeleteCode,
  currentPage,
  totalPages,
  handlePageChange
}) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading currencies...</p>
          </div>
        </div>
      ) : filteredCurrencies.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              {searchTerm ? (
                <Search className="h-10 w-10 text-muted-foreground" />
              ) : (
                <DollarSign className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No currencies found" : "No currencies yet"}
            </h3>

            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first currency"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th
                    onClick={() => handleSort("code")}
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Code <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Name <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort("rate")}
                    className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Exchange Rate <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredCurrencies.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-foreground">
                            {row.code}
                          </span>
                        </div>
                        <span className="font-semibold">{row.code}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium">{row.name}</span>
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-mono">
                        {parseFloat(row.rate).toFixed(4)}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(row)}
                          className="hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteCode(row.id)}
                          className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t bg-muted/50">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}