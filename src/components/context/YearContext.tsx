"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Year, Page, AnnualReport } from "@prisma/client";

interface YearContextType {
  currentYear: YearWithPages | null;
  changeYear: (year: YearWithPages) => void;
}

export interface YearWithPages extends Year {
  pages: Page[];
  annualReport :AnnualReport[]
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({
  children,
  initialYear,
}: {
  children: ReactNode;
  initialYear: YearWithPages | null;
}) => {
  const [currentYear, setCurrentYear] = useState<YearWithPages | null>(initialYear);

  const changeYear = (year: YearWithPages) => setCurrentYear(year);

  return (
    <YearContext.Provider value={{ currentYear, changeYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) throw new Error("useYear must be used within a YearProvider");
  return context;
};