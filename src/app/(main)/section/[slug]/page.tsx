
import { getPageBySlug } from "@/app/action";
import PageContent from "@/components/sections/section-page/page-content"
import type { Page } from "@prisma/client";
import { notFound } from "next/navigation";


type PageProps = {
	params: Promise<{ slug: string}>
	
  }

export default async function Page({ params }: PageProps) {
  const slug = (await params).slug

  const page = await getPageBySlug(slug)
  
  if (!page) {
    return notFound();
  }
  return (
    <div className="min-h-screen w-full" data-registry="plate">
        <PageContent page={page as Page} />
    </div>
  )
}

