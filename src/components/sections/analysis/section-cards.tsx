"use client";

import { TrendingDownIcon, TrendingUpIcon, PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useYear } from "@/components/context/YearContext";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

function RevenueCard({ totalProfit, fiscalYear }: { totalProfit: number; fiscalYear: string }) {
  return (
    <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
      <CardHeader className="relative">
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {totalProfit}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <TrendingUpIcon className="size-3" />
            +12.5%
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this {fiscalYear} <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

function AnnualReportCard({ 
  annual, 
  isSignedIn, 
  onEdit, 
  onDelete 
}: { 
  annual: any; 
  isSignedIn: boolean; 
  onEdit: () => void; 
  onDelete: () => void;
}) {
  return (
    <Card className="@container/card bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
      <CardHeader className="relative">
        <CardDescription>{annual?.field || ""}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {annual?.value || ""}
        </CardTitle>
        {isSignedIn && (
          <div className="absolute right-4 top-4 flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onEdit}
              aria-label="Edit report"
            >
              <PencilIcon className="size-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive/90"
              aria-label="Delete report"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Down 20% this period <TrendingDownIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Acquisition needs attention
        </div>
      </CardFooter>
    </Card>
  );
}

function AddReportCard({ onClick }: { onClick: () => void }) {
  return (
    <Card 
      className="@container/card flex items-center justify-center min-h-[100px] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs hover:bg-primary/10 transition-colors cursor-pointer" 
      onClick={onClick}
    >
      <Button 
        variant="ghost" 
        size="lg"
        className="gap-2"
      >
        <PlusIcon className="size-5" />
        Add Annual Report
      </Button>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex justify-center items-center p-8 w-full">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>
            There is no annual data to display at this time.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export function SectionCards() {
  const { currentYear } = useYear();
  const { isSignedIn } = useAuth();
  const { onOpen } = useModal();

  if (!currentYear) {
    return <EmptyState />;
  }

  const handleEditReport = (annual: any) => onOpen("editAnnualReport", { annualReport: annual });
  const handleDeleteReport = (annual: any) => onOpen("deleteAnnualReport", { annualReport: annual });
  const handleAddReport = () => onOpen("createAnnualReport");

  return (
    <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-4 lg:px-6">
      <RevenueCard 
        totalProfit={currentYear.totalProfit || 0} 
        fiscalYear={currentYear.fiscalYear} 
      />
      
      {(currentYear.annualReports || []).map((annual, index) => (
        <AnnualReportCard 
          key={`annual-report-${index}`}
          annual={annual}
          isSignedIn={isSignedIn ?? false}
          onEdit={() => handleEditReport(annual)}
          onDelete={() => handleDeleteReport(annual)}
        />
      ))}
      
      {isSignedIn && <AddReportCard onClick={handleAddReport} />}
    </div>
  );
}
