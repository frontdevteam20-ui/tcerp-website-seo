// utils/blogAnalytics.js
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "../../firebaseConfig";

/**
 * Track blog page view
 * @param {Object} blogData - Blog information
 * @param {string} blogData.id - Blog ID
 * @param {string} blogData.title - Blog title
 * @param {string} blogData.slug - Blog slug
 */
export const trackBlogView = (blogData) => {
  try {
    const analytics = getAnalyticsInstance();
    if (!analytics) {
      // Local testing mode - show what would be tracked
      console.log('🔍 LOCAL ANALYTICS - Blog view would be tracked:', {
        blog_id: blogData.id,
        blog_title: blogData.title,
        blog_slug: blogData.slug,
        timestamp: new Date().toISOString(),
        page_location: window.location.href,
        page_title: blogData.title
      });
      return;
    }

    logEvent(analytics, 'blog_view', {
      blog_id: blogData.id,
      blog_title: blogData.title,
      blog_slug: blogData.slug,
      timestamp: new Date().toISOString(),
      page_location: window.location.href,
      page_title: blogData.title
    });

    console.log('✅ Blog view tracked:', blogData.title);
  } catch (error) {
    console.error('❌ Error tracking blog view:', error);
  }
};

/**
 * Track blog interaction (like, share, comment)
 * @param {string} action - Type of interaction
 * @param {Object} blogData - Blog information
 * @param {Object} additionalData - Additional data to track
 */
export const trackBlogInteraction = (action, blogData, additionalData = {}) => {
  try {
    const analytics = getAnalyticsInstance();
    if (!analytics) return;

    logEvent(analytics, 'blog_interaction', {
      interaction_type: action,
      blog_id: blogData.id,
      blog_title: blogData.title,
      ...additionalData,
      timestamp: new Date().toISOString()
    });

    console.log('Blog interaction tracked:', action, blogData.title);
  } catch (error) {
    console.error('Error tracking blog interaction:', error);
  }
};

/**
 * Track blog search
 * @param {string} searchTerm - Search query
 * @param {number} resultCount - Number of results
 */
export const trackBlogSearch = (searchTerm, resultCount) => {
  try {
    const analytics = getAnalyticsInstance();
    if (!analytics) return;

    logEvent(analytics, 'blog_search', {
      search_term: searchTerm,
      result_count: resultCount,
      timestamp: new Date().toISOString()
    });

    console.log('Blog search tracked:', searchTerm);
  } catch (error) {
    console.error('Error tracking blog search:', error);
  }
};

/**
 * Track blog creation
 * @param {Object} blogData - Created blog information
 */
export const trackBlogCreation = (blogData) => {
  try {
    const analytics = getAnalyticsInstance();
    if (!analytics) {
      // Local testing mode - show what would be tracked
      console.log('🔍 LOCAL ANALYTICS - Blog creation would be tracked:', {
        blog_id: blogData.id,
        blog_title: blogData.title,
        blog_slug: blogData.slug,
        author_id: blogData.authorId || 'anonymous',
        timestamp: new Date().toISOString()
      });
      return;
    }

    logEvent(analytics, 'blog_created', {
      blog_id: blogData.id,
      blog_title: blogData.title,
      blog_slug: blogData.slug,
      author_id: blogData.authorId || 'anonymous',
      timestamp: new Date().toISOString()
    });

    console.log('✅ Blog creation tracked:', blogData.title);
  } catch (error) {
    console.error('❌ Error tracking blog creation:', error);
  }
};

/**
 * Track blog update
 * @param {Object} blogData - Updated blog information
 */
export const trackBlogUpdate = (blogData) => {
  try {
    const analytics = getAnalyticsInstance();
    if (!analytics) {
      // Local testing mode - show what would be tracked
      console.log('🔍 LOCAL ANALYTICS - Blog update would be tracked:', {
        blog_id: blogData.id,
        blog_title: blogData.title,
        blog_slug: blogData.slug,
        timestamp: new Date().toISOString()
      });
      return;
    }

    logEvent(analytics, 'blog_updated', {
      blog_id: blogData.id,
      blog_title: blogData.title,
      blog_slug: blogData.slug,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Blog update tracked:', blogData.title);
  } catch (error) {
    console.error('❌ Error tracking blog update:', error);
  }
};

/**
 * Track time spent on blog page
 * @param {Object} blogData - Blog information
 * @param {number} timeSpent - Time in seconds
 */
export const trackBlogTimeSpent = (blogData, timeSpent) => {
  try {
    const analytics = getAnalyticsInstance();
    if (!analytics) {
      // Local testing mode - show what would be tracked
      console.log('🔍 LOCAL ANALYTICS - Blog time spent would be tracked:', {
        blog_id: blogData.id,
        blog_title: blogData.title,
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      });
      return;
    }

    logEvent(analytics, 'blog_time_spent', {
      blog_id: blogData.id,
      blog_title: blogData.title,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Blog time spent tracked:', blogData.title, timeSpent + 's');
  } catch (error) {
    console.error('❌ Error tracking blog time spent:', error);
  }
};
