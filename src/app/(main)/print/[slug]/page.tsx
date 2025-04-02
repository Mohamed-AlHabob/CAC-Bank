import { getPageBySlug } from "@/app/action";
import PageContent from "@/components/sections/section-page/page-content";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

export default async function PrintPage({ params }: PageProps) {
  const slug = (await params).slug
  const page = await getPageBySlug(slug);
  
  if (!page) {
    return notFound();
  }

  return (
    <div className="print-container bg-background  min-h-screen p-8">
      <div className="pdf-loading-indicator absolute top-0 left-0 w-full h-1  animate-pulse" />
      <PageContent page={page} />
      <div className="page-break" style={{ marginTop: '20mm' }} />
    </div>
  );
}