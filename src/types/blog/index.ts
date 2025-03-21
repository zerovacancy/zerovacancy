export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogAuthor = {
  id: string;
  name: string;
  avatar?: string | null;
  role?: string | null;
  bio?: string | null;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  category: BlogCategory;
  author: BlogAuthor;
  tags?: string[];
  readingTime?: number;
};

export type BlogPostPreview = Omit<BlogPost, 'content'>;

export type BlogCategories = {
  categories: BlogCategory[];
};

export type BlogPosts = {
  posts: BlogPostPreview[];
  totalCount: number;
};

export type BlogPostsFilters = {
  category?: string;
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
};

export type BlogPostResponse = {
  post: BlogPost;
  related?: BlogPostPreview[];
};