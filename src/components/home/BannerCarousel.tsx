import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
}

// Function to transform image URL for better quality
const getTransformedImageUrl = (imageUrl: string, width: number, height: number) => {
  try {
    const url = new URL(imageUrl);
    // Check if it's a Supabase storage URL
    if (url.hostname.includes('supabase')) {
      // Add transformation parameters for better quality
      url.searchParams.set('width', width.toString());
      url.searchParams.set('height', height.toString());
      url.searchParams.set('quality', '90');
      url.searchParams.set('resize', 'cover');
    }
    return url.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    return imageUrl;
  }
};

interface BannerCarouselProps {
  categories?: any[];
}

export function BannerCarousel({ categories }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data: banners, isLoading } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_banners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as Banner[];
    },
  });

  const nextSlide = useCallback(() => {
    if (!banners || banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners]);

  const prevSlide = useCallback(() => {
    if (!banners || banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners]);

  // Auto-advance slides
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners, nextSlide]);

  // Close open seller menus on outside click or when banner changes
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      // if click is outside any open menu, close
      if (openMenuFor) {
        const menuEl = document.getElementById(`seller-menu-${openMenuFor}`);
        if (menuEl && !menuEl.contains(target)) {
          setOpenMenuFor(null);
        }
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [openMenuFor]);

  if (isLoading) {
    return <Skeleton className="w-full aspect-[21/9] rounded-2xl" />;
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const BannerContent = () => (
    <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden">
      {/* Category strip overlay (top) */}
      {categories && categories.length > 0 && (
        <div className="absolute top-4 left-0 right-0 pointer-events-auto">
          <div className="container mx-auto px-4">
            <div className="bg-background/60 backdrop-blur-md rounded-xl p-2 inline-flex gap-4 overflow-x-auto hide-scrollbar">
              {categories.filter((c: any) => c.parent_id == null && c.seller_id == null).slice(0, 12).map((cat: any) => (
                <div key={cat.id} className="relative group">
                  <a
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className="flex flex-col items-center text-center min-w-[72px]"
                  >
                    <div className="w-12 h-12 rounded-md bg-card overflow-hidden flex items-center justify-center">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-sm text-muted-foreground">{cat.name?.charAt(0)}</div>
                      )}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground">{cat.name}</span>
                  </a>

                  {/* Hover flyout showing seller values (desktop) */}
                  <div className="hidden md:block absolute left-0 top-full mt-2 z-50">
                    <div ref={containerRef} className={"min-w-[220px] bg-card rounded-lg shadow-lg p-2 transition-opacity " + (openMenuFor === cat.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none') + " group-hover:opacity-100 group-hover:pointer-events-auto"}>
                      {
                        // Group child categories by seller_id so we can show seller name as a header
                        (() => {
                          const children = (categories.filter((ch: any) => ch.parent_id === cat.id && ch.seller_id) || []);
                          const grouped: Record<string, any[]> = {};
                          children.forEach((c: any) => {
                            const key = c.seller_id || 'unknown';
                            if (!grouped[key]) grouped[key] = [];
                            grouped[key].push(c);
                          });

                          return Object.entries(grouped).map(([sellerId, items]) => (
                            <div key={sellerId} className="mb-2">
                              <div className="px-3 py-1 text-sm font-medium text-foreground border-b border-border/30">{(items[0] as any).seller_name || 'Seller'}</div>
                              <div>
                                {items.map((ch: any) => (
                                  <a key={ch.id} href={`/products?category=${encodeURIComponent(ch.id)}`} className="block px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded">{ch.name}</a>
                                ))}
                              </div>
                            </div>
                          ));
                        })()
                      }
                    </div>
                  </div>
                  {/* Click toggle button for showing seller menu on click (desktop) */}
                  <div className="absolute right-0 top-0 mt-1 mr-1">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuFor(openMenuFor === cat.id ? null : cat.id); }}
                      className="hidden md:inline-flex items-center justify-center w-6 h-6 rounded-full bg-background/80 hover:bg-background text-sm"
                      aria-expanded={openMenuFor === cat.id}
                      aria-controls={`seller-menu-${cat.id}`}
                      title="Show seller categories"
                    >
                      ▾
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <img
        // Use transformed image URL for better quality
        src={getTransformedImageUrl(currentBanner.image_url, 1920, 1080)}
        alt={currentBanner.title || 'Banner'}
        className="w-full h-full object-cover"
        style={{ 
          animation: 'bannerFadeInOut 0.8s ease-in-out',
        }}
        // Add loading optimization
        loading="eager"
      />
      
      {/* Overlay removed to display banner images as-is */}
      
      {/* Content */}
      {(currentBanner.title || currentBanner.subtitle) && (
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-lg animate-fade-in">
              {currentBanner.title && (
                <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                  <span className="gradient-gold-text">{currentBanner.title}</span>
                </h2>
              )}
              {currentBanner.subtitle && (
                <p className="text-sm md:text-lg text-muted-foreground">
                  {currentBanner.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prevSlide(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); nextSlide(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(index); }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex 
                  ? "bg-primary w-6" 
                  : "bg-primary/30 hover:bg-primary/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (currentBanner.link_url) {
    return (
      <Link to={currentBanner.link_url} className="block">
        <BannerContent />
      </Link>
    );
  }

  return (
    <>
      <BannerContent />
    </>
  );
}