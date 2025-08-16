'use client'

import Link from 'next/link'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  basePath = '/',
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const createPageLink = (page) => `${basePath}?page=${page}`

  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }

  return (
    <div className="text-gray-800 flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
      {/* Mobile Navigation */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={createPageLink(currentPage - 1)}
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10"
        >
          Previous
        </Link>
        <Link
          href={createPageLink(currentPage + 1)}
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10"
        >
          Next
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
            <Link
              href={createPageLink(Math.max(currentPage - 1, 1))}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft aria-hidden="true" className="size-5" />
            </Link>

            {getPageNumbers().map((page, index) =>
              page === '...' ? (
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-700 focus:outline-offset-0"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={index}
                  href={createPageLink(page)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-indigo-500 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                      : 'text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {page}
                </Link>
              )
            )}

            <Link
              href={createPageLink(Math.min(currentPage + 1, totalPages))}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight aria-hidden="true" className="size-5" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Pagination
