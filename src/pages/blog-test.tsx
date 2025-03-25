import React, { useState } from 'react';
import RichTextEditor from '@/components/blog/RichTextEditor';
import ImageUploader from '@/components/blog/ImageUploader';
import CategorySelector from '@/components/blog/CategorySelector';
import { BlogCategory } from '@/types/blog';

const BlogTest = () => {
  // Rich text editor state
  const [content, setContent] = useState('<p>Test content for the rich text editor</p>');
  
  // Image uploader state
  const [featuredImage, setFeaturedImage] = useState('');
  
  // Category selector state
  const [categories, setCategories] = useState<BlogCategory[]>([
    { id: '1', name: 'Technology', slug: 'technology' },
    { id: '2', name: 'Marketing', slug: 'marketing' }
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  
  // Test functions
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    console.log('Content updated:', newContent.substring(0, 50) + '...');
  };
  
  const handleImageChange = (url: string) => {
    setFeaturedImage(url);
    console.log('Image updated:', url);
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    console.log('Category selected:', categoryId);
  };
  
  const handleCategoriesChange = (updatedCategories: BlogCategory[]) => {
    setCategories(updatedCategories);
    console.log('Categories updated:', updatedCategories);
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Blog Feature Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Rich Text Editor Test</h2>
            <RichTextEditor 
              value={content}
              onChange={handleContentChange}
              placeholder="Enter test content here..."
              postId="test-post-id"
              onImageUpload={(url) => console.log('Image uploaded in editor:', url)}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <div 
              className="prose max-w-none border p-4 rounded"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Featured Image Test</h2>
            <ImageUploader
              initialImage={featuredImage}
              postId="test-post-id"
              onImageChange={handleImageChange}
              aspectRatio={16/9}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Category Selector Test</h2>
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onChange={handleCategoryChange}
              onCategoriesChange={handleCategoriesChange}
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>
            <div className="space-y-2">
              <div>
                <strong>Selected Category:</strong>{' '}
                {selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : 'None'}
              </div>
              <div>
                <strong>Featured Image:</strong>{' '}
                {featuredImage ? 'Set' : 'None'}
              </div>
              <div>
                <strong>Content Length:</strong>{' '}
                {content.length} characters
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTest;