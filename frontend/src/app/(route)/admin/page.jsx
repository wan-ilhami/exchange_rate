"use client";

import { useEffect, useState } from "react";
import adminAPI from "@/app/services/adminAPI";

import AdminHeader from "./components/AdminHeader";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import CurrencyTable from "./components/CurrencyTable";
import CurrencyFormModal from "./components/CurrencyFormModal";
import DeleteModal from "./components/DeleteModal";

export default function AdminPage() {
  const [currencies, setCurrencies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

const fetchCurrencies = async (fullRefresh = false) => {
  setRefreshing(fullRefresh);
  setLoading(true);
  setErrorMessage(null);

  try {
    const response = await adminAPI.getAllCurrencies();
    const currencyData = response.data;

    if (!Array.isArray(currencyData)) {
      throw new Error("API response format is incorrect: expected an array in the 'data' field.");
    }

    const mappedData = currencyData.map(item => ({
      id: item.id,
      code: item.code,
      name: item.name,
      rate: item.latest_rate,
      created_at: item.created_at
    }));

    const updatedData = mappedData.map(currency => {
      if (currency.id === 1 || currency.code === 'USD') {

        return {
          ...currency, 
          rate: 1      
        };
      }
      return currency;
    });

    setCurrencies(updatedData);

  } catch (error) {
    setErrorMessage(`Failed to load currencies: ${error.message || 'Server error'}`);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const getFilteredCurrenciesBeforePagination = () => {
    const s = searchTerm.toLowerCase();
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)
    );
  };

  const totalFilteredItems = getFilteredCurrenciesBeforePagination().length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

  useEffect(() => {
    const searchFiltered = getFilteredCurrenciesBeforePagination();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = searchFiltered.slice(startIndex, endIndex);

    setFiltered(paginatedData);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

  }, [currencies, searchTerm, currentPage, itemsPerPage, totalPages]);

  const handleSearchChange = (term) => {
    setCurrentPage(1);
    setSearchTerm(term);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openCreateModal = () => {
    setEditingCurrency(null);
    setFormOpen(true);
  };

  const openEditModal = (row) => {
    setEditingCurrency(row);
    setFormOpen(true);
  };

  const handleFormSubmit = async ({ code, name, rate }) => {
    setLoading(true);
    setErrorMessage(null);
    setFormOpen(false);

    try {
      if (editingCurrency && editingCurrency.id) {
        
        await adminAPI.updateCurrency(editingCurrency.id, code, name, rate);
      } else {
        await adminAPI.addCurrency(code, name, rate);
      }

      await fetchCurrencies(true);

    } catch (error) {
      setErrorMessage(`Operation failed: ${error.message || 'Server error'}`);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setErrorMessage(null);
    setDeleteOpen(false);

    if (!deleteCode) return;

    try {
      await adminAPI.deleteCurrency(deleteCode);
      await fetchCurrencies(true);

    } catch (error) {
      setErrorMessage(`Deletion failed: ${error.message || 'Server error'}`);
      setLoading(false);
    } finally {
      setDeleteCode(null);
    }
  };

  const handleSort = (key) => {
    setFiltered((prev) =>
      [...prev].sort((a, b) =>
        a[key].toString().localeCompare(b[key].toString(), undefined, {
          numeric: true
        })
      )
    );
  };

  return (
    <div>
      <AdminHeader
        refreshing={refreshing}
        fetchCurrencies={fetchCurrencies}
        openCreateModal={openCreateModal}
      />

      <div className="container mx-auto px-6 py-5">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}

        <StatsCards
          currencies={currencies}
          totalFilteredItems={totalFilteredItems}
        />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          filteredCount={totalFilteredItems}
          totalCount={currencies.length}
        />

        <CurrencyTable
          loading={loading}
          filteredCurrencies={filtered}
          searchTerm={searchTerm}
          handleSort={handleSort}
          openEditModal={openEditModal}
          setDeleteCode={(code) => {
            setDeleteCode(code);
            setDeleteOpen(true);
          }}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>

      <CurrencyFormModal
        open={formOpen}
        setOpen={setFormOpen}
        editingCurrency={editingCurrency}
        onSubmit={handleFormSubmit}
      />

      <DeleteModal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}