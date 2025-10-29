import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClientReviewsLoading() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-48 bg-white/10" />
          </div>
          <Skeleton className="h-10 w-32 bg-white/10" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="bg-white/10 border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-4 w-4 bg-white/10" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 bg-white/10" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reviews List Skeleton */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <Skeleton className="h-6 w-32 bg-white/10" />
            <Skeleton className="h-4 w-48 bg-white/10" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <Skeleton className="h-4 w-1/4 mb-2 bg-white/10" />
                  <Skeleton className="h-3 w-3/4 mb-2 bg-white/10" />
                  <Skeleton className="h-3 w-1/2 bg-white/10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
