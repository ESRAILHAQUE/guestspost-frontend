import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api/client";
import { useCurrentUser } from "./useAuth";

export function useAdminStats() {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Only fetch admin stats if user is admin
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Admin access required");
      }

      try {
        const [usersRes, websitesRes, ordersRes, fundsRes] = await Promise.all([
          endpoints.users.getUsers(),
          endpoints.websites.getWebsites(),
          endpoints.orders.getOrders(),
          endpoints.fundRequests.getFundRequests(),
        ]);

        const users = usersRes.data;
        const activeUsers = users.filter(
          (user: any) => user.user_status === "active"
        );
        const websites = websitesRes.data || [];
        const activeWebsites =
          websites?.filter((site: any) => site.status === "active").length || 0;
        const orders = ordersRes.data || [];
        const fundRequests = fundsRes.data || [];
        const pendingRequests = fundRequests.filter(
          (req: any) => req.status === "pending"
        );
        const totalRevenue = orders.reduce(
          (sum: number, order: any) => sum + (parseInt(order.price) || 0),
          0
        );

        return {
          totalUsers: users.length,
          activeUsers: activeUsers.length,
          totalWebsites: websites.length,
          activeWebsites,
          totalOrders: orders.length,
          totalFundRequests: fundRequests.length,
          pendingFundRequests: pendingRequests.length,
          totalRevenue,
        };
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
          totalUsers: 0,
          activeUsers: 0,
          totalWebsites: 0,
          activeWebsites: 0,
          totalOrders: 0,
          totalFundRequests: 0,
          pendingFundRequests: 0,
          totalRevenue: 0,
        };
      }
    },
    enabled: !!currentUser && currentUser.role === "admin", // Only fetch if admin
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: false,
  });
}
