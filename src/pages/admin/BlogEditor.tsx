import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Calendar, 
  Image, 
  Eye, 
  ArrowLeft, 
  X, 
  Plus 
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BlogService } from '@/services/BlogService';
import { BlogPost, BlogCategory, BlogAuthor } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/SEO';
import { useAuth } from '@/components/auth/AuthContext';

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isEditing = !!id;
  
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
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  // Publishing state
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Load post data if editing, and load categories and authors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch categories and authors
        const [categoriesData, authorsData] = await Promise.all([
          BlogService.getCategories(),
          BlogService.getAuthors()
        ]);
        
        setCategories(categoriesData.categories);
        setAuthors(authorsData);
        
        // If editing, fetch post data
        if (isEditing && id) {
          const posts = await BlogService.getAdminPosts();
          const post = posts.posts.find(p => p.id === id);
          
          if (post) {
            const fullPost = await BlogService.getPostBySlug(post.slug);
            
            if (fullPost && fullPost.post) {
              populateForm(fullPost.post);
            } else {
              navigate('/admin/blog');
            }
          } else {
            navigate('/admin/blog');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing, navigate]);
  
  // Populate form with post data
  const populateForm = (post: BlogPost) => {
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || '');
    setContent(post.content);
    setCoverImage(post.coverImage || '');
    setCategoryId(post.category.id);
    setAuthorId(post.author.id);
    setTags(post.tags || []);
    setIsPublished(!!post.publishedAt);
    setPublishedAt(post.publishedAt);
  };
  
  // Generate slug from title
  const generateSlug = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setSlug(slug);
  };
  
  // Add a tag
  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Form validation state
  const [validationError, setValidationError] = useState('');
  
  // Validate form before submission
  const validateForm = () => {
    if (!title) {
      setValidationError('Title is required');
      return false;
    }
    
    if (!slug) {
      setValidationError('Slug is required');
      return false;
    }
    
    if (!content) {
      setValidationError('Content is required');
      return false;
    }
    
    if (!categoryId) {
      setValidationError('Category is required');
      return false;
    }
    
    if (!authorId) {
      setValidationError('Author is required');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const now = new Date().toISOString();
      const postData: Partial<BlogPost> = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        publishedAt: isPublished ? (publishedAt || now) : null,
        category: { id: categoryId } as BlogCategory,
        author: { id: authorId } as BlogAuthor,
        tags
      };
      
      console.log('Submitting blog post:', postData);
      
      if (isEditing && id) {
        await BlogService.updatePost(id, postData);
      } else {
        await BlogService.createPost(postData);
      }
      
      // Success - go back to blog admin
      navigate('/admin/blog');
    } catch (error: any) {
      // Extract meaningful error message
      const errorMessage = error.message || 'Failed to save post. Please try again.';
      console.error('Error saving post:', error);
      setValidationError(errorMessage);
      
      // Don't navigate away on error
      window.scrollTo(0, 0); // Scroll to top to show error
    } finally {
      setSaving(false);
    }
  };
  
  // Preview post
  const renderPreview = () => {
    const previewPost: BlogPost = {
      id: id || 'preview',
      title: title || 'Untitled Post',
      slug: slug || 'untitled-post',
      excerpt: excerpt || 'No excerpt provided',
      content: content || 'No content provided',
      coverImage: coverImage || '/placeholder.svg',
      publishedAt: publishedAt || null,
      category: categories.find(c => c.id === categoryId) || { id: '', name: 'Uncategorized', slug: 'uncategorized' },
      author: authors.find(a => a.id === authorId) || { id: '', name: 'Unknown Author' },
      tags: tags,
      readingTime: Math.ceil(content.split(/\s+/).length / 200) || 1
    };
    
    return (
      <div className="prose prose-lg max-w-none">
        {coverImage && (
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full rounded-lg object-cover mb-6 max-h-[400px]"
          />
        )}
        
        <h1>{title || 'Untitled Post'}</h1>
        
        <div className="flex items-center text-gray-500 mb-6 text-sm">
          <span className="font-medium text-gray-700 mr-2">
            {authors.find(a => a.id === authorId)?.name || 'Unknown Author'}
          </span>
          <span className="mx-2">•</span>
          <span>
            {isPublished 
              ? formatDate(publishedAt || new Date().toISOString(), { format: 'long' }) 
              : 'Draft'
            }
          </span>
          <span className="mx-2">•</span>
          <span>
            {Math.ceil(content.split(/\s+/).length / 200) || 1} min read
          </span>
        </div>
        
        {excerpt && <p className="text-lg font-medium text-gray-700 mb-8 italic">{excerpt}</p>}
        
        <div className="mt-6">
          {content.split('\n\n').map((paragraph, idx) => {
            if (!paragraph.trim()) return null;
            
            // Check if it's a heading
            if (paragraph.startsWith('# ')) {
              return <h1 key={idx}>{paragraph.substring(2)}</h1>;
            } else if (paragraph.startsWith('## ')) {
              return <h2 key={idx}>{paragraph.substring(3)}</h2>;
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={idx}>{paragraph.substring(4)}</h3>;
            } else if (paragraph.startsWith('#### ')) {
              return <h4 key={idx}>{paragraph.substring(5)}</h4>;
            }
            
            // Regular paragraph
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>
        
        {tags.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <SEO
        title={isEditing ? "Edit Blog Post | ZeroVacancy Admin" : "Create Blog Post | ZeroVacancy Admin"}
        description="Create or edit blog content for ZeroVacancy"
        noindex={true}
      />
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/admin/blog')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Posts
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center px-4 py-2 border rounded-md ${
              previewMode
                ? 'bg-brand-purple-light/30 border-brand-purple text-brand-purple'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye size={18} className="mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      {/* Validation error message */}
      {validationError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error saving post</p>
            <p className="text-sm">{validationError}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {previewMode ? (
          <div className="max-w-3xl mx-auto py-8">
            {renderPreview()}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {/* Main content - 3 columns */}
              <div className="md:col-span-3 space-y-6">
                {/* Title */}
                <div>
                  <label 
                    htmlFor="title" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => !slug && generateSlug()}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label 
                    htmlFor="slug" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    URL Slug
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /blog/
                    </span>
                    <input
                      type="text"
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="flex-1 block w-full border border-gray-300 rounded-none rounded-r-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                      placeholder="enter-post-slug"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="mt-1 text-xs text-brand-purple hover:text-brand-purple-dark"
                  >
                    Generate from title
                  </button>
                </div>
                
                {/* Excerpt */}
                <div>
                  <label 
                    htmlFor="excerpt" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                    placeholder="Brief summary of the post"
                  />
                </div>
                
                {/* Content */}
                <div>
                  <label 
                    htmlFor="content" 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content (Markdown)
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple font-mono text-sm"
                    placeholder="Write your post content in Markdown format..."
                    required
                  />
                </div>
              </div>
              
              {/* Sidebar - 1 column */}
              <div className="md:col-span-1 space-y-6">
                {/* Publish Options */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="publish"
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
                      />
                      <label 
                        htmlFor="publish" 
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Publish immediately
                      </label>
                    </div>
                    
                    {isPublished && (
                      <div>
                        <label 
                          htmlFor="publishDate" 
                          className="block text-sm font-medium text-gray-700"
                        >
                          <Calendar size={14} className="inline mr-1" />
                          Publish Date
                        </label>
                        <input
                          type="datetime-local"
                          id="publishDate"
                          value={publishedAt ? new Date(publishedAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setPublishedAt(e.target.value ? new Date(e.target.value).toISOString() : null)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Leave empty for current time
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Featured Image */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    <Image size={16} className="inline mr-1" />
                    Featured Image
                  </h3>
                  
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                    placeholder="Image URL"
                  />
                  
                  {coverImage && (
                    <div className="mt-3">
                      <img 
                        src={coverImage} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Categories */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
                  
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Authors */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Author</h3>
                  
                  <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                    required
                  >
                    <option value="">Select an author</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Tags */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                  
                  <div className="flex">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-purple-light/20 text-brand-purple-dark"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-brand-purple-dark hover:text-brand-purple focus:outline-none"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;