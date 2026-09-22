import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ArrowLeft, Clock, Calendar, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Button } from '../components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-lime border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-32 pb-24 flex items-center justify-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <Link to="/blog">
          <Button variant="outline" className="rounded-xl border-zinc-200 hover:bg-zinc-100">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <>
      <Helmet>
        <title>{post.title} - Dreweb Blog</title>
        <meta name="description" content={post.excerpt} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
      </Helmet>

      <main className="min-h-screen bg-white pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Main Content Column */}
            <div className="flex-1 max-w-4xl lg:max-w-3xl xl:max-w-4xl">
              
              {/* Header Section */}
              <div className="mb-10 pb-10 border-b border-zinc-100">
                <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black mb-8 transition-colors">
                  <ArrowLeft size={16} className="mr-2" /> Back to all articles
                </Link>
                
                <h1 className="text-4xl md:text-5xl font-display font-extrabold text-black mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    Published {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <span className="text-zinc-300">•</span>
                  {post.readTime && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        {post.readTime}
                      </div>
                      <span className="text-zinc-300">•</span>
                    </>
                  )}
                  {post.category && (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-black uppercase tracking-wide">
                      {post.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Cover Image */}
              {post.coverImage && (
                <div className="mb-12 rounded-3xl overflow-hidden border border-zinc-100 shadow-sm">
                  <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
                </div>
              )}

              {/* Prose Content */}
              <article 
                className="prose prose-lg md:prose-xl max-w-none prose-zinc prose-headings:font-display prose-headings:font-extrabold prose-a:text-brand-blue hover:prose-a:text-blue-700 prose-a:no-underline prose-img:rounded-2xl prose-img:border prose-img:border-zinc-100 prose-img:shadow-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Mid-Content CTA (Simulating the Kolena Free Tool CTA) */}
              <div className="my-16 bg-zinc-900 rounded-3xl p-8 md:p-12 text-white border border-black relative overflow-hidden shadow-2xl">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lime opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div className="max-w-xl">
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-brand-lime text-xs font-bold uppercase tracking-widest mb-4 border border-white/10">Free Resource</span>
                    <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Want to elevate your digital presence?</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      Get a free audit of your current website, SEO performance, and digital strategy. We'll show you exactly what to improve to convert more visitors into leads.
                    </p>
                  </div>
                  <div className="w-full md:w-auto flex-shrink-0">
                    <Link to="/contact">
                      <Button className="w-full md:w-auto h-14 px-8 bg-brand-lime text-black hover:bg-brand-lime/90 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(198,255,0,0.3)] hover:scale-105 transition-all">
                        Get Free Audit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Author Block */}
              <div className="mt-16 pt-8 border-t border-zinc-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-zinc-50 p-6 md:p-8 rounded-3xl border border-zinc-100">
                  <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner">
                    <img src="/brand-logo.png" alt="Dreweb" className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">Written by</p>
                    <h4 className="text-xl font-display font-bold text-black">{post.author || 'Dreweb Editorial Team'}</h4>
                    <p className="text-zinc-600 mt-2 leading-relaxed">
                      The Dreweb editorial team shares insights on web design, modern technology stacks, SEO optimization, and digital strategy to help your business grow.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Twitter size={18} /></a>
                      <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Linkedin size={18} /></a>
                      <a href="#" className="text-zinc-400 hover:text-black transition-colors"><Facebook size={18} /></a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar Column */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-32">
                
                {/* Share Block */}
                <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm mb-8">
                  <h3 className="font-bold text-black mb-4 flex items-center gap-2">
                    <Share2 size={18} /> Share this article
                  </h3>
                  <div className="flex items-center gap-2">
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-black hover:text-white transition-all">
                      <Twitter size={16} />
                    </a>
                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-[#0A66C2] hover:text-white transition-all">
                      <Linkedin size={16} />
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-[#1877F2] hover:text-white transition-all">
                      <Facebook size={16} />
                    </a>
                  </div>
                </div>

                {/* More Articles Block */}
                <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-6 shadow-sm">
                  <h3 className="font-bold text-black mb-6">More articles on Web Design:</h3>
                  <div className="space-y-4">
                    {/* Placeholder links, these could be fetched from API in the future */}
                    <Link to="/blog" className="block group">
                      <h4 className="text-sm font-semibold text-zinc-700 group-hover:text-brand-blue transition-colors leading-snug">
                        Why Performance Matters: The Impact of Load Times on SEO
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">Read article →</p>
                    </Link>
                    <div className="w-full h-px bg-zinc-200"></div>
                    <Link to="/blog" className="block group">
                      <h4 className="text-sm font-semibold text-zinc-700 group-hover:text-brand-blue transition-colors leading-snug">
                        Building Scalable Web Apps with React & Node.js
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">Read article →</p>
                    </Link>
                    <div className="w-full h-px bg-zinc-200"></div>
                    <Link to="/blog" className="block group">
                      <h4 className="text-sm font-semibold text-zinc-700 group-hover:text-brand-blue transition-colors leading-snug">
                        Top 5 UI Trends Dominating 2026
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">Read article →</p>
                    </Link>
                  </div>
                  
                  <Link to="/blog">
                    <Button variant="outline" className="w-full mt-6 rounded-xl border-zinc-200 hover:bg-white bg-white">
                      View all articles
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
            
          </div>
        </div>
      </main>
    </>
  );
}
