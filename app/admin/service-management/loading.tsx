import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceManagementLoading() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 bg-white/10" />
            <Skeleton className="h-4 w-96 mt-2 bg-white/10" />
          </div>
          <Skeleton className="h-10 w-32 bg-white/10" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <Skeleton className="h-4 w-24 bg-white/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-white/10" />
            </CardContent>
          </Card>
        </div>

        {/* Services List Skeleton */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <Skeleton className="h-6 w-32 bg-white/10" />
            <Skeleton className="h-4 w-64 bg-white/10" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
                      <div className="flex gap-1">
                        <Skeleton className="h-6 w-6 bg-white/10" />
                        <Skeleton className="h-6 w-6 bg-white/10" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-32 mb-2 bg-white/10" />
                    <Skeleton className="h-12 w-full bg-white/10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
