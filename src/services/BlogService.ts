import { 
  BlogCategories, 
  BlogPost, 
  BlogPostPreview, 
  BlogPostResponse, 
  BlogPosts, 
  BlogPostsFilters,
  BlogCategory,
  BlogAuthor
} from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';

// Helper function to calculate reading time based on content length
const calculateReadingTime = (content: string): number => {
  const words = content.split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

// Helper to transform Supabase blog post data to our frontend format
const transformPost = async (post: any): Promise<BlogPost> => {
  // Get category
  const { data: categoryData } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('id', post.category_id)
    .single();
  
  // Get author
  const { data: authorData } = await supabase
    .from('blog_authors')
    .select('*')
    .eq('id', post.author_id)
    .single();
  
  // Get tags
  const { data: tagRelations } = await supabase
    .from('blog_posts_tags')
    .select('tag_id')
    .eq('post_id', post.id);
  
  let tags: string[] = [];
  
  if (tagRelations && tagRelations.length > 0) {
    const tagIds = tagRelations.map(relation => relation.tag_id);
    const { data: tagsData } = await supabase
      .from('blog_tags')
      .select('name')
      .in('id', tagIds);
    
    if (tagsData) {
      tags = tagsData.map(tag => tag.name);
    }
  }
  
  // Transform to our model
  const category: BlogCategory = {
    id: categoryData.id,
    name: categoryData.name,
    slug: categoryData.slug
  };
  
  const author: BlogAuthor = {
    id: authorData.id,
    name: authorData.name,
    avatar: authorData.avatar,
    role: authorData.role,
    bio: authorData.bio
  };
  
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    coverImage: post.cover_image,
    publishedAt: post.published_at,
    category,
    author,
    tags,
    readingTime: post.reading_time || calculateReadingTime(post.content)
  };
};

// Helper to transform Supabase blog post data to preview format
const transformPostPreview = async (post: any): Promise<BlogPostPreview> => {
  const fullPost = await transformPost(post);
  const { content, ...previewPost } = fullPost;
  return previewPost;
};

