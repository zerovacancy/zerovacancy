import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Archive,
  FileText,
  Tag,
  Users,
  Settings, 
  LogOut,
  CheckCircle,
  Search
} from 'lucide-react';
import { BlogService } from '@/services/BlogService';
import { BlogPost, BlogCategory, BlogAuthor } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import SEO from '@/components/SEO';
import { useAuth } from '@/components/auth/AuthContext';
import RichTextEditor from '@/components/blog/RichTextEditor';
import ImageUploader from '@/components/blog/ImageUploader';
import CategorySelector from '@/components/blog/CategorySelector';
import SEOPanel from '@/components/blog/SEOPanel';
import { useBlogAutosave } from '@/hooks/use-blog-autosave';
// Temporarily removing CSS Module usage due to loading issues
// import styles from './BlogEditor.module.css';

const BlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const isEditing = !!id;
  const [hydrated, setHydrated] = useState(false);
  
  // This helps prevent hydration errors by ensuring we only render
  // the full component after the client-side code is running
  useEffect(() => {
    setHydrated(true);
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
  
  // SEO metadata state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [showSeoPanel, setShowSeoPanel] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [authors, setAuthors] = useState<BlogAuthor[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  // isAutosaving and lastAutosaved now come from the useBlogAutosave hook
  
  // Use the enhanced autosave hook after state declarations
  const { 
    isAutosaving, 
    lastAutosaved, 
    showRecoveryDialog,
    recoveryData,
    triggerAutosave,
    clearLocalBackup,
    setShowRecoveryDialog,
    handleContentChange
  } = useBlogAutosave({
    id,
    title,
    content,
    excerpt,
    isPublished: status === 'published',
    onSaved: (timestamp) => {
      setLastSaved(timestamp);
      console.log('Auto-saved at:', new Date(timestamp).toLocaleTimeString());
    },
    onError: (error) => {
      console.error('Auto-save error:', error);
      // Don't show validation errors for auto-save failures to avoid disrupting workflow
    }
  });
  
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
            const fullPost = await BlogService.getPostBySlug(post.slug, true);
            
            if (fullPost && fullPost.post) {
              populateForm(fullPost.post);
              
              // No need to manually start autosave timer anymore
              // The useBlogAutosave hook handles this automatically
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
    
    // Set SEO metadata
    setSeoTitle(post.seoTitle || post.title);
    setSeoDescription(post.seoDescription || post.excerpt || '');
    
    // Determine status based on post status or published date
    let postStatus = post.status;
    if (!postStatus) {
      if (post.publishedAt) {
        const publishDate = new Date(post.publishedAt);
        const now = new Date();
        postStatus = publishDate > now ? 'scheduled' : 'published';
      } else {
        postStatus = 'draft';
      }
    }
    
    setStatus(postStatus);
    setPublishedAt(post.publishedAt);
    setLastSaved(post.lastSaved || null);
  };
  
  // Remove the old autosave functions since we're now using the hook
  
  // Function to manually trigger autosave when needed
  const manualSave = async () => {
    if (saving || publishing) {
      return;
    }
    
    if (!isEditing || !id) {
      return; // Can't autosave new posts (they don't have an ID yet)
    }
    
    // Use the hook's triggerAutosave function with force=true
    return await triggerAutosave(true);
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
      // Log all form values for debugging
      console.log('Current form values:', {
        title: title || 'MISSING',
        slug: slug || 'MISSING',
        excerpt: excerpt || 'MISSING',
        content: content || 'MISSING',
        coverImage: coverImage ? 'PRESENT' : 'MISSING',
        categoryId: categoryId || 'MISSING',
        authorId: authorId || 'MISSING',
        tags: tags || 'MISSING',
        contentLength: content ? content.length : 0
      });
      
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
        tags,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt
      };
      
      console.log('Saving draft with data:', JSON.stringify({
        ...postData,
        content: postData.content ? `[CONTENT: ${postData.content.substring(0, 100)}...]` : 'MISSING',
        coverImage: postData.coverImage ? 'PRESENT' : 'MISSING'
      }, null, 2));
      
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
      // Use the selected date or current date if not specified
      const publishDate = publishedAt || new Date().toISOString();
      const isScheduled = publishedAt && new Date(publishedAt) > new Date();
      
      // Determine if we're scheduling or publishing immediately
      const postStatus = isScheduled ? 'scheduled' : 'published';
      const statusMessage = isScheduled ? 'scheduled' : 'published';
      
      const postData: Partial<BlogPost> = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        status: postStatus,
        publishedAt: publishDate,
        category: { id: categoryId } as BlogCategory,
        author: { id: authorId } as BlogAuthor,
        tags,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt
      };
      
      console.log(`${isScheduled ? 'Scheduling' : 'Publishing'} post:`, postData);
      
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
      
      // Show appropriate success message
      alert(`Post has been ${statusMessage} successfully`);
      
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
          <>
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full rounded-lg object-cover mb-6 max-h-[400px]"
              onError={(e) => {
                console.error('Image failed to load in preview:', e);
                console.log('Cover image data length:', coverImage.length);
                console.log('Cover image data starts with:', coverImage.substring(0, 50) + '...');
                (e.target as HTMLImageElement).style.border = '2px solid red';
                (e.target as HTMLImageElement).style.backgroundColor = '#ffeeee';
              }}
              onLoad={() => console.log('Image loaded successfully in preview')}
            />
          </>
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
  
  // Navigation items
  const navItems = [
    { label: 'Blog Posts', icon: <FileText size={18} />, path: '/admin/blog' },
    { label: 'Categories', icon: <Tag size={18} />, path: '/admin/categories' },
    { label: 'Authors', icon: <Users size={18} />, path: '/admin/authors' },
    { label: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
  ];

  // Show loading state if data is loading or component isn't hydrated yet
  if (loading || !hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3">
          <h1 className="text-lg font-bold text-brand-purple-dark">ZeroVacancy Admin</h1>
        </header>
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-brand-purple-dark mr-8">ZeroVacancy Admin</h1>
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-brand-purple-light/20 text-brand-purple-dark'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span className="ml-2 hidden md:inline">Logout</span>
        </button>
      </header>
      
      {/* Mobile navigation */}
      <div className="bg-white border-t border-b md:hidden p-2">
        <nav className="flex justify-between overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded ${
                location.pathname.startsWith(item.path)
                  ? 'text-brand-purple-dark'
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => signOut()}
            className="flex flex-col items-center p-2 text-gray-700"
          >
            <LogOut size={18} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="w-full">
        <SEO
          title={isEditing ? "Edit Blog Post | ZeroVacancy Admin" : "Create Blog Post | ZeroVacancy Admin"}
          description="Create or edit blog content for ZeroVacancy"
          noindex={true}
        />
        <div className="w-full">
        <div className="mb-6 flex justify-between items-center w-full flex-wrap gap-4">
          
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            {/* Enhanced autosave indicator */}
            {isEditing && (
              <div className="text-sm flex items-center px-3 py-1 rounded-full">
                {isAutosaving ? (
                  <div className="text-blue-600 flex items-center bg-blue-50 px-2 py-1 rounded-full">
                    <Clock size={14} className="mr-1 animate-pulse" />
                    <span className="whitespace-nowrap">Saving...</span>
                  </div>
                ) : lastAutosaved ? (
                  <div className="text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle size={14} className="mr-1" />
                    <span className="whitespace-nowrap">Saved at {new Date(lastAutosaved).toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span className="whitespace-nowrap">Not saved yet</span>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => {
                // Save draft before showing preview
                if (!previewMode && id) {
                  manualSave();
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
              {publishing ? 'Publishing...' : 
                status === 'published' ? 'Update' : 
                (publishedAt && new Date(publishedAt) > new Date()) ? 'Schedule' : 'Publish'}
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
      </div>
      
      {/* Post status indicator */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          status === 'scheduled' || (status === 'published' && publishedAt && new Date(publishedAt) > new Date())
            ? 'bg-blue-100 text-blue-800' 
            : status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          <FilePlus size={14} className="mr-1" />
          {status === 'scheduled' || (status === 'published' && publishedAt && new Date(publishedAt) > new Date())
            ? 'Scheduled' 
            : status === 'published' 
              ? 'Published' 
              : 'Draft'}
          
          {(status === 'scheduled' || (status === 'published' && publishedAt && new Date(publishedAt) > new Date())) && publishedAt && (
            <span className="ml-1 text-xs text-blue-700">
              for {new Date(publishedAt).toLocaleDateString()} at {new Date(publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          
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
      
      {/* Recovery dialog for unsaved changes */}
      {showRecoveryDialog && recoveryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
            <h3 className="text-lg font-bold mb-2">Recover Unsaved Changes</h3>
            <p className="text-gray-600 mb-4">
              We found a more recent draft from {new Date(recoveryData.lastSaved).toLocaleString()}. 
              Would you like to recover these changes?
            </p>
            
            <div className="border border-gray-200 rounded-md p-4 mb-4 max-h-60 overflow-auto">
              <h4 className="font-medium">{recoveryData.title || 'Untitled'}</h4>
              {recoveryData.excerpt && (
                <p className="text-sm text-gray-600 mt-2 italic">{recoveryData.excerpt}</p>
              )}
              <div className="text-sm mt-2 prose prose-sm max-w-none">
                {recoveryData.content ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: recoveryData.content.length > 500 
                      ? recoveryData.content.substring(0, 500) + '...' 
                      : recoveryData.content 
                  }} />
                ) : (
                  <p className="text-gray-500">No content in the recovered draft</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  // Discard the local backup
                  clearLocalBackup();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Discard
              </button>
              <button 
                onClick={() => {
                  // Apply recovered data
                  if (recoveryData.title) setTitle(recoveryData.title);
                  if (recoveryData.content) setContent(recoveryData.content);
                  if (recoveryData.excerpt) setExcerpt(recoveryData.excerpt);
                  
                  // Hide dialog and clear backup (we've applied it)
                  setShowRecoveryDialog(false);
                }}
                className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-dark"
              >
                Recover This Version
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6 w-full" style={{ width: "100%" }}>
        {previewMode ? (
          <div className="w-full py-8">
            {renderPreview()}
          </div>
        ) : (
          <form onSubmit={handleSave} className="w-full max-w-none">
            <main className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-6 w-full max-w-none">
                
                {/* Main Form Column */}
                <div className="flex-1 space-y-6 w-full max-w-none">
                  {/* Title */}
                  <div className="w-full">
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

                {/* Sidebar Column */}
                <aside className="w-full md:w-[280px] flex-shrink-0 space-y-6" style={{ flexShrink: 0 }}>
                  {/* SEO Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowSeoPanel(!showSeoPanel)}
                    className={`flex items-center w-full justify-between p-2 mb-2 rounded-md border ${
                      showSeoPanel 
                        ? 'bg-brand-purple-light/20 border-brand-purple text-brand-purple' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center">
                      <Search size={16} className="mr-2" />
                      <span className="text-sm font-medium">SEO & Search Settings</span>
                    </span>
                    <span className="text-xs">
                      {showSeoPanel ? 'Hide' : 'Show'}
                    </span>
                  </button>
                  
                  {/* SEO Panel */}
                  {showSeoPanel && (
                    <SEOPanel
                      title={seoTitle || title}
                      description={seoDescription || excerpt}
                      slug={slug}
                      onTitleChange={setSeoTitle}
                      onDescriptionChange={setSeoDescription}
                    />
                  )}
                  
                  {/* Publish Options */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Publish</h3>
                    
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
                          {publishedAt && new Date(publishedAt) > new Date() ? (
                            <div className="mt-2 bg-blue-50 p-2 rounded border border-blue-200 text-xs">
                              <p className="text-blue-700 font-medium">
                                This post will be scheduled for future publication on:
                              </p>
                              <p className="text-blue-900 font-bold mt-1">
                                {new Date(publishedAt).toLocaleString()}
                              </p>
                              <p className="text-blue-600 mt-1">
                                The post will automatically become visible to readers on this date and time.
                              </p>
                            </div>
                          ) : (
                            <p className="mt-1 text-xs text-gray-500">
                              Leave empty for current time or set a future date to schedule the post.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Featured Image */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
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
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <CategorySelector
                      categories={categories}
                      selectedCategoryId={categoryId}
                      onChange={setCategoryId}
                      onCategoriesChange={setCategories}
                    />
                  </div>
                  
                  {/* Authors */}
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Author</h3>
                    
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
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                    
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
                </aside>
              </div>
            </main>
          </form>
        )}
      </div>
      </div>
      </main>
    </div>
  );
};

export default BlogEditor;