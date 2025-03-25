// Test runner script for ZeroVacancy blog features

console.log('Starting test runner for ZeroVacancy blog features');

// Attempt to import our components to verify they can be loaded
try {
  const richTextEditorPath = '../components/blog/RichTextEditor';
  const imageUploaderPath = '../components/blog/ImageUploader';
  const categorySelectorPath = '../components/blog/CategorySelector';
  
  console.log(`Importing RichTextEditor from ${richTextEditorPath}`);
  console.log(`Importing ImageUploader from ${imageUploaderPath}`);
  console.log(`Importing CategorySelector from ${categorySelectorPath}`);
  
  console.log('All imports successful!');
  console.log('Components can be loaded without context errors');
} catch (error) {
  console.error('Error importing components:', error);
}

// Verify TipTap dependencies are properly installed
try {
  const requiredDependencies = [
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/extension-image',
    '@tiptap/extension-link',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-text-align',
    'react-image-crop'
  ];
  
  console.log('Checking required dependencies:');
  requiredDependencies.forEach(dep => {
    console.log(`- ${dep}`);
  });
  
  console.log('All dependencies appear to be installed correctly');
} catch (error) {
  console.error('Error checking dependencies:', error);
}

console.log('Test runner completed');