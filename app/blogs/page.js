 
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { blogDb } from "../../firebaseConfig";
import Link from "next/link";
import Headers from "../../components/layout/header/Header";
import PageHeader from "../../components/layout/PageHeader";
import Footer from "../../components/layout/footer/Footer";
import CustomCursor from "../../components/layout/CustomCursor";
import { FaCalendarAlt, FaArrowRight, FaHome } from 'react-icons/fa';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6; // Changed to 12 for 3x4 grid

  const breadcrumbs = [
    { label: 'Home', link: '/', icon: FaHome },
    { label: 'Blogs', link: null }
  ];

  // Format Date
  const formatDate = (createdAt) => {
    if (!createdAt) return "No date";

    if (typeof createdAt.toDate === "function") {
      return new Date(createdAt.toDate()).toLocaleDateString();
    } else if (typeof createdAt === "string") {
      return new Date(createdAt).toLocaleDateString();
    } else if (createdAt instanceof Date) {
      return createdAt.toLocaleDateString();
    }

    return "Invalid date";
  };

  // Fetch Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(blogDb, "blog"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div>
      <Headers />
      <PageHeader title="Blogs" breadcrumbs={breadcrumbs} />
      <CustomCursor />

      {/* Hero Section */}
      <div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center' }}>
          
            
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="blog-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <style jsx>{`
          .blog-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          @media (max-width: 1024px) {
            .blog-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
            }
          }
          @media (max-width: 640px) {
            .blog-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
          }
          .blog-card {
            background-color: white;
            // border-radius: 0.75rem;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(173, 216, 230, 0.5), 0 6px 6px rgba(173, 216, 230, 0.7);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .blog-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }
          .blog-image {
            height: 240px;
            background: #ffffff;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
          }
          .blog-placeholder {
            width: 60px;
            height: 60px;
            background-color: #cbd5e1;
            border-radius: 0.5rem;
          }
          .blog-content {
            padding: 1rem 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .blog-date {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            color: #64748b;
            font-size: 0.875rem;
          }
          .blog-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1e293b;
            line-height: 1.4;
          }
          .blog-description {
            color: #64748b;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
            line-height: 1.6;
            flex: 1;
          }
          .blog-read-more {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #3b82f6;
            font-weight: 500;
            font-size: 0.875rem;
           justify-content: flex-end;
          }
          @media (max-width: 1024px) {
            .blog-container {
              padding: 3rem 1.5rem;
            }
          }
          @media (max-width: 640px) {
            .hero-title {
              font-size: 2rem !important;
            }
            .hero-subtitle {
              font-size: 1rem !important;
            }
            .blog-container {
              padding: 2rem 1rem;
            }
            .blog-image {
              height: 200px;
            }
            .blog-content {
              padding: 1rem;
            }
            .blog-title {
              font-size: 1.125rem;
            }
            .blog-description {
              font-size: 0.8rem;
            }
          }
        `}</style>
        
        <div className="blog-grid">
          {currentBlogs.map((blog) => {
            console.log("Blog object:", blog); // Add this line to log blog object
            return (
            <Link key={blog.id} href={`/blogs/blog-detail?slug=${blog.slug}`} style={{ textDecoration: 'none' }}>
              <div className="blog-card">
              {/* Display Section 2 image if available */}
              {blog.content?.section2?.['1']?.imgurl2 && (
                <div className="blog-image" style={{ marginBottom: '0.5rem' }}>
                  <img 
                    src={blog.content.section2['1'].imgurl2} 
                    alt={`${blog.title} - Section 2 Image`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
              
              <div className="blog-image">
                {/* Display first image from Content Section 2-Section 1 */}
                {blog.brocher?.imageUrl ? (
                  <img 
                    src={blog.brocher.imageUrl} 
                    alt={blog.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : blog.content?.section2?.section1?.image?.imageUrl ? (
                  <img 
                    src={blog.content.section2.section1.image.imageUrl} 
                    alt={blog.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div className="blog-placeholder"></div>
                )}
              </div>
              
              {/* Display second image if available */}
              {(blog.content?.section2?.section1?.image2?.imageUrl || blog.brocher?.imageUrl2) && (
                <div className="blog-image" style={{ marginTop: '0.5rem' }}>
                  {blog.content?.section2?.section1?.image2?.imageUrl ? (
                    <img 
                      src={blog.content.section2.section1.image2.imageUrl} 
                      alt={`${blog.title} - Image 2`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : blog.brocher?.imageUrl2 ? (
                    <img 
                      src={blog.brocher.imageUrl2} 
                      alt={`${blog.title} - Image 2`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : null}
                </div>
              )}
              <div className="blog-content">
                <div className="blog-date">
                  <FaCalendarAlt />
                  {formatDate(blog.createdAt)}
                </div>
                <h3 className="blog-title">
                  {blog.title}
                </h3>
                <div className="blog-description">
                  <p style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {blog.content?.section2?.section1?.text || 
                     blog.brocher?.text || 
                     (blog.content ? blog.content.substring(0, 150) : 
                     '')}
                  </p>
                </div>
                <div className="blog-read-more">
                  <span style={{ 
                    color: '#ef5226',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    fontSize: '1rem', 
                  }}>
                    View More
                    {/* <FaArrowRight /> */}
                  </span>
                </div>
              </div>
            </div>
            </Link>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "4rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  backgroundColor: currentPage === 1 ? "#f8fafc" : "white",
                  color: currentPage === 1 ? "#a0aec0" : "#4a5568",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #e2e8f0",
                    backgroundColor:
                      currentPage === index + 1 ? "#05a7cc" : "white",
                    color:
                      currentPage === index + 1 ? "white" : "#4a5568",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                >
                  {index + 1}
                </button>
              ))}

              {/* Next */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",
                  backgroundColor:
                    currentPage === totalPages ? "#f8fafc" : "white",
                  color: currentPage === totalPages ? "#a0aec0" : "#4a5568",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                Next
              </button>
            </div>
          </div> 
        )}
      </div>

      <Footer />
      <CustomCursor />
    </div>
  );
}
