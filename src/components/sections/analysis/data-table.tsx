"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, PlusIcon, FileDownIcon, FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { YearWithPages } from "@/components/context/YearContext"
import { useAuth } from "@clerk/nextjs"
import { ModalType, useModal } from "@/hooks/use-modal-store"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function createColumns(data: YearWithPages[], isSignedIn: boolean, onOpen: (modalType: ModalType, modalProps?: Record<string, any>) => void): ColumnDef<YearWithPages>[] {
  // Extract all report fields
  const allReportFields = new Set<string>()
  data.forEach((year) => {
    year.annualReports.forEach((report) => {
      allReportFields.add(report.field)
    })
  })
  const fieldNames = Array.from(allReportFields)

  const columns: ColumnDef<YearWithPages>[] = [
    {
      id: "select",
      header: ({ table }) =>
        isSignedIn ? (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ) : null,
      cell: ({ row }) =>
        isSignedIn ? (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ) : null,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fiscalYear",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fiscal Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("fiscalYear")}</div>,
    },
    {
      accessorKey: "totalProfit",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            Total Profit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const profit = Number.parseFloat(row.getValue("totalProfit") || "0")
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(profit)

        return (
          <div
            className={`text-right font-medium ${profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {formatted}
            <Badge
              className={`ml-2 ${profit >= 0 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"}`}
            >
              {profit >= 0 ? "+" + profit.toFixed(2) + "%" : profit.toFixed(2) + "%"}
            </Badge>
          </div>
        )
      },
    },
  ]

  // Add dynamic columns for each report field
  fieldNames.forEach((field) => {
    columns.push({
      id: field,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full justify-end"
          >
            {field}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const annualReports = row.original.annualReports
        const report = annualReports.find((r: { field: string }) => r.field === field)
        const value = report ? Number.parseFloat(report.value) : 0
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value)

        return (
          <div className={`text-right font-medium ${value >= 0 ? "" : "text-red-600 dark:text-red-400"}`}>
            {formatted}
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const valueA = rowA.original.annualReports.find((r) => r.field === field)?.value || "0"
        const valueB = rowB.original.annualReports.find((r) => r.field === field)?.value || "0"
        return Number.parseFloat(valueA) - Number.parseFloat(valueB)
      },
    })
  })

  if (isSignedIn) {
    columns.push({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const year = row.original
        const profit = Number.parseFloat(year.totalProfit?.toString() || "0")

        return (
          <div className="flex items-center justify-end gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${profit >= 0 ? "bg-green-500" : "bg-red-500"}`} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(year.id)}>Copy Year ID</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onOpen("editYear", { year })}>Edit Year</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpen("createAnnualReport", { years: [year] })}>
                  Add Report
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => onOpen("deleteYear", { year })}>
                  Delete Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    })
  }

  return columns
}

// Helper function to export table data to CSV
function exportToCSV(data: YearWithPages[], columns: ColumnDef<YearWithPages>[]) {
  // Get visible columns excluding select and actions
  const visibleColumns = columns.filter((col) => col.id !== "select" && col.id !== "actions")

  // Create header row
  const headers = visibleColumns.map((col) => col.id || "").join(",")

  // Create data rows
  const rows = data
    .map((year) => {
      return visibleColumns
        .map((col) => {
          if (col.id === "fiscalYear") return year.fiscalYear
          if (col.id === "totalProfit") return year.totalProfit

          // Handle report fields
          const report = year.annualReports.find((r) => r.field === col.id)
          return report ? report.value : "0"
        })
        .join(",")
    })
    .join("\n")

  // Combine headers and rows
  const csv = `${headers}\n${rows}`

  // Create download link
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "annual_data.csv")
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function DataTable({ data }: { data: YearWithPages[] }) {
  const { isSignedIn } = useAuth()
  const { onOpen } = useModal()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pageSize, setPageSize] = React.useState(5)
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Create columns
  const columns = createColumns(data, isSignedIn ?? false, onOpen)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  })

  // Handle empty state
  if (data.length === 0) {
    return (
      <Card className="w-full mx-4 lg:mx-6">
        <CardHeader className="text-center">
          <CardTitle>No Annual Data Available</CardTitle>
          {isSignedIn && (
            <Button variant="outline" size="sm" onClick={() => onOpen("createYear")} className="mt-4 gap-1">
              <PlusIcon className="size-3.5" />
              Add First Year
            </Button>
          )}
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-4 px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <FilterIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 max-w-sm"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportToCSV(data, columns)} className="gap-1">
            <FileDownIcon className="size-3.5" />
            Export CSV
          </Button>

          {isSignedIn && (
            <Button variant="outline" size="sm" onClick={() => onOpen("createYear")} className="gap-1">
              <PlusIcon className="size-3.5" />
              Add Year
            </Button>
          )}

          <select
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} rows
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.id !== "select" && header.id !== "fiscalYear" ? "text-right" : ""}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.id !== "select" && cell.column.id !== "fiscalYear" ? "text-right" : ""}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {isSignedIn && table.getRowModel().rows?.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

