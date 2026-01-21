import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import './CommunityPostPage.css';

const API_BASE = 'http://localhost:5001/api/community';

const CommunityPostPage = () => {
  const { postId } = useParams();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample data for initial display
  const samplePost = {
    id: 1,
    category: 'IRREGULAR CYCLES',
    author: 'Community Member',
    timeAgo: '2h ago',
    title: 'Has anyone else experienced this after stopping the pill?',
    content: `I stopped taking birth control about 3 months ago and my cycle has been completely unpredictable. Some months it's 25 days, others it's 40. I'm trying to track but it feels impossible.

I feel like my body is trying to recalibrate, but the uncertainty is causing me a lot of anxiety. My doctor said it could take up to a year to normalize, but I wasn't prepared for the emotional toll of not knowing when my period is coming.

Just looking for some reassurance that this is normal? Has anyone else navigated this transition recently and found anything that helps with the regulation?`,
    relateCount: 24,
    supportCount: 15,
    replies: [
      {
        id: 1,
        author: 'COMMUNITY MEMBER',
        timeAgo: '1h ago',
        content: 'I went through the exact same thing last year. It took about 6 months for my cycle to regulate itself. Be gentle with yourself, your body is relearning its natural rhythm! Tea helped me a lot with the anxiety.'
      },
      {
        id: 2,
        author: 'COMMUNITY MEMBER',
        timeAgo: '45m ago',
        content: 'Tracking basal body temperature helped me way more than just counting days when things were irregular. It gave me a better sense of when ovulation was actually happening, which reduced the "when will it start" panic.'
      },
      {
        id: 3,
        author: 'COMMUNITY MEMBER',
        timeAgo: '12m ago',
        content: 'Sending you a big hug. It is so normal but that doesn\'t make it less stressful. You aren\'t alone.'
      }
    ]
  };

  useEffect(() => {
    // Simulating API call - in production this would fetch from backend
    setTimeout(() => {
      setPosts([samplePost]);
      setSelectedPost(samplePost);
      setLoading(false);
    }, 500);
  }, []);

  const handleRelate = () => {
    if (selectedPost) {
      setSelectedPost({
        ...selectedPost,
        relateCount: selectedPost.relateCount + 1
      });
    }
  };

  const handleSupport = () => {
    if (selectedPost) {
      setSelectedPost({
        ...selectedPost,
        supportCount: selectedPost.supportCount + 1
      });
    }
  };

  const handlePostReply = () => {
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      author: 'COMMUNITY MEMBER',
      timeAgo: 'Just now',
      content: newReply
    };

    setSelectedPost({
      ...selectedPost,
      replies: [...selectedPost.replies, reply]
    });
    setNewReply('');
  };

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
              placeholder="Search topics..." 
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

      {/* Back Link */}
      <motion.div 
        className="back-link-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link to="/community" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Return to Community
        </Link>
      </motion.div>

      {/* Crisis Banner */}
      <motion.div 
        className="crisis-banner"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="crisis-icon">🌱</span>
        <span>Need immediate help? <a href="#">Connect with a crisis counselor.</a></span>
      </motion.div>

      {/* Main Content */}
      <main className="community-main">
        {selectedPost && (
          <motion.article 
            className="post-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Post Header */}
            <div className="post-meta">
              <span className="post-category">{selectedPost.category}</span>
              <span className="post-separator">•</span>
              <span className="post-author">{selectedPost.author}</span>
              <span className="post-separator">•</span>
              <span className="post-time">{selectedPost.timeAgo}</span>
            </div>

            {/* Post Title */}
            <h1 className="post-title">{selectedPost.title}</h1>

            {/* Post Content */}
            <div className="post-content">
              {selectedPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Reaction Buttons */}
            <div className="post-actions">
              <motion.button 
                className="action-btn relate-btn"
                onClick={handleRelate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                I relate
              </motion.button>
              <motion.button 
                className="action-btn support-btn"
                onClick={handleSupport}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11V21M17 11V21M12 3V21M12 3L16 7M12 3L8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Offer Support
              </motion.button>
            </div>
          </motion.article>
        )}

        {/* Replies Section */}
        {selectedPost && (
          <motion.section 
            className="replies-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="replies-title">
              Thoughtful Replies <span className="replies-count">({selectedPost.replies.length})</span>
            </h2>

            <div className="replies-list">
              <AnimatePresence>
                {selectedPost.replies.map((reply, index) => (
                  <motion.div 
                    key={reply.id}
                    className="reply-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="reply-meta">
                      <span className="reply-author">{reply.author}</span>
                      <span className="reply-separator">•</span>
                      <span className="reply-time">{reply.timeAgo}</span>
                    </div>
                    <p className="reply-content">{reply.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Reply Input */}
            <motion.div 
              className="reply-input-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="reply-input-header">
                <span className="reply-input-icon">✏️</span>
                <span>Share a supportive thought</span>
              </div>
              <textarea 
                className="reply-textarea"
                placeholder="Write gently... your words matter here."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
              />
              <div className="reply-input-footer">
                <motion.button 
                  className="post-reply-btn"
                  onClick={handlePostReply}
                  disabled={!newReply.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Post Reply
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default CommunityPostPage;

