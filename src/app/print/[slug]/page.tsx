import { getPageBySlug } from "@/app/action";
import PageContent from "@/components/sections/section-page/page-content";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

// In your print page component
export default async function PrintPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);
  
  if (!page) {
    return notFound();
  }

  return (
    <div className="print-container bg-background  min-h-screen p-8">
      {/* Add a loading indicator that will be visible during PDF generation */}
      <div className="pdf-loading-indicator absolute top-0 left-0 w-full h-1  animate-pulse" />
      
      <PageContent page={page} />
      
      {/* Add a page break with some margin */}
      <div className="page-break" style={{ marginTop: '20mm' }} />
      
      {/* Ensure all fonts are loaded */}
      {/* <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      `}</style> */}
    </div>
  );
}