export class BlogService {
  // Get all blog posts with pagination
  static async getPosts(filters: BlogPostsFilters = {}): Promise<BlogPosts> {
    const { 
      category, 
      search, 
      tag, 
      page = 1, 
      limit = 10 
    } = filters;
    
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });
    
    // Only show published posts to regular users
    query = query.eq('status', 'published');
    
    // Apply category filter
    if (category) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    // Apply tag filter
    if (tag) {
      const { data: tagData } = await supabase
        .from('blog_tags')
        .select('id')
        .eq('name', tag)
        .single();
      
      if (tagData) {
        const { data: postIds } = await supabase
          .from('blog_posts_tags')
          .select('post_id')
          .eq('tag_id', tagData.id);
        
        if (postIds && postIds.length > 0) {
          const ids = postIds.map(item => item.post_id);
          query = query.in('id', ids);
        } else {
          // No posts with this tag, return empty
          return {
            posts: [],
            totalCount: 0
          };
        }
      }
    }
    
    // Order by published date (newest first)
    query = query.order('published_at', { ascending: false });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);
    
    // Execute query
    const { data, count, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
    
    const posts = await Promise.all(
      (data || []).map(post => transformPostPreview(post))
    );
    
    return {
      posts,
      totalCount: count || 0
    };
  }
  
  // Get featured posts for homepage
  static async getFeaturedPosts(count: number = 3): Promise<BlogPostPreview[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(count);
    
    if (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
    
    return Promise.all(
      (data || []).map(post => transformPostPreview(post))
    );
  }
  
  // Get a single blog post by slug
  static async getPostBySlug(slug: string): Promise<BlogPostResponse | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    const post = await transformPost(data);
    
    // Get related posts (same category, excluding current post)
    const { data: relatedData } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category_id', data.category_id)
      .eq('status', 'published')
      .neq('id', data.id)
      .limit(3);
    
    const related = await Promise.all(
      (relatedData || []).map(post => transformPostPreview(post))
    );
    
    return {
      post,
      related
    };
  }
  
  // Get all categories
  static async getCategories(): Promise<BlogCategories> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
    
    return {
      categories: data || []
    };
  }
  
  // Get popular tags
  static async getPopularTags(limit: number = 10): Promise<string[]> {
    // Get tag counts via a Supabase query
    const { data, error } = await supabase
      .from('blog_posts_tags')
      .select('tag_id, blog_tags(name)', { count: 'exact' })
      .order('tag_id');
    
    if (error) {
      console.error('Error fetching popular tags:', error);
      throw error;
    }
    
    // Count occurrences of each tag
    const tagCounts: Record<string, number> = {};
    
    data?.forEach(item => {
      // @ts-ignore - Supabase typings don't handle this well
      const tagName = item.blog_tags?.name;
      if (tagName) {
        tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
      }
    });
    
    // Sort by count and return top tags
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, limit);
  }
  
  // ADMIN FUNCTIONS - these would typically be protected by authentication
  
  // Create a new blog post
  static async createPost(postData: Partial<BlogPost>): Promise<BlogPost | null> {
    // Ensure required fields
    if (!postData.title || !postData.content) {
      throw new Error('Title and content are required');
    }
    
    // Generate slug if not provided
    if (!postData.slug) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    // Calculate reading time if not provided
    if (!postData.readingTime && postData.content) {
      postData.readingTime = calculateReadingTime(postData.content);
    }
    
    // Extract tags before inserting
    const tags = postData.tags || [];
    delete (postData as any).tags;
    
    // Transform to Supabase format
    const supabasePost = {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt || null,
      content: postData.content,
      cover_image: postData.coverImage || null,
      published_at: postData.publishedAt || null,
      status: postData.publishedAt ? 'published' : 'draft',
      category_id: postData.category?.id || null,
      author_id: postData.author?.id || null,
      reading_time: postData.readingTime || null
    };
    
    // Insert the post
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(supabasePost)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
    
    // Add tags if provided
    if (tags.length > 0) {
      // Get or create tags
      for (const tagName of tags) {
        // Check if tag exists
        let { data: existingTag } = await supabase
          .from('blog_tags')
          .select('id')
          .eq('name', tagName)
          .single();
        
        let tagId;
        
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // Create new tag
          const { data: newTag, error: tagError } = await supabase
            .from('blog_tags')
            .insert({ name: tagName })
            .select()
            .single();
          
          if (tagError) {
            console.error('Error creating tag:', tagError);
            continue;
          }
          
          tagId = newTag.id;
        }
        
        // Add relation
        await supabase
          .from('blog_posts_tags')
          .insert({ post_id: data.id, tag_id: tagId });
      }
    }
    
    // Get the full post with relations
    return this.getPostBySlug(data.slug)
      .then(response => response?.post || null);
  }
  
  // Update an existing blog post
  static async updatePost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
    // Extract tags before updating
    const tags = postData.tags;
    delete (postData as any).tags;
    delete (postData as any).category;
    delete (postData as any).author;
    
    // Transform to Supabase format
    const supabasePost: any = {
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      cover_image: postData.coverImage,
      reading_time: postData.readingTime
    };
    
    // Only update provided fields
    Object.keys(supabasePost).forEach(key => {
      if (supabasePost[key] === undefined) {
        delete supabasePost[key];
      }
    });
    
    // Handle published status
    if (postData.publishedAt !== undefined) {
      supabasePost.published_at = postData.publishedAt;
      supabasePost.status = postData.publishedAt ? 'published' : 'draft';
    }
    
    // Update category if provided
    if (postData.category?.id) {
      supabasePost.category_id = postData.category.id;
    }
    
    // Update author if provided
    if (postData.author?.id) {
      supabasePost.author_id = postData.author.id;
    }
    
    // Update the post
    const { data, error } = await supabase
      .from('blog_posts')
      .update(supabasePost)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
    
    // Update tags if provided
    if (tags) {
      // Remove existing tags
      await supabase
        .from('blog_posts_tags')
        .delete()
        .eq('post_id', id);
      
      // Add new tags
      for (const tagName of tags) {
        // Check if tag exists
        let { data: existingTag } = await supabase
          .from('blog_tags')
          .select('id')
          .eq('name', tagName)
          .single();
        
        let tagId;
        
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // Create new tag
          const { data: newTag, error: tagError } = await supabase
            .from('blog_tags')
            .insert({ name: tagName })
            .select()
            .single();
          
          if (tagError) {
            console.error('Error creating tag:', tagError);
            continue;
          }
          
          tagId = newTag.id;
        }
        
        // Add relation
        await supabase
          .from('blog_posts_tags')
          .insert({ post_id: id, tag_id: tagId });
      }
    }
    
    // Get the full post with relations
    return this.getPostBySlug(data.slug)
      .then(response => response?.post || null);
  }
  
  // Delete a blog post
  static async deletePost(id: string): Promise<boolean> {
    // Delete the post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
    
    return true;
  }
  
  // Get all blog posts for admin (including drafts)
  static async getAdminPosts(filters: BlogPostsFilters = {}): Promise<BlogPosts> {
    const { 
      category, 
      search, 
      tag, 
      page = 1, 
      limit = 10 
    } = filters;
    
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });
    
    // Admin can see all posts regardless of status
    
    // Apply category filter
    if (category) {
      const { data: categoryData } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    // Apply tag filter
    if (tag) {
      const { data: tagData } = await supabase
        .from('blog_tags')
        .select('id')
        .eq('name', tag)
        .single();
      
      if (tagData) {
        const { data: postIds } = await supabase
          .from('blog_posts_tags')
          .select('post_id')
          .eq('tag_id', tagData.id);
        
        if (postIds && postIds.length > 0) {
          const ids = postIds.map(item => item.post_id);
          query = query.in('id', ids);
        } else {
          // No posts with this tag, return empty
          return {
            posts: [],
            totalCount: 0
          };
        }
      }
    }
    
    // Order by updated date (newest first)
    query = query.order('updated_at', { ascending: false });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    query = query.range(startIndex, startIndex + limit - 1);
    
    // Execute query
    const { data, count, error } = await query;
    
    if (error) {
      console.error('Error fetching admin blog posts:', error);
      throw error;
    }
    
    const posts = await Promise.all(
      (data || []).map(post => transformPostPreview(post))
    );
    
    return {
      posts,
      totalCount: count || 0
    };
  }
  
  // Create or update a category
  static async saveCategory(categoryData: Partial<BlogCategory>): Promise<BlogCategory> {
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }
    
    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    let result;
    
    if (categoryData.id) {
      // Update
      const { data, error } = await supabase
        .from('blog_categories')
        .update({
          name: categoryData.name,
          slug: categoryData.slug
        })
        .eq('id', categoryData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Create
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({
          name: categoryData.name,
          slug: categoryData.slug
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }
      
      result = data;
    }
    
    return {
      id: result.id,
      name: result.name,
      slug: result.slug
    };
  }
  
  // Create or update an author
  static async saveAuthor(authorData: Partial<BlogAuthor>): Promise<BlogAuthor> {
    if (!authorData.name) {
      throw new Error('Author name is required');
    }
    
    let result;
    
    if (authorData.id) {
      // Update
      const { data, error } = await supabase
        .from('blog_authors')
        .update({
          name: authorData.name,
          avatar: authorData.avatar,
          role: authorData.role,
          bio: authorData.bio
        })
        .eq('id', authorData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating author:', error);
        throw error;
      }
      
      result = data;
    } else {
      // Create
      const { data, error } = await supabase
        .from('blog_authors')
        .insert({
          name: authorData.name,
          avatar: authorData.avatar,
          role: authorData.role,
          bio: authorData.bio
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating author:', error);
        throw error;
      }
      
      result = data;
    }
    
    return {
      id: result.id,
      name: result.name,
      avatar: result.avatar,
      role: result.role,
      bio: result.bio
    };
  }
  
  // Delete a category (only if not used)
  static async deleteCategory(id: string): Promise<boolean> {
    // Check if category is used by any posts
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .eq('category_id', id);
    
    if (countError) {
      console.error('Error checking category usage:', countError);
      throw countError;
    }
    
    if (count && count > 0) {
      throw new Error('Cannot delete category that is used by posts');
    }
    
    // Delete the category
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
    
    return true;
  }
  
  // Delete an author (only if not used)
  static async deleteAuthor(id: string): Promise<boolean> {
    // Check if author is used by any posts
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact' })
      .eq('author_id', id);
    
    if (countError) {
      console.error('Error checking author usage:', countError);
      throw countError;
    }
    
    if (count && count > 0) {
      throw new Error('Cannot delete author that is used by posts');
    }
    
    // Delete the author
    const { error } = await supabase
      .from('blog_authors')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting author:', error);
      throw error;
    }
    
    return true;
  }
  
  // Get all authors
  static async getAuthors(): Promise<BlogAuthor[]> {
    const { data, error } = await supabase
      .from('blog_authors')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching authors:', error);
      throw error;
    }
    
    return data || [];
  }
}