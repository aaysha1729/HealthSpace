import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './CommunityPage.css';

const API_BASE = 'http://localhost:5001/api/community';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Topics');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  const filters = ['All Topics', 'PCOS Support', 'Irregular Cycles', 'Mental Health', 'Fertility', 'Endometriosis'];

  // Sample posts data
  const samplePosts = [
    {
      id: 1,
      category: 'IRREGULAR CYCLES',
      author: 'Community Member',
      timeAgo: '2h ago',
      title: 'Has anyone else experienced this after stopping the pill?',
      preview: 'I stopped taking birth control about 3 months ago and my cycle has been completely unpredictable. Some months it\'s 25 days, others it\'s 40. I\'m trying to track but it feels impossible. Just looking for some reassurance that this is normal?',
      relateCount: 0,
      isRelating: false,
      supportCount: 12,
      repliesCount: 3
    },
    {
      id: 2,
      category: 'PCOS SUPPORT',
      author: 'Community Member',
      timeAgo: '4h ago',
      title: 'Finding it hard to stay positive today.',
      preview: 'Some days the symptoms just feel overwhelming. Fatigue is hitting me really hard this week and I feel guilty for not being productive. Sending love to everyone else struggling right now.',
      relateCount: 0,
      isRelating: true,
      supportCount: 24,
      repliesCount: 8
    },
    {
      id: 3,
      category: 'MENTAL HEALTH',
      author: 'Community Member',
      timeAgo: '6h ago',
      title: 'Journaling has actually been helping?',
      preview: 'I was skeptical at first, but writing down my symptoms and feelings every morning has given me a lot more clarity. Just wanted to share a small win!',
      relateCount: 0,
      isRelating: false,
      supportCount: 5,
      repliesCount: 2
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 500);
  }, []);

  const handleRelate = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isRelating: !post.isRelating, relateCount: post.isRelating ? post.relateCount - 1 : post.relateCount + 1 }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'All Topics') return true;
    return post.category.toLowerCase().includes(activeFilter.toLowerCase().replace(' ', ''));
  });

  if (loading) {
    return (
      <div className="community-page loading">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading community...</p>
      </div>
    );
  }

  return (
    <div className="community-page">
      {/* Header */}
      <motion.header 
        className="community-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-left">
          <Link to="/" className="community-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#4CAF50"/>
            </svg>
            <span>Anonymous Support</span>
          </Link>
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M21 21L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search topics like 'PCOS' or 'Anxiety'..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <nav className="community-nav">
          <Link to="/cycle" className="nav-link">My Journal</Link>
          <a href="#" className="nav-link">Resources</a>
          <button className="menu-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </nav>
      </motion.header>

      {/* Crisis Banner */}
      <motion.div 
        className="crisis-banner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="crisis-icon">🌱</span>
        <span>Need immediate help? <a href="#">Connect with a crisis counselor.</a></span>
      </motion.div>

      {/* Main Content */}
      <main className="community-main community-list-main">
        {/* Hero Section */}
        <motion.div 
          className="community-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1>Share your journey safely.</h1>
          <p>A judgment-free space to connect, support, and heal together.</p>
        </motion.div>

        {/* New Post Input */}
        <motion.div 
          className="new-post-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="new-post-input">
            <span className="new-post-icon">💭</span>
            <input 
              type="text"
              placeholder="What is weighing on your mind today? This space is anonymous..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
          <div className="new-post-footer">
            <div className="new-post-actions">
              <button className="action-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                </svg>
              </button>
              <button className="action-icon-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            <motion.button 
              className="post-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Post to Community
            </motion.button>
          </div>
        </motion.div>

        {/* Filter Tags */}
        <motion.div 
          className="filter-tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filters.map((filter) => (
            <motion.button
              key={filter}
              className={`filter-tag ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Posts List */}
        <div className="posts-list">
          {filteredPosts.map((post, index) => (
            <motion.article 
              key={post.id}
              className="post-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.5 }}
            >
              <div className="post-card-header">
                <div className="post-meta">
                  <span className="post-category">{post.category}</span>
                  <span className="post-separator">•</span>
                  <span className="post-author">{post.author}</span>
                  <span className="post-separator">•</span>
                  <span className="post-time">{post.timeAgo}</span>
                </div>
                <button className="post-menu-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
              </div>

              <Link to={`/community/post/${post.id}`} className="post-card-content">
                <h2 className="post-card-title">{post.title}</h2>
                <p className="post-card-preview">{post.preview}</p>
              </Link>

              <div className="post-card-actions">
                <motion.button 
                  className={`relate-pill ${post.isRelating ? 'active' : ''}`}
                  onClick={() => handleRelate(post.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                      fill={post.isRelating ? "#e53e3e" : "none"} 
                      stroke={post.isRelating ? "#e53e3e" : "currentColor"} 
                      strokeWidth="2"
                    />
                  </svg>
                  {post.isRelating ? 'Relating' : 'I relate'}
                </motion.button>
                <button className="support-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Support ({post.supportCount})
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Loading More */}
        <motion.div 
          className="loading-more"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div 
            className="loading-spinner-small"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>Loading more thoughts...</span>
        </motion.div>
      </main>
    </div>
  );
};

export default CommunityPage;
