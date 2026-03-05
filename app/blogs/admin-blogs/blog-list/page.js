"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { blogDb } from "../../../../firebaseConfig";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../../../components/layout/header/Header";
import PageHeader from "../../../../components/layout/PageHeader";
import Footer from "../../../../components/layout/footer/Footer";
import CustomCursor from "../../../../components/layout/CustomCursor";
import { FaHome, FaLock, FaUser, FaKey } from 'react-icons/fa';


export default function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const blogsPerPage = 8;

  // Simple hardcoded authentication (in production, use proper auth system)
  const validCredentials = [
    { username: 'admin', password: 'TECH@WEB-Blog2026' },
    { username: 'blogadmin', password: 'TECH@WEB-Blog2026' },
    { username: 'techcloud', password: 'TECH@WEB-Blog2026' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValid) {
      setIsAuthenticated(true);
      setAuthError('');
      setLoading(true); // Start loading when authenticated
    } else {
      setAuthError('Invalid credentials. Please try again.');
    }
  };

  const breadcrumbs = [
    { label: 'Home', link: '/', icon: FaHome },
    { label: 'Blogs', link: '/blogs' },
    { label: 'Blog List', link: null }
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchBlogs = async () => {
      if (!isAuthenticated) return;
      
      try {
        const querySnapshot = await getDocs(collection(blogDb, "blog"));
        if (isMounted) {
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBlogs(data.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
          }));
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching blogs:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleDelete = async (blogId) => {
    try {
      await deleteDoc(doc(blogDb, "blog", blogId));
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return 'No date';
    
    if (typeof createdAt.toDate === 'function') {
      return new Date(createdAt.toDate()).toLocaleDateString();
    } else if (typeof createdAt === 'string') {
      return new Date(createdAt).toLocaleDateString();
    } else if (createdAt instanceof Date) {
      return createdAt.toLocaleDateString();
    }
    
    return 'Invalid date';
  };

  // Pagination logic - Simplified
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header/>
         <style jsx>{`
      .ep-page-header-section2{
      min-height: 150px;
      padding: 100px 0px;
      }
       @media (max-width: 768px) {
      
      .ep-page-header-section2{
      min-height: 150px;
      padding: 100px 0px;
      }
      `}</style>
        {/* <PageHeader title="Blog List - Secure Login" breadcrumbs={breadcrumbs}/> */}
         <div className="ep-page-header-section2">
             <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '1rem', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', 
            padding: '3rem', 
            width: '100%', 
            maxWidth: '400px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem', minHeight:'30vh' }}>
              <FaLock style={{ fontSize: '3rem', color: '#ff6b00', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
                Secure Login
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Please login to Manage blog 
              </p>
            </div>
              
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    <FaUser style={{ marginRight: '0.5rem', color: '#6b7280' }} />
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    <FaKey style={{ marginRight: '0.5rem', color: '#6b7280' }} />
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                {authError && (
                  <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    color: '#ef5226',
                    fontSize: '0.875rem'
                  }}>
                    {authError}
                  </div>
                )}
                
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#ef5226',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#ef5226'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#ef5226'}
                >
                  Login to Manage Blog
                </button>
              </form>
            </div>
          </div>
         </div>
         <Footer/>
        <CustomCursor/>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header/>
        <div className="ep-page-header-section2">
        <PageHeader title="Blog List" breadcrumbs={breadcrumbs}/>
      </div>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3', 
              borderTop: '4px solid #2563eb', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Loading blogs...</p>
          </div>
        </div>
        <Footer/>
        <CustomCursor/>
      </>
    );
  }

  return (
    <>
      <Header/>
      
      <div className="ep-page-header-section2">
        <PageHeader title="Blog List" breadcrumbs={breadcrumbs}/>
      </div>
      <style jsx>{`
      .ep-page-header-section2{
      min-height: 150px;
      padding: 100px 0px;
      }
      `}</style>
      <div style={{ minHeight: '60vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Create New Blog Button */}
          <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
            <Link
              href="/blogs/admin-blogs/create-blog"
              style={{
                backgroundColor: '#05a7cc',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              + Create New Blog
            </Link>
          </div>

          {/* Blog Table */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Title</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Content Preview</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Created Date</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBlogs.length > 0 ? (
                    currentBlogs.map((blog) => (
                      <tr key={blog.id} style={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: '600', color: '#1f2937', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {blog.title || 'Untitled'}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {blog.content ? blog.content.substring(0, 100) + '...' : 'No content'}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {formatDate(blog.createdAt)}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link
                              href={`/blogs/blog-detail?slug=${blog.slug}`}
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}
                            >
                              Read More
                            </Link>
                            <Link
                              href={`/blogs/admin-blogs/edit-blog?id=${blog.id}`}
                              style={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(blog.id)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                border: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        No blogs found. Create your first blog to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', gap: '0.5rem' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: currentPage === 1 ? '#f9fafb' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? '#9ca3af' : '#374151'
                }}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: currentPage === index + 1 ? '#2563eb' : 'white',
                    color: currentPage === index + 1 ? 'white' : '#374151',
                    border: currentPage === index + 1 ? 'none' : '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: currentPage === totalPages ? '#f9fafb' : 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? '#9ca3af' : '#374151'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Confirm Delete</h3>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer/>
      <CustomCursor/>
    </>
  );
}