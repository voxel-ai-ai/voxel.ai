import React from 'react';
import { ArrowRight } from 'lucide-react';
import { featureCards } from '@/components/data/siteData';

const gradients = [
  'bg-card-gradient-1',
  'bg-card-gradient-2',
  'bg-card-gradient-3',
  'bg-card-gradient-4',
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
              <div className={`h-40 ${gradients[index % 4]} relative`}>
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