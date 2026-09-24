import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin,
  Facebook, Link2, Sun, Moon, ArrowRight, User, Tag, Check
} from 'lucide-react';
import { Button } from '../components/ui/button';

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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('blog-dark-mode');
    if (saved === 'true') setDarkMode(true);
  }, []);

  const toggleDark = () => {
    setDarkMode(d => {
      localStorage.setItem('blog-dark-mode', String(!d));
      return !d;
    });
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/blog/${slug}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          // normalise cover image
          if (!data.coverImage && data.cover_image) data.coverImage = data.cover_image;
          setPost(data);

          // Fetch related posts
          const allRes = await fetch('/api/blog', { cache: 'no-store' });
          if (allRes.ok) {
            const all: BlogPost[] = await allRes.json();
            const related = all
              .filter(p => p.id !== data.id && p.isPublished !== false)
              .slice(0, 4);
            setRelatedPosts(related);
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

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setReadProgress(total > 0 ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  const dm = darkMode;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dm ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
        <div className="w-10 h-10 border-4 border-brand-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen pt-32 pb-24 flex items-center justify-center flex-col gap-6 ${dm ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-black'}`}>
        <div className="text-8xl">📄</div>
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link to="/blog">
          <Button variant="outline" className="rounded-2xl border-zinc-300">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const coverImg = post.coverImage || post.cover_image || '';

  return (
    <>
      <Helmet>
        <title>{post.title} — Dreweb Blog</title>
        <meta name="description" content={post.excerpt} />
        {coverImg && <meta property="og:image" content={coverImg} />}
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-brand-lime to-emerald-400 transition-all duration-100"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <main className={`min-h-screen pt-24 pb-24 transition-colors duration-300 ${dm ? 'bg-zinc-950 text-white' : 'bg-[#fafafa] text-black'}`}>
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Top nav bar */}
          <div className="flex items-center justify-between mb-10">
            <Link
              to="/blog"
              className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${dm ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'}`}
            >
              <ArrowLeft size={16} /> Back to all articles
            </Link>
            <button
              onClick={toggleDark}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all ${dm
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100 shadow-sm'
              }`}
            >
              {dm ? <Sun size={15} /> : <Moon size={15} />}
              {dm ? 'Light mode' : 'Dark mode'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

            {/* ─── Main Content ─── */}
            <div className="flex-1 min-w-0">

              {/* Category chip */}
              {post.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime text-black text-xs font-bold uppercase tracking-wider mb-5">
                  <Tag size={11} /> {post.category}
                </span>
              )}

              {/* Title */}
              <h1 className={`text-3xl md:text-5xl font-display font-extrabold leading-tight mb-6 ${dm ? 'text-white' : 'text-black'}`}>
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className={`text-lg md:text-xl leading-relaxed mb-6 ${dm ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {post.excerpt}
                </p>
              )}

              {/* Meta row */}
              <div className={`flex flex-wrap items-center gap-4 text-sm font-medium pb-8 mb-8 border-b ${dm ? 'text-zinc-400 border-zinc-800' : 'text-zinc-500 border-zinc-200'}`}>
                <div className="flex items-center gap-1.5">
                  <User size={15} />
                  <span className={`font-bold ${dm ? 'text-white' : 'text-black'}`}>{post.author || 'Dreweb AI'}</span>
                </div>
                <span className={dm ? 'text-zinc-700' : 'text-zinc-300'}>•</span>
                <div className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                {post.readTime && (
                  <>
                    <span className={dm ? 'text-zinc-700' : 'text-zinc-300'}>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={15} />
                      {post.readTime}
                    </div>
                  </>
                )}
              </div>

              {/* Cover Image */}
              {coverImg && (
                <div className="mb-12 rounded-3xl overflow-hidden shadow-xl border border-white/10">
                  <img
                    src={coverImg}
                    alt={post.title}
                    className="w-full object-cover max-h-[520px] w-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}

              {/* Prose Content */}
              <article
                className={`prose prose-lg md:prose-xl max-w-none
                  prose-headings:font-display prose-headings:font-extrabold
                  prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-2xl prose-img:shadow-lg
                  prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  ${dm
                    ? 'prose-invert prose-headings:text-white prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-code:bg-zinc-800 prose-blockquote:border-brand-lime prose-blockquote:text-zinc-400'
                    : 'prose-zinc prose-headings:text-black prose-blockquote:border-brand-lime'
                  }`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* ── CTA Banner ── */}
              <div className="my-16 relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-lime opacity-15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div className="max-w-xl">
                    <span className="inline-block px-3 py-1 bg-brand-lime/20 rounded-full text-brand-lime text-xs font-bold uppercase tracking-widest mb-4 border border-brand-lime/30">
                      Free Audit
                    </span>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                      Ready to grow your digital presence?
                    </h3>
                    <p className="text-zinc-400 text-base leading-relaxed">
                      Get a free website audit covering performance, SEO, UX, and conversion strategy — tailored for your business.
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <Link to="/contact">
                      <button className="w-full md:w-auto px-8 py-4 bg-brand-lime text-black font-bold rounded-2xl hover:bg-yellow-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(198,255,0,0.3)] text-base">
                        Get Free Audit →
                      </button>
                    </Link>
                    <Link to="/portfolio">
                      <button className="w-full md:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/10 text-base">
                        View Our Work
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Share this article (inline, after content) ── */}
              <div className={`mt-12 p-6 md:p-8 rounded-3xl border ${dm ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${dm ? 'text-zinc-400' : 'text-zinc-500'}`}>Share this article</p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-bold hover:opacity-80 transition-opacity"
                  >
                    <Twitter size={15} /> Share on X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-bold hover:opacity-80 transition-opacity"
                  >
                    <Linkedin size={15} /> LinkedIn
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-bold hover:opacity-80 transition-opacity"
                  >
                    <Facebook size={15} /> Facebook
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      copied
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : dm ? 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {copied ? <><Check size={15} /> Copied!</> : <><Link2 size={15} /> Copy Link</>}
                  </button>
                </div>
              </div>

              {/* ── Author Block ── */}
              <div className={`mt-8 p-6 md:p-8 rounded-3xl border flex flex-col sm:flex-row items-start gap-6 ${dm ? 'bg-zinc-900 border-zinc-800' : 'bg-gradient-to-br from-zinc-50 to-white border-zinc-200'}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${dm ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  <img src="/brand-logo.png" alt="Dreweb" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>Written by</p>
                  <h4 className={`text-lg font-display font-bold mb-2 ${dm ? 'text-white' : 'text-black'}`}>{post.author || 'Dreweb Editorial Team'}</h4>
                  <p className={`text-sm leading-relaxed ${dm ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Experts in modern web design, React development, SEO strategy, and digital growth. We help businesses build scalable, high-converting digital products.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <a href="https://twitter.com/drewebhq" target="_blank" rel="noreferrer" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${dm ? 'text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700' : 'text-zinc-400 hover:text-black bg-zinc-100 hover:bg-zinc-200'}`}><Twitter size={14} /></a>
                    <a href="https://linkedin.com/company/dreweb" target="_blank" rel="noreferrer" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${dm ? 'text-zinc-500 hover:text-white bg-zinc-800 hover:bg-zinc-700' : 'text-zinc-400 hover:text-black bg-zinc-100 hover:bg-zinc-200'}`}><Linkedin size={14} /></a>
                  </div>
                </div>
              </div>

              {/* ── More Articles (below content on mobile) ── */}
              {relatedPosts.length > 0 && (
                <div className="mt-12 lg:hidden">
                  <h3 className={`text-xl font-display font-bold mb-6 ${dm ? 'text-white' : 'text-black'}`}>More articles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedPosts.slice(0, 2).map(rp => (
                      <RelatedCard key={rp.id} post={rp} dm={dm} />
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ─── Sidebar ─── */}
            <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-28 space-y-5">

                {/* Share */}
                <div className={`rounded-2xl border p-5 ${dm ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <h3 className={`font-bold flex items-center gap-2 mb-4 text-sm uppercase tracking-wider ${dm ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    <Share2 size={15} /> Share this article
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-80 transition-opacity"
                    >
                      <Twitter size={15} /> Share on X / Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-semibold hover:opacity-80 transition-opacity"
                    >
                      <Linkedin size={15} /> Share on LinkedIn
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-semibold hover:opacity-80 transition-opacity"
                    >
                      <Facebook size={15} /> Share on Facebook
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                        copied
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : dm ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {copied ? <><Check size={15} /> Link copied!</> : <><Link2 size={15} /> Copy link</>}
                    </button>
                  </div>
                </div>

                {/* CTA sidebar */}
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                  <div className="relative z-10 p-5">
                    <span className="inline-block px-2 py-0.5 bg-brand-lime/20 text-brand-lime text-xs font-bold rounded-full border border-brand-lime/30 mb-3">Free</span>
                    <h4 className="text-white font-display font-bold text-base mb-2">Get a free website audit</h4>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">We'll review your site, SEO, and growth strategy at no cost.</p>
                    <Link to="/contact">
                      <button className="w-full py-2.5 bg-brand-lime text-black font-bold rounded-xl hover:bg-yellow-300 transition-colors text-sm">
                        Get Free Audit →
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Related articles */}
                {relatedPosts.length > 0 && (
                  <div className={`rounded-2xl border p-5 ${dm ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <h3 className={`font-bold mb-4 text-sm uppercase tracking-wider ${dm ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      More articles
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((rp, i) => (
                        <React.Fragment key={rp.id}>
                          {i > 0 && <div className={`h-px ${dm ? 'bg-zinc-800' : 'bg-zinc-100'}`} />}
                          <Link to={`/blog/${rp.slug}`} className="block group">
                            {(rp.coverImage || rp.cover_image) && (
                              <div className="w-full h-28 rounded-xl overflow-hidden mb-2.5">
                                <img
                                  src={rp.coverImage || rp.cover_image}
                                  alt={rp.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                                />
                              </div>
                            )}
                            {rp.category && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lime bg-brand-lime/10 px-2 py-0.5 rounded-full">
                                {rp.category}
                              </span>
                            )}
                            <h4 className={`text-sm font-bold mt-1.5 mb-1 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2 ${dm ? 'text-zinc-200' : 'text-zinc-800'}`}>
                              {rp.title}
                            </h4>
                            <p className={`text-xs flex items-center gap-1 font-semibold ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>
                              Read article <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                            </p>
                          </Link>
                        </React.Fragment>
                      ))}
                    </div>
                    <Link to="/blog">
                      <button className={`w-full mt-5 py-2.5 rounded-xl border text-sm font-bold transition-colors ${dm ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}>
                        View all articles →
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
    </>
  );
}

function RelatedCard({ post, dm }: { post: BlogPost; dm: boolean }) {
  const cover = post.coverImage || post.cover_image || '';
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group rounded-2xl border overflow-hidden flex flex-col transition-all hover:shadow-md ${dm ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
    >
      {cover && (
        <div className="h-36 overflow-hidden">
          <img src={cover} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        {post.category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-lime mb-1">{post.category}</span>
        )}
        <h4 className={`text-sm font-bold line-clamp-2 mb-2 ${dm ? 'text-zinc-100' : 'text-zinc-800'}`}>{post.title}</h4>
        <p className={`text-xs font-semibold flex items-center gap-1 mt-auto ${dm ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Read article <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
        </p>
      </div>
    </Link>
  );
}
