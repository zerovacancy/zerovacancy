import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  FileText, 
  Filter, 
  Calendar, 
  User 
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BlogService } from '@/services/BlogService';
import { BlogPostPreview, BlogPostsFilters, BlogCategory } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/SEO';
import { useAuth } from '@/components/auth/AuthContext';

const BlogAdmin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BlogPostsFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const postsPerPage = 10;
  
  // Check admin access
  useEffect(() => {
    // Wait until auth state is loaded
    if (!authLoading) {
      const adminToken = sessionStorage.getItem('adminAccessToken');
      
      // If not authenticated or no admin token, redirect to login
      if (!isAuthenticated || adminToken !== 'granted') {
        navigate('/admin/login');
      }
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Load posts and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch posts with current filters and pagination
        const { posts, totalCount } = await BlogService.getAdminPosts({
          ...filters,
          page: currentPage,
          limit: postsPerPage
        });
        
        setPosts(posts);
        setTotalPosts(totalCount);
        
        // Fetch categories for filtering
        const { categories } = await BlogService.getCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Only fetch data if authenticated
    if (isAuthenticated) {
      fetchData();
    }
  }, [currentPage, filters, isAuthenticated]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery }));
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle category filter
  const handleCategoryFilter = (slug: string) => {
    setFilters(prev => ({ ...prev, category: slug }));
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle post deletion
  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await BlogService.deletePost(id);
        // Refresh the post list
        const { posts, totalCount } = await BlogService.getAdminPosts({
          ...filters,
          page: currentPage,
          limit: postsPerPage
        });
        
        setPosts(posts);
        setTotalPosts(totalCount);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Get status badge color
  const getStatusBadgeColor = (publishedAt: string | null) => {
    if (!publishedAt) {
      return 'bg-yellow-100 text-yellow-800'; // Draft
    }
    return 'bg-green-100 text-green-800'; // Published
  };
  
  return (
    <AdminLayout>
      <SEO
        title="Blog Management | ZeroVacancy Admin"
        description="Manage blog posts, categories, and content"
        noindex={true}
      />
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark transition-colors"
          >
            <Plus size={18} className="mr-2" />
            New Post
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
            </div>
          </form>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 flex items-center">
              <Filter size={16} className="mr-1" />
              Filter:
            </span>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple"
              value={filters.category || ''}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            
            {(filters.search || filters.category) && (
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        {/* Posts table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full"></div>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <FileText size={18} className="text-gray-400 mr-3 flex-shrink-0 mt-1" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {post.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {post.author.avatar ? (
                            <img 
                              src={post.author.avatar} 
                              alt={post.author.name} 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <User size={18} className="text-gray-400 mr-2" />
                          )}
                          <span className="text-sm text-gray-900">{post.author.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(post.publishedAt)}`}>
                          {post.publishedAt ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-1 text-gray-400" />
                          {post.publishedAt 
                            ? formatDate(post.publishedAt, { format: 'short' })
                            : 'Not published'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View"
                            target="_blank"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/admin/blog/edit/${post.id}`}
                            className="text-amber-600 hover:text-amber-900"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * postsPerPage + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * postsPerPage, totalPosts)}
                  </span>{' '}
                  of <span className="font-medium">{totalPosts}</span> posts
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.category
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new blog post.'}
            </p>
            <div className="mt-6">
              <Link
                to="/admin/blog/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-brand-purple-dark"
              >
                <Plus size={18} className="-ml-1 mr-2" />
                New Post
              </Link>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogAdmin;