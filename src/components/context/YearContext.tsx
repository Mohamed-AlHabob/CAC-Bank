"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Year, Page } from '@prisma/client';

interface YearContextType {
  currentYear: YearWithPages | null;
  changeYear: (year: YearWithPages) => void;
}

export interface YearWithPages extends Year {
  pages: Page[];
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({
  children,
  initialYear,
}: {
  children: ReactNode;
  initialYear: YearWithPages;
}) => {
  const [currentYear, setCurrentYear] = useState<YearWithPages>(initialYear);

  const changeYear = (year: YearWithPages) => setCurrentYear(year);

  return (
    <YearContext.Provider value={{ currentYear, changeYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) throw new Error('useYear must be used within a YearProvider');
  return context;
};
