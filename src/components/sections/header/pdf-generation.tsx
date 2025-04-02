'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/global/spinner';
import { useState } from 'react';
import { useYear } from '@/components/context/YearContext';
import { toast } from 'sonner';

export function GeneratePDFButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { currentYear } = useYear();

  const getAllSlugsForYear = (): string[] => {
    if (!currentYear) return [];
    return currentYear.pages.flatMap(page => [page.slug, ...page.childrenPages.map(child => child.slug)]);
  };

  const generatePDF = async () => {
    if (!currentYear) {
      toast.error('No year selected');
      return;
    }

    setIsGenerating(true);
    const slugs = getAllSlugsForYear();

    if (slugs.length === 0) {
      toast.error('No pages available for PDF generation');
      setIsGenerating(false);
      return;
    }

    try {
      await toast.promise(
        fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageUrls: slugs.map(slug => `${window.location.origin}/print/${slug}`),
          }),
        })
          .then(async response => {
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || 'PDF generation failed');
            }
            return response.blob();
          })
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentYear.fiscalYear}-annual-report.pdf`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
              URL.revokeObjectURL(url);
              a.remove();
            }, 100);
          }),
        {
          loading: 'Generating PDF... This may take a moment',
          success: 'PDF generated successfully!',
          error: {
            message: 'Failed to generate PDF',
            description: 'Please try again with fewer pages or check your network connection',
            duration: 10000,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      className="rounded-full px-4 py-1.5 text-xs"
      onClick={generatePDF} 
      disabled={isGenerating || !currentYear}
      aria-label="Download Full Report as PDF"
    >
      {isGenerating ? <Spinner /> : 'Download Full Report as PDF'}
    </Button>
  );
}