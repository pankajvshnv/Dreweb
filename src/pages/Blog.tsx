import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: string;
  createdAt: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Helmet>
        <title>Blog - Dreweb | Web Design & Development Insights</title>
        <meta name="description" content="Discover the latest insights on web design, development, SEO, and digital strategy from the experts at Dreweb." />
      </Helmet>

      <main className="min-h-screen bg-zinc-50 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-black mb-4">
              Insights & Resources
            </h1>
            <p className="text-lg text-zinc-500 max-w-2xl">
              Discover the latest strategies, tutorials, and trends in web development, design, and digital growth.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="w-full aspect-[16/9] bg-zinc-200 rounded-2xl" />
                  <div className="h-4 bg-zinc-200 rounded-full w-1/4" />
                  <div className="h-6 bg-zinc-200 rounded-full w-3/4" />
                  <div className="h-4 bg-zinc-200 rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-zinc-200 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-2">No posts yet</h2>
              <p className="text-zinc-500">Check back later for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-3xl border border-zinc-200 overflow-hidden hover:border-zinc-300 transition-all hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 font-medium">
                        No image
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full bg-black/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {post.readTime && (
                        <>
                          <div className="w-1 h-1 rounded-full bg-zinc-300" />
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {post.readTime}
                          </div>
                        </>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-black mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-zinc-500 text-sm mb-6 line-clamp-3 flex-grow">
                      {post.excerpt || 'Read this post to learn more...'}
                    </p>

                    <div className="flex items-center text-sm font-bold text-black mt-auto group-hover:text-brand-blue transition-colors">
                      Read Article <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
