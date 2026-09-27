import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, Clock, Calendar, Twitter, Linkedin,
  Facebook, Link2, Sun, Moon, ArrowRight, Check, Heart, BookOpen
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  cover_image?: string;
  category: string;
  author: string;
  readTime: string;
  createdAt: string;
  updatedAt: string;
  isPublished?: boolean;
}

// Extract headings from HTML content for Table of Contents
function extractHeadings(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  const headings: { id: string; text: string; level: number }[] = [];
  div.querySelectorAll('h2, h3').forEach((el, i) => {
    const text = el.textContent || '';
    const id = `heading-${i}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
    el.id = id;
    headings.push({ id, text, level: parseInt(el.tagName[1]) });
  });
  return { headings, html: div.innerHTML };
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clapped, setClapped] = useState(false);
  const [clapCount, setClapCount] = useState(0);
  const [readProgress, setReadProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState('');
  const [tocHeadings, setTocHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [processedContent, setProcessedContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('blog-dark-mode');
    if (saved === 'true') setDarkMode(true);
    const savedClaps = parseInt(localStorage.getItem(`blog-claps-${slug}`) || '0');
    setClapCount(savedClaps);
    setClapped(savedClaps > 0);
  }, [slug]);

  const toggleDark = () => {
    setDarkMode(d => {
      localStorage.setItem('blog-dark-mode', String(!d));
      return !d;
    });
  };

  const handleClap = () => {
    const newCount = clapCount + 1;
    setClapCount(newCount);
    setClapped(true);
    localStorage.setItem(`blog-claps-${slug}`, String(newCount));
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/${slug}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (!data.coverImage && data.cover_image) data.coverImage = data.cover_image;
          
          // Process content and extract TOC
          const { headings, html } = extractHeadings(data.content || '');
          setTocHeadings(headings);
          setProcessedContent(html);
          setPost(data);

          const allRes = await fetch('/api/blog', { cache: 'no-store' });
          if (allRes.ok) {
            const all: BlogPost[] = await allRes.json();
            setRelatedPosts(all.filter(p => p.id !== data.id).slice(0, 3));
          }
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setReadProgress(el.scrollHeight - el.clientHeight > 0
        ? Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
        : 0);

      // Active TOC heading
      if (tocHeadings.length > 0) {
        let current = tocHeadings[0].id;
        for (const h of tocHeadings) {
          const el = document.getElementById(h.id);
          if (el && el.getBoundingClientRect().top < 120) current = h.id;
        }
        setActiveHeading(current);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [tocHeadings]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const dm = darkMode;
  const bg = dm ? '#0d0d0d' : '#ffffff';
  const text = dm ? '#e8e8e8' : '#1a1a1a';
  const subtle = dm ? '#6b6b6b' : '#9b9b9b';
  const border = dm ? '#2a2a2a' : '#e8e8e8';
  const cardBg = dm ? '#161616' : '#f8f8f8';

  if (loading) {
    return (
      <div style={{ background: bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #c6ff00', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ background: bg, color: text, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ fontSize: 72 }}>📄</div>
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Post not found</h1>
        <Link to="/blog" style={{ color: '#1a8917', fontWeight: 600, textDecoration: 'none' }}>← Back to Blog</Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const coverImg = post.coverImage || post.cover_image || '';

  return (
    <>
      <Helmet>
        <title>{post.title} — Dreweb</title>
        <meta name="description" content={post.excerpt} />
        {coverImg && <meta property="og:image" content={coverImg} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Reading progress */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: 'transparent' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #c6ff00, #00e5ff)', width: `${readProgress}%`, transition: 'width 0.1s' }} />
      </div>

      {/* Global styles */}
      <style>{`
        body { margin: 0; font-family: 'Georgia', 'Charter', serif; }
        .blog-prose h1, .blog-prose h2, .blog-prose h3, .blog-prose h4 {
          font-family: 'Inter', 'Segoe UI', sans-serif;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 2.2em;
          margin-bottom: 0.6em;
          line-height: 1.25;
          color: ${text};
        }
        .blog-prose h2 { font-size: 1.75rem; border-bottom: 1px solid ${border}; padding-bottom: 0.4em; }
        .blog-prose h3 { font-size: 1.35rem; }
        .blog-prose p { font-size: 1.15rem; line-height: 1.85; color: ${dm ? '#d0d0d0' : '#292929'}; margin-bottom: 1.4em; }
        .blog-prose a { color: #1a8917; text-decoration: underline; }
        .blog-prose a:hover { color: #0d5c0e; }
        .blog-prose img { width: 100%; border-radius: 8px; margin: 2em 0; display: block; }
        .blog-prose blockquote {
          border-left: 4px solid #c6ff00;
          margin: 2em 0;
          padding: 0.5em 1.5em;
          background: ${dm ? '#1a1a1a' : '#f5fff0'};
          border-radius: 0 8px 8px 0;
          font-style: italic;
          font-size: 1.25rem;
          color: ${dm ? '#a0a0a0' : '#555'};
        }
        .blog-prose ul, .blog-prose ol { padding-left: 1.8em; margin-bottom: 1.4em; }
        .blog-prose li { font-size: 1.1rem; line-height: 1.8; color: ${dm ? '#d0d0d0' : '#292929'}; margin-bottom: 0.4em; }
        .blog-prose code { background: ${dm ? '#222' : '#f0f0f0'}; padding: 0.15em 0.45em; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: ${dm ? '#e0e0e0' : '#d63384'}; }
        .blog-prose pre { background: ${dm ? '#1a1a1a' : '#1e1e1e'}; color: #d4d4d4; padding: 1.5em; border-radius: 8px; overflow-x: auto; margin: 2em 0; }
        .blog-prose pre code { background: transparent; color: inherit; padding: 0; }
        .blog-prose strong { color: ${text}; font-weight: 700; }
        .blog-prose hr { border: none; border-top: 1px solid ${border}; margin: 3em auto; width: 60%; }
        .toc-link { display: block; font-family: 'Inter', sans-serif; font-size: 13px; color: ${subtle}; text-decoration: none; padding: 5px 8px 5px 12px; border-left: 2px solid transparent; transition: all 0.2s; line-height: 1.4; }
        .toc-link:hover { color: ${text}; border-left-color: #c6ff00; }
        .toc-link.active { color: ${text}; font-weight: 600; border-left-color: #c6ff00; }
        .toc-link.h3 { padding-left: 24px; font-size: 12px; }
        .share-btn { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${dm ? '#222' : '#f0f0f0'}; color: ${dm ? '#aaa' : '#666'}; border: none; cursor: pointer; transition: all 0.2s; }
        .share-btn:hover { background: ${dm ? '#333' : '#e0e0e0'}; color: ${text}; transform: scale(1.1); }
        .clap-btn { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${clapped ? '#c6ff00' : (dm ? '#222' : '#f0f0f0')}; color: ${clapped ? '#000' : (dm ? '#aaa' : '#666')}; border: 2px solid ${clapped ? '#c6ff00' : border}; cursor: pointer; transition: all 0.2s; font-size: 20px; }
        .clap-btn:hover { transform: scale(1.15); }
        @media (max-width: 900px) {
          .left-sidebar { display: none !important; }
          .right-sidebar { display: none !important; }
        }
      `}</style>

      <div style={{ background: bg, color: text, minHeight: '100vh' }}>
        {/* Top nav */}
        <header style={{ borderBottom: `1px solid ${border}`, background: dm ? 'rgba(13,13,13,0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, padding: '0 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: 8, color: subtle, textDecoration: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14 }}>
              <ArrowLeft size={16} /> All Articles
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Progress indicator */}
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: subtle, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={14} /> {readProgress}% read
              </div>
              <button onClick={toggleDark} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1px solid ${border}`, background: dm ? '#222' : '#f5f5f5', color: text, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {dm ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
              </button>
              <Link to="/contact" style={{ padding: '7px 18px', borderRadius: 20, background: '#c6ff00', color: '#000', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Free Audit →
              </Link>
            </div>
          </div>
        </header>

        {/* Layout: left sidebar + content + right sidebar */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 40, position: 'relative', paddingTop: 48 }}>

          {/* ─── Left Floating Share Sidebar ─── */}
          <div className="left-sidebar" style={{ width: 60, flexShrink: 0, position: 'sticky', top: 80, height: 'fit-content', alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button className="clap-btn" onClick={handleClap} title="Clap">
              👏
            </button>
            {clapCount > 0 && (
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: subtle, fontWeight: 600 }}>{clapCount}</span>
            )}
            <div style={{ width: 1, height: 20, background: border }} />
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="share-btn" title="Share on X">
              <Twitter size={16} />
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="share-btn" title="Share on LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="share-btn" title="Share on Facebook">
              <Facebook size={16} />
            </a>
            <button onClick={handleCopyLink} className="share-btn" title="Copy link" style={{ background: copied ? '#c6ff00' : undefined, color: copied ? '#000' : undefined }}>
              {copied ? <Check size={16} /> : <Link2 size={16} />}
            </button>
          </div>

          {/* ─── Main Article Content ─── */}
          <article style={{ flex: 1, maxWidth: 720, minWidth: 0 }}>

            {/* Category */}
            {post.category && (
              <div style={{ marginBottom: 16 }}>
                <Link to="/blog" style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#1a8917', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {post.category}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.025em', color: text, margin: '0 0 20px 0' }}>
              {post.title}
            </h1>

            {/* Subtitle/Excerpt */}
            {post.excerpt && (
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', lineHeight: 1.65, color: subtle, margin: '0 0 28px 0', fontStyle: 'italic' }}>
                {post.excerpt}
              </p>
            )}

            {/* Author row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 20, marginBottom: 32, borderBottom: `1px solid ${border}` }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #c6ff00, #00c896)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src="/brand-logo.png" alt="Dreweb" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, color: text }}>{post.author || 'Dreweb Editorial'}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#1a8917', border: '1px solid #1a8917', borderRadius: 12, padding: '2px 10px' }}>Follow</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: subtle }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  {post.readTime && (
                    <>
                      <span style={{ color: subtle }}>·</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: subtle, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} /> {post.readTime}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {/* Inline share buttons for mobile */}
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="share-btn">
                  <Twitter size={15} />
                </a>
                <button onClick={handleCopyLink} className="share-btn">
                  {copied ? <Check size={15} /> : <Link2 size={15} />}
                </button>
              </div>
            </div>

            {/* Cover image */}
            {coverImg && (
              <figure style={{ margin: '0 0 40px 0' }}>
                <img
                  src={coverImg}
                  alt={post.title}
                  style={{ width: '100%', maxHeight: 520, objectFit: 'cover', borderRadius: 12, display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).closest('figure')!.style.display = 'none'; }}
                />
                <figcaption style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: subtle, textAlign: 'center', marginTop: 10, fontStyle: 'italic' }}>
                  {post.title}
                </figcaption>
              </figure>
            )}

            {/* Article body */}
            <div
              ref={contentRef}
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: processedContent || post.content }}
            />

            {/* Bottom clap + share */}
            <div style={{ margin: '60px 0 40px', paddingTop: 32, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="clap-btn" onClick={handleClap} style={{ fontSize: 22 }}>👏</button>
                <div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 700, color: text }}>{clapCount > 0 ? clapCount : '0'} claps</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: subtle }}>Click to appreciate</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                  <Twitter size={14} /> Share
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: '#0A66C2', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
                  <Linkedin size={14} /> LinkedIn
                </a>
                <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: copied ? '#c6ff00' : (dm ? '#222' : '#f0f0f0'), color: copied ? '#000' : text, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  {copied ? <><Check size={14} /> Copied!</> : <><Link2 size={14} /> Copy link</>}
                </button>
              </div>
            </div>

            {/* Author card */}
            <div style={{ padding: 28, borderRadius: 16, background: cardBg, border: `1px solid ${border}`, marginBottom: 60, display: 'flex', gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #c6ff00, #00c896)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src="/brand-logo.png" alt="Dreweb" style={{ width: 42, height: 42, objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: subtle, marginBottom: 4 }}>Written by</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, fontWeight: 800, color: text, marginBottom: 6 }}>{post.author || 'Dreweb Editorial Team'}</div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, color: subtle, margin: 0, lineHeight: 1.6 }}>
                  Web design, React development, SEO strategy, and AI-powered digital growth — helping businesses build scalable, high-converting products.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <a href="https://twitter.com/drewebhq" target="_blank" rel="noreferrer" className="share-btn"><Twitter size={14} /></a>
                  <a href="https://linkedin.com/company/dreweb" target="_blank" rel="noreferrer" className="share-btn"><Linkedin size={14} /></a>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div style={{ borderRadius: 20, padding: '48px 40px', background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)', marginBottom: 60, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: '#c6ff00', opacity: 0.12, filter: 'blur(60px)' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#c6ff00' }}>Free for you</span>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.25 }}>
                  Ready to grow your digital presence?
                </h3>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#9a9a9a', margin: 0, maxWidth: 480, lineHeight: 1.7 }}>
                  Get a free audit of your website covering performance, SEO, user experience, and conversion strategy — personalised for your business.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  <Link to="/contact" style={{ padding: '12px 28px', borderRadius: 24, background: '#c6ff00', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                    Get Free Audit →
                  </Link>
                  <Link to="/portfolio" style={{ padding: '12px 28px', borderRadius: 24, background: 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
                    View Our Work
                  </Link>
                </div>
              </div>
            </div>

            {/* Related articles */}
            {relatedPosts.length > 0 && (
              <div style={{ marginBottom: 80 }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, color: text, marginBottom: 24 }}>More from Dreweb</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                  {relatedPosts.map(rp => {
                    const img = rp.coverImage || rp.cover_image || '';
                    return (
                      <Link key={rp.id} to={`/blog/${rp.slug}`} style={{ textDecoration: 'none', borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, background: cardBg, display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
                      >
                        {img && <div style={{ height: 140, overflow: 'hidden' }}><img src={img} alt={rp.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, margin: 0 }} /></div>}
                        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {rp.category && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a8917' }}>{rp.category}</span>}
                          <h4 style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: text, margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rp.title}</h4>
                          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: subtle, marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                            Read <ArrowRight size={11} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* ─── Right TOC Sidebar ─── */}
          <div className="right-sidebar" style={{ width: 240, flexShrink: 0, position: 'sticky', top: 80, height: 'fit-content', alignSelf: 'flex-start' }}>

            {/* Table of Contents */}
            {tocHeadings.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: subtle, marginBottom: 12, paddingLeft: 12 }}>
                  In this article
                </div>
                <nav>
                  {tocHeadings.map(h => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`toc-link ${h.level === 3 ? 'h3' : ''} ${activeHeading === h.id ? 'active' : ''}`}
                      onClick={e => {
                        e.preventDefault();
                        document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Mini CTA */}
            <div style={{ padding: 20, borderRadius: 12, background: cardBg, border: `1px solid ${border}` }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1a8917' }}>Free Audit</span>
              <h4 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 16, color: text, margin: '8px 0 8px', lineHeight: 1.35 }}>Get a free website review</h4>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: subtle, margin: '0 0 14px', lineHeight: 1.6 }}>Performance, SEO & UX — tailored for your business.</p>
              <Link to="/contact" style={{ display: 'block', padding: '9px 0', borderRadius: 20, background: '#c6ff00', color: '#000', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>
                Get Started →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
