"use client";

import { useState, useEffect, useMemo } from "react";
import {
    ChevronDown,
    ChevronUp,
    MoreHorizontal,
    Trash,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { exportToCSV, exportToPDF } from "@/actions/export";

// Constants for UI and Logic
const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
    // --- State Management ---
    const [selectedIds, setSelectedIds] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field: "date",
        direction: "desc",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    // --- Data Processing (Filtering & Sorting) ---
    // useMemo ensures we only recalculate when inputs change, optimizing performance
    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        // 1. Search Filter (Description-based)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) =>
                transaction.description?.toLowerCase().includes(searchLower)
            );
        }

        // 2. Type Filter (Income/Expense)
        if (typeFilter) {
            result = result.filter(
                (transaction) => transaction.type === typeFilter
            );
        }

        // 3. Recurring Status Filter
        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === "recurring")
                    return transaction.isRecurring;
                return !transaction.isRecurring;
            });
        }

        // 4. Sorting Logic
        result.sort((a, b) => {
            let comparison = 0;

            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;
                default:
                    comparison = 0;
            }

            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return result;
    }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

    // --- Pagination Calculations ---
    const totalPages = Math.ceil(
        filteredAndSortedTransactions.length / ITEMS_PER_PAGE
    );
    
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedTransactions.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [filteredAndSortedTransactions, currentPage]);

    // --- Event Handlers ---
    
    // Toggles sort direction or changes the active sort field
    const handleSort = (field) => {
        setSortConfig((current) => ({
            field,
            direction:
                current.field === field && current.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    // Toggle individual row selection
    const handleSelect = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };

    // Select/Deselect all rows on the current page
    const handleSelectAll = () => {
        setSelectedIds((current) =>
            current.length === paginatedTransactions.length
                ? []
                : paginatedTransactions.map((t) => t.id)
        );
    };

    // Custom hook for handling the bulk delete API call
    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
    } = useFetch(bulkDeleteTransactions);

    const handleBulkDelete = async () => {
        if (
            !window.confirm(
                `Are you sure you want to delete ${selectedIds.length} transactions?`
            )
        )
            return;

        deleteFn(selectedIds);
    };

    // Side effect to notify user of successful deletion
    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.error("Transactions deleted successfully");
        }
    }, [deleted, deleteLoading]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setSelectedIds([]); // Reset selection when navigating to a new page
    };

    return (
        <div className="space-y-4">
            {/* Show loading bar during bulk deletion */}
            {deleteLoading && (
                <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
            )}

            {/* --- Filter Bar --- */}
            <div className="flex flex-col sm:flex-row gap-4 pt-5">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-8"
                    />
                </div>
                
                <div className="flex gap-2">
                    {/* Income/Expense Filter */}
                    <Select
                        value={typeFilter}
                        onValueChange={(value) => {
                            setTypeFilter(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INCOME">Income</SelectItem>
                            <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Recurring Filter */}
                    <Select
                        value={recurringFilter}
                        onValueChange={(value) => {
                            setRecurringFilter(value);
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recurring">
                                Recurring Only
                            </SelectItem>
                            <SelectItem value="non-recurring">
                                Non-recurring Only
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Bulk Action: Delete */}
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                            >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedIds.length})
                            </Button>
                        </div>
                    )}

                    {/* Clear Filters Button */}
                    {(searchTerm || typeFilter || recurringFilter) && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleClearFilters}
                            title="Clear filters"
                        >
                            <X className="h-4 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* --- Export Options --- */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                {/* Export only the rows the user has manually checked */}
                <Button
                    size="sm"
                    variant="outline"
                    disabled={selectedIds.length === 0}
                    onClick={() =>
                        exportToCSV(
                            filteredAndSortedTransactions.filter((t) =>
                                selectedIds.includes(t.id)
                            )
                        )
                    }
                >
                    Export Selected (CSV)
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={selectedIds.length === 0}
                    onClick={() =>
                        exportToPDF(
                            filteredAndSortedTransactions.filter((t) =>
                                selectedIds.includes(t.id)
                            )
                        )
                    }
                >
                    Export Selected (PDF)
                </Button>

                {/* Export all rows that match the current filters/search (ignoring individual selection) */}
                <Button
                    size="sm"
                    variant="default"
                    onClick={() => exportToCSV(filteredAndSortedTransactions)}
                >
                    Export All (CSV)
                </Button>
                <Button
                    size="sm"
                    variant="default"
                    onClick={() => exportToPDF(filteredAndSortedTransactions)}
                >
                    Export All (PDF)
                </Button>
            </div>

            {/* --- Data Table --- */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            paginatedTransactions.length &&
                                        paginatedTransactions.length > 0
                                    }
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("date")}
                            >
                                <div className="flex items-center">
                                    Date
                                    {sortConfig.field === "date" &&
                                        (sortConfig.direction === "asc" ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        ))}
                                </div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead
                                className="cursor-pointer"
                                onClick={() => handleSort("category")}
                            >
                                <div className="flex items-center">
                                    Category
                                    {sortConfig.field === "category" &&
                                        (sortConfig.direction === "asc" ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        ))}
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer text-right"
                                onClick={() => handleSort("amount")}
                            >
                                <div className="flex items-center justify-end">
                                    Amount
                                    {sortConfig.field === "amount" &&
                                        (sortConfig.direction === "asc" ? (
                                            <ChevronUp className="ml-1 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        ))}
                                </div>
                            </TableHead>
                            <TableHead>Recurring</TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center text-muted-foreground"
                                >
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                transaction.id
                                            )}
                                            onCheckedChange={() =>
                                                handleSelect(transaction.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(transaction.date),
                                            "PP"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.description}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        <span
                                            style={{
                                                background:
                                                    categoryColors[
                                                        transaction.category
                                                    ],
                                            }}
                                            className="px-2 py-1 rounded text-white text-sm"
                                        >
                                            {transaction.category}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            "text-right font-medium",
                                            transaction.type === "EXPENSE"
                                                ? "text-red-500"
                                                : "text-green-500"
                                        )}
                                    >
                                        {transaction.type === "EXPENSE"
                                            ? "-"
                                            : "+"}
                                        ₹{transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.isRecurring ? (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                        >
                                                            <RefreshCw className="h-3 w-3" />
                                                            {
                                                                RECURRING_INTERVALS[
                                                                    transaction
                                                                        .recurringInterval
                                                                ]
                                                            }
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-sm">
                                                            <div className="font-medium">
                                                                Next Date:
                                                            </div>
                                                            <div>
                                                                {format(
                                                                    new Date(
                                                                        transaction.nextRecurringDate
                                                                    ),
                                                                    "PPP"
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="gap-1"
                                            >
                                                <Clock className="h-3 w-3" />
                                                One-time
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {/* Action Menu (Edit/Delete) */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        router.push(
                                                            `/transaction/create?edit=${transaction.id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() =>
                                                        deleteFn([
                                                            transaction.id,
                                                        ])
                                                    }
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}