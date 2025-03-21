-- Create blog category table
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog author table
CREATE TABLE blog_authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  role VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  published_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category_id UUID REFERENCES blog_categories(id),
  author_id UUID REFERENCES blog_authors(id),
  reading_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blog tags table
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for blog posts and tags (many-to-many)
CREATE TABLE blog_posts_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create RLS policies for secure access
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts_tags ENABLE ROW LEVEL SECURITY;

-- Read-only policy for public access to published posts
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view categories" ON blog_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view authors" ON blog_authors
  FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view post tags" ON blog_posts_tags
  FOR SELECT USING (true);

-- Stored procedure for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update timestamp triggers
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON blog_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_authors_updated_at
BEFORE UPDATE ON blog_authors
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Initial data for categories
INSERT INTO blog_categories (name, slug) VALUES
('Real Estate Photography', 'real-estate-photography'),
('Property Marketing', 'property-marketing'),
('Content Creation', 'content-creation'),
('Industry News', 'industry-news'),
('Tips & Guides', 'tips-and-guides');

-- Initial data for common tags
INSERT INTO blog_tags (name) VALUES
('photography'),
('property marketing'),
('real estate'),
('video marketing'),
('content strategy'),
('staging'),
('interior design'),
('aerial photography'),
('virtual tours'),
('AI'),
('SEO');