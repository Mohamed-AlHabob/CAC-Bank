import { getPageByٍlug } from "@/app/action"
import PageContent from "@/components/sections/sectionPage/page-content"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function Page({ params }: PageProps) {
  const {  slug } = params

  const page = await getPageByٍlug(slug)

  return (
    <div className="min-h-screen w-full" data-registry="plate">
        <PageContent page={page} />
    </div>
  )
}

