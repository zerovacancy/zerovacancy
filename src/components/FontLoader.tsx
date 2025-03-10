
import { useEffect } from 'react';

const FontLoader = () => {
  useEffect(() => {
    // Create link preload elements for fonts
    const links = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@400;500;600;700&display=swap'
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'
      },
      {
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap'
      }
    ];

    const elements: HTMLLinkElement[] = [];

    links.forEach(link => {
      // Create preload link
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = link.href;
      
      // Create stylesheet link
      const stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = link.href;
      
      // Append to document head
      document.head.appendChild(preloadLink);
      document.head.appendChild(stylesheet);
      
      elements.push(preloadLink, stylesheet);
    });

    // Load the fonts
    document.fonts.ready.then(() => {
      // Fonts are loaded and ready
    });
    
    return () => {
      // Cleanup
      elements.forEach(element => {
        document.head.removeChild(element);
      });
    };
  }, []);

  return null;
};

export default FontLoader;
