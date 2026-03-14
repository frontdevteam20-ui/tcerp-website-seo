import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { blogDb } from '../../../firebaseConfig';

// Server-side function to fetch blog data for metadata generation
export async function getBlogForMetadata(slug) {
  if (!slug) return null;
  
  try {
    // Try by slug first
    const blogQuery = query(
      collection(blogDb, "blog"),
      where("slug", "==", slug)
    );
    const querySnapshot = await getDocs(blogQuery);
    
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    } else {
      // Try by document ID
      const docRef = doc(blogDb, "blog", slug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
    }
  } catch (error) {
    console.error("Error fetching blog for metadata:", error);
    return null;
  }
  
  return null;
}

// Generate metadata function
export async function generateMetadata({ params, searchParams }) {
  const slug = searchParams.get('slug') || params.slug;
  const blog = await getBlogForMetadata(slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found | Tech Cloud ERP',
      description: 'The blog post you are looking for could not be found.',
      keywords: 'blog, not found, tech cloud erp',
      openGraph: {
        title: 'Blog Not Found | Tech Cloud ERP',
        description: 'The blog post you are looking for could not be found.',
        type: 'website',
        url: `https://techclouderp.com/blogs/blog-detail?slug=${slug}`,
        images: [{
          url: 'https://techclouderp.com/images/default-blog.jpg',
          width: 1200,
          height: 630,
          alt: 'Blog Not Found'
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Blog Not Found | Tech Cloud ERP',
        description: 'The blog post you are looking for could not be found.',
        images: ['https://techclouderp.com/images/default-blog.jpg'],
      },
    };
  }

  // Extract content for description
  let description = '';
  if (blog.contentSection && Object.keys(blog.contentSection).length > 0) {
    const firstSection = blog.contentSection[Object.keys(blog.contentSection)[0]];
    if (firstSection.description && Object.keys(firstSection.description).length > 0) {
      description = firstSection.description[Object.keys(firstSection.description)[0]];
    }
  }
  
  // Fallback to other content
  if (!description && blog.contentSection2 && blog.contentSection2['1']) {
    description = blog.contentSection2['1'].shortDescription || '';
  }
  
  // Clean description (remove HTML tags and limit length)
  description = description
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim()
    .substring(0, 160) + (description.length > 160 ? '...' : '');

  // Extract keywords from blog data
  const keywords = [
    blog.title ? blog.title.toLowerCase().split(' ').filter(word => word.length > 3) : [],
    blog.category || 'tech cloud erp',
    'blog',
    'technology',
    'erp',
    'business'
  ].flat().slice(0, 10).join(', ');

  // Use SEO metadata from create-blog form (highest priority)
  const metaTitle = blog.metaTitle || `${blog.title || 'Blog Post'} | Tech Cloud ERP`;
  const metaDescription = blog.metaDescription || blog.excerpt || description || 'Read our latest blog post on Tech Cloud ERP';
  const metaKeywords = blog.metaKeywords || blog.tags?.join(', ') || keywords;
  const imageUrl = blog.ogImage || blog.featuredImage || blog.brocher?.imageUrl || 'https://techclouderp.com/images/default-blog.jpg';

  console.log('Using metadata from create-blog form:', {
    metaTitle,
    metaDescription,
    metaKeywords,
    imageUrl,
    author: blog.author,
    category: blog.category,
    tags: blog.tags
  });

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: blog.author || 'Tech Cloud ERP Team' }],
    publishedTime: blog.createdAt ? new Date(blog.createdAt.toDate ? blog.createdAt.toDate() : blog.createdAt).toISOString() : undefined,
    modifiedTime: blog.updatedAt ? new Date(blog.updatedAt.toDate ? blog.updatedAt.toDate() : blog.updatedAt).toISOString() : undefined,
    
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: `https://techclouderp.com/blogs/blog-detail?slug=${slug}`,
      siteName: 'Tech Cloud ERP',
      publishedTime: blog.createdAt ? new Date(blog.createdAt.toDate ? blog.createdAt.toDate() : blog.createdAt).toISOString() : undefined,
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt.toDate ? blog.updatedAt.toDate() : blog.updatedAt).toISOString() : undefined,
      authors: [blog.author || 'Tech Cloud ERP Team'],
      section: blog.category || 'Technology',
      tags: blog.tags || [],
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: blog.title || 'Blog Post Image',
      }],
    },
    
    twitter: {
      card: blog.twitterCard || 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@techclouderp',
      site: '@techclouderp',
      images: [imageUrl],
    },
    
    alternates: {
      canonical: `https://techclouderp.com/blogs/blog-detail?slug=${slug}`,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Generate HTML meta tags from create-blog form data
    other: {
      'og:title': metaTitle,
      'og:description': metaDescription,
      'og:type': 'article',
      'og:url': `https://techclouderp.com/blogs/blog-detail?slug=${slug}`,
      'og:site_name': 'Tech Cloud ERP',
      'og:image': imageUrl,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': blog.title || 'Blog Post Image',
      'twitter:card': blog.twitterCard || 'summary_large_image',
      'twitter:title': metaTitle,
      'twitter:description': metaDescription,
      'twitter:image': imageUrl,
      'twitter:creator': '@techclouderp',
      'twitter:site': '@techclouderp',
      'article:published_time': blog.createdAt ? new Date(blog.createdAt.toDate ? blog.createdAt.toDate() : blog.createdAt).toISOString() : undefined,
      'article:modified_time': blog.updatedAt ? new Date(blog.updatedAt.toDate ? blog.updatedAt.toDate() : blog.updatedAt).toISOString() : undefined,
      'article:author': blog.author || 'Tech Cloud ERP Team',
      'article:section': blog.category || 'Technology',
      'article:tag': blog.tags || [],
      'robots': 'index, follow',
      'googlebot': 'index, follow',
      'canonical': `https://techclouderp.com/blogs/blog-detail?slug=${slug}`,
    },
  };
}
