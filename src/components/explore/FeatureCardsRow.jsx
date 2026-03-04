import React from 'react';
import { ArrowRight } from 'lucide-react';
import { featureCards } from '@/components/data/siteData';

const gradientStyles = [
  'linear-gradient(135deg, #1a0000 0%, #8B0000 50%, #1a1a1a 100%)',
  'linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #2a0a0a 100%)',
  'linear-gradient(135deg, #0d0d0d 0%, #2a0000 60%, #111 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #3a1a00 50%, #0a0a0a 100%)',
];

export default function FeatureCardsRow() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {featureCards.map((card, index) => (
            <div 
              key={card.id}
              className="group flex-shrink-0 w-72 rounded-xl border border-border bg-background-secondary overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image Placeholder */}
              <div className="h-40 relative" style={{ background: gradientStyles[index % 4] }}>
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-primary text-white rounded">
                  {card.tag}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-foreground-muted line-clamp-2">
                  {card.description}
                </p>
                <div className="flex items-center mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try Now <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}