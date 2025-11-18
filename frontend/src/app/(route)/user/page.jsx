'use client';
import React, { useState, useEffect } from 'react';
import { XCircle, Calendar, RefreshCw, DollarSign, Layers } from 'lucide-react';
import userAPI from '@/app/services/userAPI';

const ErrorBanner = ({ error }) => (
    <div className="mx-auto mb-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-md">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-bold text-sm">Connection Error</p>
                <p className="text-sm mt-1">{error}</p>
            </div>
        </div>
    </div>
);
const LoadingState = () => (
    <div className="bg-white border border-gray-200 p-12 rounded-xl shadow-lg text-center mx-auto">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-lg text-gray-600 font-semibold">Fetching exchange rates...</p>
    </div>
);
const NoRatesState = ({ selectedDate, currentDate, formatDate }) => (
    <div className="bg-white border border-gray-200 p-16 rounded-xl shadow-lg text-center mx-auto">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600 font-bold">No Rates Found</p>
        <p className="text-md text-gray-500 mt-2">
            No exchange rate data is available for this date: {formatDate(selectedDate || currentDate)}.
        </p>
    </div>
);
const StatBadge = ({ title, value, icon: Icon }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-inner border border-gray-100">
        <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
        </div>
    </div>
);
const RateCard = ({ rate, baseCurrency, formatRate }) => (
    <div
        key={rate.currency}
        className="bg-white border border-gray-100 rounded-xl p-5 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-200 transform hover:scale-[1.01]"
    >
        <div className="flex justify-between items-start mb-3">
            <div>
                <span className="text-xl font-bold text-gray-900">{rate.currency}</span>
                <div className="text-xs text-gray-500 mt-1 truncate">{rate.currencyName}</div>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-3xl font-extrabold text-blue-600">
                {formatRate(rate.rate)}
            </div>
            <div className="text-xs text-gray-500 mt-1">per 1 {baseCurrency}</div>
        </div>
    </div>
);
const LoadMoreButton = ({ loading, hasMore, handleLoadMore, totalItems, ratesLength }) => {
    if (!hasMore) return (
        <div className="bg-white border border-green-200 p-4 rounded-xl shadow-lg text-center mx-auto">
            <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-700 font-medium">All {totalItems} currencies loaded.</p>
        </div>
    );

    return (
        <div className="flex justify-center mb-10">
            <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-10 py-3 bg-blue-900 text-white font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                    </>
                ) : (
                    <span>Load More ({totalItems - ratesLength} remaining)</span>
                )}
            </button>
        </div>
    );
};
const RatesHeader = ({
    selectedDate, currentDate, baseCurrency, ratesLength, totalItems, hasMore, loading,
    handleDateChange, handleClearDate, handleRefresh, formatDate, getMaxDate
}) => {
    return (
        <div className="bg-white shadow-xl rounded-xl mx-auto mb-8 max-w-6xl p-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4 border-b pb-3">
                Global Exchange Rates
            </h1>

            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 gap-4">
                <div className="flex-1 max-w-lg">
                    <label htmlFor="date-picker" className="block text-xs font-medium text-gray-600 mb-1">
                        <Calendar className="h-4 w-4 inline mr-1 text-gray-500" /> Filter Date
                    </label>
                    <div className="flex gap-2 items-stretch">
                        <input
                            id="date-picker"
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            max={getMaxDate()}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                            disabled={loading}
                        />

                        {selectedDate && (
                            <button
                                onClick={handleClearDate}
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-200 disabled:opacity-50"
                                aria-label="Clear date filter"
                                disabled={loading}
                            >
                                <XCircle className='h-4 w-4' />
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        {selectedDate
                            ? `Showing historical rates for ${formatDate(currentDate)}`
                            : `Showing latest rates (Data as of: ${formatDate(currentDate)})`}
                    </p>
                </div>

                <div className="md:pt-0">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={`w-full md:w-auto px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-md ${loading
                            ? 'bg-blue-400 text-white cursor-wait'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'
                            }`}
                        aria-label="Refresh rates"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        <span className='ml-2'>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 pt-6 border-t border-gray-100">
                <StatBadge
                    title="Data Date"
                    value={formatDate(currentDate) || 'N/A'}
                    icon={Calendar}
                />
                <StatBadge
                    title="Base Currency"
                    value={baseCurrency}
                    icon={DollarSign}
                />
                <StatBadge
                    title="Loaded / Total"
                    value={loading ? "Loading..." : `${ratesLength} / ${totalItems}`}
                    icon={Layers}
                />
            </div>
        </div>
    );
};

const App = () => {
    const [rates, setRates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [baseCurrency, setBaseCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalItems, setTotalItems] = useState(0);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getMaxDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const formatRate = (rate) => {
        const numericRate = parseFloat(rate);
        if (isNaN(numericRate) || rate === 'N/A') {
            return 'Rate Unavailable';
        }
        return numericRate.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        });
    };

    const performLoadRates = async (pageNum, dateFilter = null, append = false) => {
        try {
            if (pageNum === 1 && !append) {
                setLoading(true);
            } else if (append) {
                setLoading(true);
            }
            setError(null);

            let response;
            const isHistorical = !!dateFilter;

            if (isHistorical) {
                response = await userAPI.getHistoricalRates(dateFilter, pageNum, 11);
            } else {
                response = await userAPI.getAllCurrencies(pageNum, 11);
            }

            console.log('API Response:', response);

            const isSuccess = response && response.success;

            if (isSuccess) {
                let processedRates = [];
                let bc = 'USD';
                let date = getMaxDate();
                let pagination = { total: 0, hasMore: false };

                const usdRate = { 
                    currency: 'USD', 
                    currencyName: 'US Dollar', 
                    rate: '1.000000' 
                };

                if (isHistorical) {
                    const rawRates = response.data;
                    const apiPagination = response.pagination;
                    const apiQueryDate = response.queryDate;

                    if (!Array.isArray(rawRates)) {
                        console.error('Expected array but got:', rawRates);
                        throw new Error('Invalid historical data format: expected an array of rates');
                    }

                    const filteredRates = rawRates.filter(item => item.target_currency !== 'USD');

                    processedRates = filteredRates.map(item => ({
                        currency: item.target_currency,
                        currencyName: item.target_currency_name,
                        rate: item.rate || 'N/A'
                    }));

                    bc = rawRates.length > 0 ? rawRates[0].base_currency : 'USD'; 
                    date = apiQueryDate || dateFilter || getMaxDate();
                    pagination = apiPagination;

                } else {
                    const rawCurrencies = response.data;
                    const apiPagination = response.pagination;

                    if (!Array.isArray(rawCurrencies)) {
                        console.error('Expected array but got:', rawCurrencies);
                        throw new Error('Invalid data format: expected an array of currencies');
                    }

                    const filteredCurrencies = rawCurrencies.filter(item => item.code !== 'USD');

                    processedRates = filteredCurrencies.map(item => ({
                        currency: item.code,
                        currencyName: item.name,
                        rate: item.latest_rate || 'N/A'
                    }));

                    bc = 'USD';
                    
                    const latestDate = rawCurrencies.reduce((latest, item) => {
                        const latestDateObj = latest ? new Date(latest) : new Date(0); 
                        return (new Date(item.rate_date) > latestDateObj ? item.rate_date : latest);
                    }, rawCurrencies[0]?.rate_date || getMaxDate());
                    date = latestDate;
                    
                    pagination = apiPagination;
                }

                if (append) {
                    setRates((prevRates) => {
                        const existingCurrencies = new Set(prevRates.map(r => r.currency));
                        const uniqueNewRates = processedRates.filter(r => !existingCurrencies.has(r.currency)); 
                        return [...prevRates, ...uniqueNewRates];
                    });
                    setPage(pageNum);
                } else {
                    const finalRates = [usdRate, ...processedRates];
                    setRates(finalRates);
                    setPage(pageNum);
                }

                setCurrentDate(date);
                setBaseCurrency(bc);
                setTotalItems(pagination.total || 0); 
                setHasMore(pagination.hasMore || (pagination.page < pagination.totalPages) || false); 

                return true;

            } else {
                throw new Error(response?.error || response?.message || 'Unknown API error');
            }
        } catch (err) {
            setError(err.message || 'Failed to load exchange rates');
            console.error('Error loading rates:', err);
            if (!append) setRates([]);
            setHasMore(false);
            setTotalItems(0);
            return false;
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadInitialRates = async () => {
            if (mounted) {
                setInitialLoading(true);
                await performLoadRates(1, null, false);
            }
        };

        loadInitialRates();

        return () => { mounted = false; };
    }, []);

    const handleLoadMore = async () => {
        if (loading || !hasMore) return;

        const nextPage = page + 1;
        console.log('Loading more - Current page:', page, 'Next page:', nextPage);

        await performLoadRates(nextPage, selectedDate, true);
    };

    const handleRefresh = () => {
        performLoadRates(1, selectedDate, false); 
    };

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        performLoadRates(1, newDate, false); 
    };

    const handleClearDate = () => {
        setSelectedDate('');
        performLoadRates(1, null, false); 
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <RatesHeader
                selectedDate={selectedDate}
                currentDate={currentDate}
                baseCurrency={baseCurrency}
                ratesLength={rates.length}
                totalItems={totalItems}
                hasMore={hasMore}
                loading={loading && !rates.length} 
                handleDateChange={handleDateChange}
                handleClearDate={handleClearDate}
                handleRefresh={handleRefresh}
                formatDate={formatDate}
                getMaxDate={getMaxDate}
            />

            <div className="max-w-6xl mx-auto">
                {error && <ErrorBanner error={error} />}

                {initialLoading && !rates.length && <LoadingState />}

                {!initialLoading && !rates.length && !error && (
                    <NoRatesState selectedDate={selectedDate} currentDate={currentDate} formatDate={formatDate} />
                )}

                {rates.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                        {rates.map(rate => (
                            <RateCard key={rate.currency} rate={rate} baseCurrency={baseCurrency} formatRate={formatRate} />
                        ))}
                    </div>
                )}

                {rates.length > 0 && (
                    <LoadMoreButton
                        loading={loading} 
                        hasMore={hasMore}
                        handleLoadMore={handleLoadMore}
                        totalItems={totalItems}
                        ratesLength={rates.length}
                    />
                )}
            </div>
        </div>
    );
};

export default App;