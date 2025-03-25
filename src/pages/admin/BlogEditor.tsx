import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Calendar, 
  FilePlus,
  Eye, 
  ArrowLeft, 
  X, 
  Plus,
  AlertCircle,
  Clock,
  Send,
  ImageIcon,
  Archive
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BlogService } from '@/services/BlogService';
import { BlogPost, BlogCategory, BlogAuthor } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/SEO';
import { useAuth } from '@/components/auth/AuthContext';
import RichTextEditor from '@/components/blog/RichTextEditor';
import ImageUploader from '@/components/blog/ImageUploader';
import CategorySelector from '@/components/blog/CategorySelector';

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isEditing = !!id;
  const [hydrated, setHydrated] = useState(false);
  
  // Autosave timer reference
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
  
  // This helps prevent hydration errors by ensuring we only render
  // the full component after the client-side code is running
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  // Clean up autosave timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);
  
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
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastAutosaved, setLastAutosaved] = useState<string | null>(null);
  
  // Load post data if editing, and load categories and authors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch categories and authors
        const [categoriesData, authorsData, defaultAuthor] = await Promise.all([
          BlogService.getCategories(),
          BlogService.getAuthors(),
          BlogService.getDefaultAuthor()
        ]);
        
        setCategories(categoriesData.categories);
        setAuthors(authorsData);
        
        // Set default author to Team Zero if not editing
        if (!isEditing) {
          setAuthorId(defaultAuthor.id);
        }
        
        // If editing, fetch post data
        if (isEditing && id) {
          const posts = await BlogService.getAdminPosts();
          const post = posts.posts.find(p => p.id === id);
          
          if (post) {
            const fullPost = await BlogService.getPostBySlug(post.slug);
            
            if (fullPost && fullPost.post) {
              populateForm(fullPost.post);
              
              // Start autosave timer for existing posts
              startAutosaveTimer();
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
    setStatus(post.status || (post.publishedAt ? 'published' : 'draft'));
    setPublishedAt(post.publishedAt);
    setLastSaved(post.lastSaved || null);
  };
  
  // Start autosave timer
  const startAutosaveTimer = () => {
    // Clear any existing timer
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    
    // Set new timer
    autosaveTimerRef.current = setTimeout(() => {
      // Only autosave if we're in draft mode and editing an existing post
      if (status === 'draft' && isEditing && id) {
        handleAutosave();
      }
      
      // Restart timer
      startAutosaveTimer();
    }, autoSaveInterval);
  };
  
  // Handle autosave
  const handleAutosave = async () => {
    // Don't autosave if already saving or publishing
    if (saving || publishing) {
      return;
    }
    
    if (!isEditing || !id) {
      return; // Can't autosave new posts (they don't have an ID yet)
    }
    
    setIsAutosaving(true);
    
    try {
      // Create minimal data for autosave
      const autosaveData: Partial<BlogPost> = {
        title,
        content,
        excerpt
      };
      
      // Autosave the post
      const success = await BlogService.autosaveDraft(id, autosaveData);
      
      if (success) {
        // Update last autosaved time
        const now = new Date().toISOString();
        setLastAutosaved(now);
      }
    } catch (error) {
      console.error('Autosave failed:', error);
      // Don't show error messages for autosave failures
    } finally {
      setIsAutosaving(false);
    }
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
  
  // Handle save (without publishing)
  const handleSave = async (e: React.FormEvent) => {
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
        status: 'draft',
        publishedAt: null,
        category: { id: categoryId } as BlogCategory,
        author: { id: authorId } as BlogAuthor,
        tags
      };
      
      console.log('Saving draft:', postData);
      
      if (isEditing && id) {
        await BlogService.updatePost(id, postData);
      } else {
        const newPost = await BlogService.createPost(postData);
        if (newPost && newPost.id) {
          // Redirect to edit page for the new post
          navigate(`/admin/blog/edit/${newPost.id}`);
          return;
        }
      }
      
      // Update last saved time
      setLastSaved(now);
      
      // Show success message
      alert('Draft saved successfully');
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
  
  // Handle publish
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setPublishing(true);
    
    try {
      const now = new Date().toISOString();
      const postData: Partial<BlogPost> = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status: 'published',
        publishedAt: now,
        category: { id: categoryId } as BlogCategory,
        author: { id: authorId } as BlogAuthor,
        tags
      };
      
      console.log('Publishing post:', postData);
      
      if (isEditing && id) {
        await BlogService.updatePost(id, postData, true);
      } else {
        const newPost = await BlogService.createPost(postData);
        if (newPost && newPost.id) {
          // Go to blog admin
          navigate('/admin/blog');
          return;
        }
      }
      
      // Success - go back to blog admin
      navigate('/admin/blog');
    } catch (error: any) {
      // Extract meaningful error message
      const errorMessage = error.message || 'Failed to publish post. Please try again.';
      console.error('Error publishing post:', error);
      setValidationError(errorMessage);
      
      // Don't navigate away on error
      window.scrollTo(0, 0); // Scroll to top to show error
    } finally {
      setPublishing(false);
    }
  };
  
  // Handle unpublish
  const handleUnpublish = async () => {
    if (!isEditing || !id) {
      setValidationError('Cannot unpublish a new post');
      return;
    }
    
    // Confirm before unpublishing
    if (!window.confirm('Are you sure you want to unpublish this post? It will no longer be visible to visitors.')) {
      return;
    }
    
    setValidationError('');
    setUnpublishing(true);
    
    try {
      const updatedPost = await BlogService.unpublishPost(id);
      
      if (updatedPost) {
        // Update local state to match server state
        setStatus('draft');
        setPublishedAt(null);
        
        // Show success message
        alert('Post has been unpublished and is now a draft');
      }
    } catch (error: any) {
      // Extract meaningful error message
      const errorMessage = error.message || 'Failed to unpublish post. Please try again.';
      console.error('Error unpublishing post:', error);
      setValidationError(errorMessage);
      
      // Scroll to top to show error
      window.scrollTo(0, 0);
    } finally {
      setUnpublishing(false);
    }
  };

  // Handle image upload for rich text editor
  const handleContentImageUpload = (url: string) => {
    // Optional: store the URLs of uploaded images if needed
    console.log('Content image uploaded:', url);
  };
  
  // Preview post
  const renderPreview = () => {
    const previewPost: BlogPost = {
      id: id || 'preview',
      title: title || 'Untitled Post',
      slug: slug || 'untitled-post',
      excerpt: excerpt || '',
      content: content || '<p>No content provided</p>',
      coverImage: coverImage || '/placeholder.svg',
      publishedAt: publishedAt,
      status,
      category: categories.find(c => c.id === categoryId) || { id: '', name: 'Uncategorized', slug: 'uncategorized' },
      author: authors.find(a => a.id === authorId) || { id: '', name: 'Team Zero' },
      tags: tags,
      readingTime: Math.ceil(content.split(/\s+/).length / 200) || 1
    };
    
    return (
      <div className="prose prose-lg max-w-none">
        {/* Tags at top */}
        {previewPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {previewPost.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
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
            {authors.find(a => a.id === authorId)?.name || 'Team Zero'}
          </span>
          <span className="mx-2">•</span>
          <span>
            {status === 'published' 
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
        
        <div 
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  };
  
  // Show loading state if data is loading or component isn't hydrated yet
  if (loading || !hydrated) {
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
          {/* Autosave indicator */}
          {isEditing && status === 'draft' && (
            <div className="text-sm text-gray-500 flex items-center">
              {isAutosaving ? (
                <>
                  <Clock size={14} className="mr-1 animate-pulse" />
                  Autosaving...
                </>
              ) : lastAutosaved ? (
                <>
                  <Clock size={14} className="mr-1" />
                  Autosaved at {new Date(lastAutosaved).toLocaleTimeString()}
                </>
              ) : null}
            </div>
          )}
          
          <button
            onClick={() => {
              // Save draft before showing preview
              if (!previewMode && id) {
                handleAutosave();
              }
              setPreviewMode(!previewMode);
            }}
            className={`flex items-center px-4 py-2 border rounded-md ${
              previewMode
                ? 'bg-brand-purple-light/30 border-brand-purple text-brand-purple'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Eye size={18} className="mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          {/* Publish button */}
          <button
            onClick={handlePublish}
            disabled={publishing || unpublishing}
            className="flex items-center px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send size={18} className="mr-2" />
            {publishing ? 'Publishing...' : status === 'published' ? 'Update' : 'Publish'}
          </button>
          
          {/* Unpublish button - only show for published posts */}
          {status === 'published' && isEditing && (
            <button
              onClick={handleUnpublish}
              disabled={unpublishing || publishing}
              className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Archive size={18} className="mr-2" />
              {unpublishing ? 'Unpublishing...' : 'Unpublish'}
            </button>
          )}
        </div>
      </div>
      
      {/* Post status indicator */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          <FilePlus size={14} className="mr-1" />
          {status === 'published' ? 'Published' : 'Draft'}
          
          {lastSaved && (
            <span className="ml-2 text-xs text-gray-500">
              Last saved {formatDate(lastSaved, { format: 'relative' })}
            </span>
          )}
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
          <form onSubmit={handleSave}>
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
                  <p className="mt-1 text-xs text-gray-500">
                    A short summary that appears on blog listings and social shares
                  </p>
                </div>
                
                {/* Rich Text Editor */}
                <div>
                  <label 
                    htmlFor="content" 
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Content
                  </label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your blog post content here..."
                    postId={id}
                    onImageUpload={handleContentImageUpload}
                  />
                </div>
              </div>
              
              {/* Sidebar - 1 column */}
              <div className="md:col-span-1 space-y-6">
                {/* Publish Options */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Publish</h3>
                  
                  <div className="space-y-4">
                    {/* Status toggle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        <button
                          type="button"
                          onClick={() => setStatus('draft')}
                          className={`flex-1 py-2 px-3 text-sm border ${
                            status === 'draft'
                              ? 'bg-yellow-100 border-yellow-400 text-yellow-800 font-medium'
                              : 'bg-white border-gray-300 text-gray-700'
                          } rounded-l-md focus:outline-none`}
                        >
                          Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStatus('published');
                            if (!publishedAt) {
                              setPublishedAt(new Date().toISOString());
                            }
                          }}
                          className={`flex-1 py-2 px-3 text-sm border ${
                            status === 'published'
                              ? 'bg-green-100 border-green-400 text-green-800 font-medium'
                              : 'bg-white border-gray-300 text-gray-700'
                          } rounded-r-md focus:outline-none`}
                        >
                          Published
                        </button>
                      </div>
                    </div>
                    
                    {/* Publish date */}
                    {status === 'published' && (
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
                    <ImageIcon size={16} className="inline mr-1" />
                    Featured Image
                  </h3>
                  
                  <ImageUploader
                    initialImage={coverImage}
                    postId={id}
                    onImageChange={setCoverImage}
                    aspectRatio={16/9}
                  />
                </div>
                
                {/* Categories */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <CategorySelector
                    categories={categories}
                    selectedCategoryId={categoryId}
                    onChange={setCategoryId}
                    onCategoriesChange={setCategories}
                  />
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