"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { blogDb } from '../../../firebaseConfig';
import Headers from "../../../components/layout/header/Header";
import PageHeader from "../../../components/layout/PageHeader";
import Footer from "../../../components/layout/footer/Footer";
import CustomCursor from "../../../components/layout/CustomCursor";
import { FaCalendarAlt, FaUser, FaArrowRight, FaClock, FaHome } from 'react-icons/fa';
import facebook from "../../../public/assets/images/blogs/facebook.png";
import linkedin from "../../../public/assets/images/blogs/linkedin.png"; 
import twitter from "../../../public/assets/images/blogs/twitter.png";
import Image from "next/image";
import Head from "next/head";

function BlogDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkMap, setLinkMap] = useState({
    'Tech Cloud ERP': 'https://techclouderp.com',
    'ERP': 'https://techclouderp.com/erp',
    'inventory management': 'https://techclouderp.com/inventory-management',
    'billing software': 'https://techclouderp.com/billing-software',
    'accounting': 'https://techclouderp.com/accounting-software'
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const slug = searchParams.get('slug');
        const id = searchParams.get('id');
        
        console.log('Fetching blog with slug:', slug, 'id:', id);
        
        if (!slug && !id) {
          console.error('No slug or id provided');
          setLoading(false);
          return;
        }

        let blogData = null;
        
        if (slug) {
          const blogsQuery = query(collection(blogDb, 'blogs'), where('slug', '==', slug));
          const querySnapshot = await getDocs(blogsQuery);
          if (!querySnapshot.empty) {
            blogData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            console.log('Blog found by slug:', blogData);
          }
        } else if (id) {
          const blogDoc = doc(blogDb, 'blogs', id);
          const blogSnap = await getDoc(blogDoc);
          if (blogSnap.exists()) {
            blogData = { id: blogSnap.id, ...blogSnap.data() };
            console.log('Blog found by id:', blogData);
          }
        }

        if (blogData) {
          console.log('Setting blog data with SEO fields:', {
            metaTitle: blogData.metaTitle,
            metaDescription: blogData.metaDescription,
            metaKeywords: blogData.metaKeywords,
            ogImage: blogData.ogImage,
            twitterCard: blogData.twitterCard,
            author: blogData.author,
            category: blogData.category,
            tags: blogData.tags
          });
          setBlog(blogData);
          
          // Fetch related blogs
          const relatedQuery = query(collection(blogDb, 'blogs'), where('category', '==', blogData.category || ''));
          const relatedSnapshot = await getDocs(relatedQuery);
          const related = relatedSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(relatedBlog => relatedBlog.id !== blogData.id)
            .slice(0, 3);
          setRelatedBlogs(related);
        } else {
          console.log('No blog data found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [searchParams]);

  const handleLinkClick = (text) => {
    const url = linkMap[text];
    if (url) {
      window.open(url, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);
    return `${readingTime} min read`;
  };

  const addLinksToText = (text) => {
    if (!text) return '';
    
    let processedText = text;
    Object.entries(linkMap).forEach(([key, url]) => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      processedText = processedText.replace(regex, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${key}</a>`);
    });
    
    return processedText;
  };

  const getShareUrl = () => {
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');
    const baseUrl = 'https://techclouderp.com/admin-blogs/blog-detail';
    return slug ? `${baseUrl}?slug=${slug}` : `${baseUrl}?id=${id}`;
  };

  const getShareText = () => {
    if (!blog) return 'Check out this blog post';
    return `Check out this blog: ${blog.title || 'Interesting Blog Post'}`;
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(getShareText());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/admin-blogs/blog-list')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        {/* Debug - Log what values are being used */}
        {console.log('Head rendering with blog data:', {
          metaTitle: blog.metaTitle,
          title: blog.title,
          metaDescription: blog.metaDescription,
          excerpt: blog.excerpt,
          metaKeywords: blog.metaKeywords,
          tags: blog.tags,
          ogImage: blog.ogImage,
          featuredImage: blog.featuredImage,
          twitterCard: blog.twitterCard,
          author: blog.author,
          category: blog.category
        })}
        
        {/* Core Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Dynamic Title */}
        <title>{blog.metaTitle || blog.title || 'Tech Cloud ERP Blog'}</title>
        
        {/* Dynamic Description */}
        <meta 
          name="description" 
          content={blog.metaDescription || blog.excerpt || 'Read our latest blog post on Tech Cloud ERP'} 
        />
        
        {/* Author and Copyright */}
        <link rel="author" href="https://techclouderp.com" />
        <meta name="author" content={blog.author || 'Tech Cloud ERP Software Pvt Ltd'} />
        
        {/* Dynamic Keywords */}
        <meta 
          name="keywords" 
          content={blog.metaKeywords || blog.tags?.join(', ') || 'ERP software, business, technology'} 
        />
        
        {/* Site Verification */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        <meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta 
          property="og:title" 
          content={blog.metaTitle || blog.title || 'Tech Cloud ERP Blog'} 
        />
        <meta 
          property="og:description" 
          content={blog.metaDescription || blog.excerpt || 'Read our latest blog post on Tech Cloud ERP'} 
        />
        <meta 
          property="og:image" 
          content={blog.ogImage || blog.featuredImage || 'https://techclouderp.com/images/default-blog.jpg'} 
        />
        <meta property="og:url" content={getShareUrl()} />
        <meta property="og:site_name" content="Tech Cloud ERP" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={blog.twitterCard || 'summary_large_image'} />
        <meta 
          name="twitter:title" 
          content={blog.metaTitle || blog.title || 'Tech Cloud ERP Blog'} 
        />
        <meta 
          name="twitter:description" 
          content={blog.metaDescription || blog.excerpt || 'Read our latest blog post on Tech Cloud ERP'} 
        />
        <meta 
          name="twitter:image" 
          content={blog.ogImage || blog.featuredImage || 'https://techclouderp.com/images/default-blog.jpg'} 
        />
        
        {/* Canonical URL */}
        <link rel="canonical" href={getShareUrl()} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/ico" />
        
        {/* Article Specific Meta */}
        {blog.createdAt && (
          <meta 
            property="article:published_time" 
            content={new Date(blog.createdAt.toDate ? blog.createdAt.toDate() : blog.createdAt).toISOString()} 
          />
        )}
        {blog.updatedAt && (
          <meta 
            property="article:modified_time" 
            content={new Date(blog.updatedAt.toDate ? blog.updatedAt.toDate() : blog.updatedAt).toISOString()} 
          />
        )}
        <meta property="article:author" content={blog.author || 'Tech Cloud ERP'} />
        <meta property="article:section" content={blog.category || 'Technology'} />
        {blog.tags?.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <CustomCursor />
        <Headers />
        <PageHeader />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <FaHome className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/')} />
            <span>/</span>
            <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/admin-blogs/blog-list')}>Blogs</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">{blog.title}</span>
          </nav>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {blog.featuredImage && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <FaUser />
                      <span>{blog.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{getReadingTime(blog.content)}</span>
                  </div>
                </div>
                
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <div className="prose prose-lg max-w-none mb-8">
                {blog.excerpt && (
                  <div className="text-xl text-gray-700 leading-relaxed mb-6 italic border-l-4 border-blue-500 pl-4">
                    {blog.excerpt}
                  </div>
                )}
                
                <div 
                  className="blog-content text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: addLinksToText(blog.content || '') 
                  }}
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share this post</h3>
                <div className="flex gap-4">
                  <button
                    onClick={handleFacebookShare}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Image src={facebook} alt="Facebook" width={20} height={20} />
                    Facebook
                  </button>
                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Image src={twitter} alt="Twitter" width={20} height={20} />
                    Twitter
                  </button>
                  <button
                    onClick={handleLinkedInShare}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <Image src={linkedin} alt="LinkedIn" width={20} height={20} />
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </article>

          {relatedBlogs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <article key={relatedBlog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedBlog.featuredImage && (
                      <div className="relative h-48">
                        <Image
                          src={relatedBlog.featuredImage}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{relatedBlog.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{relatedBlog.excerpt}</p>
                      <button
                        onClick={() => {
                          const slug = relatedBlog.slug;
                          const id = relatedBlog.id;
                          if (slug) {
                            router.push(`/admin-blogs/blog-detail?slug=${slug}`);
                          } else {
                            router.push(`/admin-blogs/blog-detail?id=${id}`);
                          }
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read More <FaArrowRight />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function BlogDetailClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <BlogDetailContent />
    </Suspense>
  );
}