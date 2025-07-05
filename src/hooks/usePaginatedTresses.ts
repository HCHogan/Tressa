import { useState, useEffect, useCallback } from "react";
import { TreePreview, PaginationInfo } from "@/types";
import { getPublicTressesPages, getMyTressesPages } from "@/api/tress";

interface UsePaginatedTressesResult {
  tresses: TreePreview[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  loadPage: (page: number) => void;
  refresh: () => void;
}

interface UsePaginatedTressesOptions {
  endpoint: "public" | "my";
  pageSize?: number;
  autoLoad?: boolean;
}

export function usePaginatedTresses({
  endpoint,
  pageSize = 20,
  autoLoad = true,
}: UsePaginatedTressesOptions): UsePaginatedTressesResult {
  const [tresses, setTresses] = useState<TreePreview[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false); // 添加标记避免重复加载

  const loadPage = useCallback(
    async (page: number) => {
      if (page < 1) return;

      setLoading(true);
      setError(null);

      try {
        let response;
        if (endpoint === "public") {
          response = await getPublicTressesPages(page, pageSize);
        } else {
          response = await getMyTressesPages(page, pageSize);
        }

        setTresses(response.items);
        setPagination(response.pagination);
        setCurrentPage(page);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "加载数据失败";
        setError(errorMessage);
        console.error("Error loading paginated tresses:", err);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pageSize]
  );

  const refresh = useCallback(() => {
    loadPage(currentPage);
  }, [loadPage, currentPage]);

  // 当 endpoint 或 pageSize 变化时，重置到第一页
  // 使用 hasLoaded 标记避免重复加载
  useEffect(() => {
    if (autoLoad && !hasLoaded) {
      setCurrentPage(1);
      setHasLoaded(true);
      // 直接调用 API 而不是通过 loadPage，避免依赖循环
      const loadInitialPage = async () => {
        setLoading(true);
        setError(null);

        try {
          let response;
          if (endpoint === "public") {
            response = await getPublicTressesPages(1, pageSize);
          } else {
            response = await getMyTressesPages(1, pageSize);
          }

          setTresses(response.items);
          setPagination(response.pagination);
          setCurrentPage(1);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "加载数据失败";
          setError(errorMessage);
          console.error("Error loading initial paginated tresses:", err);
        } finally {
          setLoading(false);
        }
      };

      loadInitialPage();
    }
  }, [endpoint, pageSize, autoLoad, hasLoaded]);

  // 当 endpoint 或 pageSize 变化时，重置 hasLoaded 标记
  useEffect(() => {
    setHasLoaded(false);
    setTresses([]);
    setPagination(null);
    setCurrentPage(1);
  }, [endpoint, pageSize]);

  return {
    tresses,
    pagination,
    loading,
    error,
    loadPage,
    refresh,
  };
}

// 导出一个简化版本，用于只需要公开数据的场景
export function usePublicTresses(pageSize: number = 20) {
  return usePaginatedTresses({
    endpoint: "public",
    pageSize,
  });
}

// 导出一个简化版本，用于只需要用户数据的场景
export function useMyTresses(pageSize: number = 20) {
  return usePaginatedTresses({
    endpoint: "my",
    pageSize,
  });
}
