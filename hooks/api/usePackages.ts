import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/types/api";
import { endpoints } from "@/lib/api/client";

export interface PackageType {
  _id?: string;
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  offer?: boolean;
  status?: "active" | "inactive";
  createdAt?: string;
}

export function usePackages(status?: "active") {
  return useQuery({
    queryKey: QueryKeys.packages(status),
    queryFn: async () => {
      const params = status ? { status } : {};
      const response = await endpoints.packages.getPackages(params);
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

export function usePackage(id: string) {
  return useQuery({
    queryKey: QueryKeys.package(id),
    queryFn: async () => {
      const response = await endpoints.packages.getPackage(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (packageData: Partial<PackageType>) =>
      endpoints.packages.createPackage(packageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.packages() });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      packageData,
    }: {
      id: string;
      packageData: Partial<PackageType>;
    }) => endpoints.packages.updatePackage(id, packageData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.package(id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.packages() });
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => endpoints.packages.deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.packages() });
    },
  });
}

export function usePackageStats() {
  return useQuery({
    queryKey: QueryKeys.packageStats(),
    queryFn: async () => {
      const response = await endpoints.packages.getPackageStats();
      return response.data;
    },
    staleTime: 1 * 60 * 1000,
    retry: false,
  });
}
