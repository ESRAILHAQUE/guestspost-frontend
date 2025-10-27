import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlogManagementLoading() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2 bg-white/10" />
            <Skeleton className="h-4 w-64 bg-white/10" />
          </div>
          <Skeleton className="h-10 w-32 bg-white/10" />
        </div>

        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-6 w-64 bg-white/10" />
                      <Skeleton className="h-5 w-20 bg-white/10" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2 bg-white/10" />
                    <Skeleton className="h-4 w-3/4 mb-2 bg-white/10" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-24 bg-white/10" />
                      <Skeleton className="h-4 w-24 bg-white/10" />
                      <Skeleton className="h-5 w-16 bg-white/10" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 bg-white/10" />
                    <Skeleton className="h-8 w-8 bg-white/10" />
                    <Skeleton className="h-8 w-8 bg-white/10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16 bg-white/10" />
                  <Skeleton className="h-5 w-20 bg-white/10" />
                  <Skeleton className="h-5 w-18 bg-white/10" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
