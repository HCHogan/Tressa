import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PaginationInfo } from "@/types";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className = "" }: PaginationProps) {
  const [jumpToPage, setJumpToPage] = useState("");

  const { page, total_pages, has_prev, has_next } = pagination;

  // 生成页码数组
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7; // 最多显示7个页码

    if (total_pages <= maxVisiblePages) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      // 复杂分页逻辑
      if (page <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total_pages);
      } else if (page >= total_pages - 3) {
        // 当前页在后面
        pages.push(1);
        pages.push("...");
        for (let i = total_pages - 4; i <= total_pages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total_pages);
      }
    }

    return pages;
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= total_pages && pageNum !== page) {
      onPageChange(pageNum);
    }
    setJumpToPage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJumpToPage();
    }
  };

  if (total_pages <= 1) {
    return null; // 只有一页或没有数据时不显示分页
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* 分页信息 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        显示第 <span className="font-medium">{page}</span> 页，共{" "}
        <span className="font-medium">{total_pages}</span> 页，
        总计 <span className="font-medium">{pagination.total_items}</span> 项
      </div>

      {/* 分页控件 */}
      <div className="flex items-center gap-2">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <ChevronLeft className="w-4 h-4" />
          上一页
        </button>

        {/* 页码按钮 */}
        <div className="flex items-center gap-1">
          {generatePageNumbers().map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-500"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              );
            }

            const isCurrentPage = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum as number)}
                className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                  isCurrentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          下一页
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 跳转到指定页 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">跳转到</span>
        <input
          type="number"
          min="1"
          max={total_pages}
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          placeholder={page.toString()}
        />
        <span className="text-gray-600 dark:text-gray-400">页</span>
        <button
          onClick={handleJumpToPage}
          disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > total_pages}
          className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          跳转
        </button>
      </div>
    </div>
  );
}
