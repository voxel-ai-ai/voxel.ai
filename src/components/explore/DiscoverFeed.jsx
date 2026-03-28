import React, { useState } from 'react';
import MediaCard from '@/components/common/MediaCard';
import { communityFeed } from '@/components/data/siteData';
import { X, Copy, Wand2 } from 'lucide-react';
import { toast } from 'sonner';


export default function DiscoverFeed() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl sm:text-5xl tracking-wider text-white mb-4">
            DISCOVER THE PROJECTS, AND RECREATE IT!
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Browse AI-generated content. Click any card to see its prompt and recreate it.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {communityFeed.map((item, index) => (
            <MediaCard
              key={item.id}
              type={item.type}
              model={item.model}
              creator={item.creator}
              views={item.views}
              likes={item.likes}
              prompt={item.prompt}
              imageUrl={item.imageUrl}
              videoUrl={item.videoUrl}
              gradientIndex={index}
              className=""
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-10">
          <button className="px-8 py-3 text-foreground-secondary hover:text-white border border-border hover:border-primary/50 rounded-full transition-all duration-300">
            Load More
          </button>
        </div>
      </div>

      {selectedItem && (
        <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
}