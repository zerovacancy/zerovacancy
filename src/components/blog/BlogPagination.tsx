import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: BlogPaginationProps) => {
  // If there's only 1 page, don't render pagination
  if (totalPages <= 1) {
    return null;
  }
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always include first page
    pages.push(1);
    
    // Current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Always include last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Add ellipsis indicators
    const result = [];
    let previousPage = 0;
    
    for (const page of pages) {
      if (page - previousPage > 1) {
        result.push(-1); // -1 represents ellipsis
      }
      result.push(page);
      previousPage = page;
    }
    
    return result;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-md border 
          ${currentPage === 1 
            ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
            : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      
      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === -1) {
          // Render ellipsis
          return (
            <span 
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-gray-500"
            >
              ...
            </span>
          );
        }
        
        // Render page number
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-9 w-9 items-center justify-center rounded-md border 
              ${currentPage === page 
                ? 'border-brand-purple-medium bg-brand-purple-medium text-white' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-md border 
          ${currentPage === totalPages 
            ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
            : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default BlogPagination;