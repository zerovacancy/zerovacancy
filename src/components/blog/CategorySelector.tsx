import React, { useState } from 'react';
import { Plus, CheckCheck, X } from 'lucide-react';
import { BlogCategory } from '@/types/blog';
import { BlogService } from '@/services/BlogService';

interface CategorySelectorProps {
  categories: BlogCategory[];
  selectedCategoryId: string;
  onChange: (categoryId: string) => void;
  onCategoriesChange?: (categories: BlogCategory[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onChange,
  onCategoriesChange
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // Check if user selected "Add new category" option
    if (value === 'new') {
      setIsAddingCategory(true);
    } else {
      onChange(value);
    }
  };
  
  // Handle new category creation
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }
    
    // Check if category already exists
    const exists = categories.some(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    
    if (exists) {
      setError('This category already exists');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create new category
      const categoryData: Partial<BlogCategory> = {
        name: newCategoryName.trim()
      };
      
      const newCategory = await BlogService.saveCategory(categoryData);
      
      // Update local categories list
      const updatedCategories = [...categories, newCategory];
      
      // Notify parent component
      if (onCategoriesChange) {
        onCategoriesChange(updatedCategories);
      }
      
      // Select the new category
      onChange(newCategory.id);
      
      // Reset form
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancel adding new category
  const cancelAddCategory = () => {
    setIsAddingCategory(false);
    setNewCategoryName('');
    setError('');
  };
  
  return (
    <div>
      {isAddingCategory ? (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            New Category Name
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
              placeholder="Enter category name"
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddCategory}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-brand-purple text-white hover:bg-brand-purple-dark disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <CheckCheck size={18} />
              )}
            </button>
          </div>
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={cancelAddCategory}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="flex items-center">
            <select
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-brand-purple focus:border-brand-purple"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="new">+ Add new category</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;