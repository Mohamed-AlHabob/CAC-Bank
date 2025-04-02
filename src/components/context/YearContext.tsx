"use client";
import { createContext, useState, ReactNode, useMemo, useCallback, useContext } from "react";
import { Year, AnnualReport, Page } from "@prisma/client";
import { getAllYearsWithPages } from "@/app/action";

export interface PageWithChildrenPages extends Page {
  childrenPages: Page[];
}

export interface YearWithPages extends Year {
  pages: PageWithChildrenPages[];
  annualReports: AnnualReport[];
}


interface YearContextType {
  years: YearWithPages[];
  currentYear: YearWithPages | null;
  changeYear: (yearId: string) => void;
  refreshYears: () => Promise<void>; // Add this
  isLoading: boolean;
  error: string | null;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({
  children,
  initialYear,
  years: initialYears,
}: {
  children: ReactNode;
  initialYear: YearWithPages | null;
  years: YearWithPages[];
}) => {
  const [currentYear, setCurrentYear] = useState<YearWithPages | null>(initialYear);
  const [allYears, setAllYears] = useState<YearWithPages[]>(initialYears || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add this function to refresh years data
  const refreshYears = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedYears = await getAllYearsWithPages();
      setAllYears(updatedYears);
      
      // Maintain the current year selection if it still exists
      if (currentYear) {
        const newCurrentYear = updatedYears.find(y => y.id === currentYear.id);
        setCurrentYear(newCurrentYear || updatedYears[0] || null);
      } else {
        setCurrentYear(updatedYears[0] || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh years");
    } finally {
      setIsLoading(false);
    }
  }, [currentYear]);

  const changeYear = useCallback((yearId: string) => {
    try {
      setIsLoading(true);
      const selectedYear = allYears.find(year => year.id === yearId);
      if (selectedYear) {
        setCurrentYear(selectedYear);
      } else {
        setError(`Year with ID ${yearId} not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change year");
    } finally {
      setIsLoading(false);
    }
  }, [allYears]);

  const contextValue = useMemo(() => ({
    years: allYears,
    currentYear,
    changeYear,
    refreshYears,
    isLoading,
    error,
  }), [allYears, currentYear, changeYear, refreshYears, isLoading, error]);

  return (
    <YearContext.Provider value={contextValue}>
      {children}
    </YearContext.Provider>
  );
};
export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) throw new Error("useYear must be used within a YearProvider");
  return context;
};