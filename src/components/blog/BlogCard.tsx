import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { BlogPostPreview } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPostPreview;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard = ({ post, variant = 'default' }: BlogCardProps) => {
  const { 
    title, 
    excerpt, 
    coverImage, 
    publishedAt,
    slug,
    author,
    category,
    readingTime
  } = post;

  const formattedDate = formatDate(publishedAt);

  if (variant === 'featured') {
    return (
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
        <Link to={`/blog/${slug}`} className="block h-full">
          <div className="relative h-64 overflow-hidden">
            <img 
              src={coverImage} 
              alt={title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <span className="inline-block rounded-md bg-brand-purple-medium px-2.5 py-1 text-xs font-medium">
                {category.name}
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="mb-2 text-xl font-bold text-brand-purple-dark line-clamp-2">
              {title}
            </h3>
            <p className="mb-4 text-brand-text-secondary line-clamp-3">
              {excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-brand-text-light">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{author.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="group flex items-start space-x-4">
        <Link to={`/blog/${slug}`} className="flex-shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-md">
            <img 
              src={coverImage} 
              alt={title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <div className="flex-1">
          <div className="mb-1 text-xs text-brand-text-light">
            {formattedDate}
          </div>
          <Link to={`/blog/${slug}`}>
            <h4 className="text-sm font-semibold text-brand-purple-dark transition-colors group-hover:text-brand-purple line-clamp-2">
              {title}
            </h4>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg h-full flex flex-col">
      <Link to={`/blog/${slug}`} className="block flex-1">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={coverImage} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-0 right-0 p-2">
            <span className="inline-block rounded-md bg-brand-purple-medium px-2.5 py-1 text-xs font-medium text-white">
              {category.name}
            </span>
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center space-x-2 mb-2 text-xs text-brand-text-light">
            <div className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{readingTime} min read</span>
            </div>
          </div>
          <h3 className="mb-2 text-lg font-bold text-brand-purple-dark line-clamp-2">
            {title}
          </h3>
          <p className="mb-4 text-brand-text-secondary text-sm line-clamp-3 flex-1">
            {excerpt}
          </p>
          <div className="flex items-center space-x-2 mt-auto">
            {author.avatar && (
              <img 
                src={author.avatar}
                alt={author.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
            <span className="text-xs text-brand-text-light">
              by <span className="font-medium">{author.name}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;