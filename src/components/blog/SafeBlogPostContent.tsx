import React, { ErrorInfo, Component } from 'react';
import { BlogPost, BlogPostPreview } from '@/types/blog';
import BlogPostContent from './BlogPostContent';
import { Link } from 'react-router-dom';

interface Props {
  post: BlogPost;
  relatedPosts?: BlogPostPreview[];
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary specifically for blog post content
 * Catches and gracefully handles errors in blog post rendering
 */
class SafeBlogPostContent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console
    console.error('Blog post error details:', {
      error,
      errorInfo,
      post: this.props.post
    });
    
    this.setState({ errorInfo });
    
    // Report to analytics or logging service if needed
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore
      window.gtag?.('event', 'blog_post_error', {
        error_message: error.message,
        component_stack: errorInfo.componentStack,
        post_slug: this.props.post?.slug || 'unknown',
        post_id: this.props.post?.id || 'unknown'
      });
    }
  }

  /**
   * Validate that the blog post has all required fields
   * Returns a string with error message if invalid, or null if valid
   */
  validateBlogPost(): string | null {
    const { post } = this.props;
    
    if (!post) return 'Blog post is undefined';
    if (!post.id) return 'Blog post is missing ID';
    if (!post.title) return 'Blog post is missing title';
    if (!post.content) return 'Blog post is missing content';
    
    // Check category
    if (!post.category) return 'Blog post is missing category information';
    if (!post.category.name) return 'Blog post category is missing name';
    
    // Check author
    if (!post.author) return 'Blog post is missing author information';
    
    // These can be the most common sources of errors, so let's validate thoroughly
    
    // Check for type mismatches (properties that should be strings but aren't)
    if (post.title && typeof post.title !== 'string') 
      return 'Blog post title is not a string';
      
    if (post.content && typeof post.content !== 'string') 
      return 'Blog post content is not a string';
      
    if (post.excerpt && typeof post.excerpt !== 'string') 
      return 'Blog post excerpt is not a string';
      
    // Check for missing or malformed cover image
    if (!post.coverImage && !('cover_image' in post as any)) 
      return 'Blog post is missing cover image';
    
    return null;
  }

  render() {
    // If we have an error, show fallback UI
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg bg-gray-50 border border-gray-200">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              There was a problem loading this blog post
            </h2>
            <p className="text-gray-700 mb-6">
              We're sorry for the inconvenience. Our team has been notified of this issue.
            </p>
            
            {/* Show validation issues for debugging in development */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded text-left">
                <h3 className="font-medium text-yellow-900 mb-2">Debugging Information</h3>
                <p className="text-yellow-800 text-sm mb-2">
                  {this.state.error?.message || 'Unknown error'}
                </p>
                
                {/* Show validation errors */}
                {this.validateBlogPost() && (
                  <div className="text-sm text-red-600 mt-2">
                    <p className="font-semibold">Validation error:</p>
                    <p>{this.validateBlogPost()}</p>
                  </div>
                )}
                
                {/* Show component stack */}
                {this.state.errorInfo?.componentStack && (
                  <details className="text-xs mt-2">
                    <summary className="cursor-pointer">Component Stack</summary>
                    <pre className="mt-1 p-2 bg-gray-800 text-white overflow-auto rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                
                {/* Show post data */}
                <details className="text-xs mt-2">
                  <summary className="cursor-pointer">Post Data</summary>
                  <pre className="mt-1 p-2 bg-gray-800 text-white overflow-auto rounded">
                    {JSON.stringify(this.props.post, null, 2)}
                  </pre>
                </details>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try refreshing the page
              </button>
              <Link 
                to="/blog"
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Return to all blog posts
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Normalize data if needed
    // This is a "belt and suspenders" approach to make sure we have consistent data
    // to prevent the most common errors.
    const normalizedPost = this.normalizePostData(this.props.post);
    
    // Render the normal component if no errors
    return <BlogPostContent post={normalizedPost} relatedPosts={this.props.relatedPosts} />;
  }

  /**
   * Helper method to normalize post data and prevent common errors
   */
  private normalizePostData(post: BlogPost): BlogPost {
    // Make a defensive copy - important for safe normalization
    const normalizedPost = { ...post };
    
    // Handle potential snake_case to camelCase mismatches (the most common source of errors)
    const snakeCaseData = post as any;
    
    // Normalize coverImage field
    if (!normalizedPost.coverImage && snakeCaseData.cover_image) {
      normalizedPost.coverImage = snakeCaseData.cover_image;
    }
    
    // Normalize publishedAt field
    if (!normalizedPost.publishedAt && snakeCaseData.published_at) {
      normalizedPost.publishedAt = snakeCaseData.published_at;
    }
    
    // Ensure category is properly structured
    if (!normalizedPost.category && snakeCaseData.category_id) {
      normalizedPost.category = {
        id: snakeCaseData.category_id,
        name: 'Uncategorized', // Fallback
        slug: 'uncategorized'  // Fallback
      };
    }
    
    // Ensure author is properly structured
    if (!normalizedPost.author) {
      normalizedPost.author = {
        id: 'missing',
        name: 'Anonymous',
      };
    }
    
    // Ensure we have reasonable default values for optional fields
    normalizedPost.excerpt = normalizedPost.excerpt || '';
    normalizedPost.tags = normalizedPost.tags || [];
    normalizedPost.readingTime = normalizedPost.readingTime || 
                                Math.ceil((normalizedPost.content.length / 1000) * 2); // ~2 min per 1000 chars
    
    return normalizedPost;
  }
}

export default SafeBlogPostContent;