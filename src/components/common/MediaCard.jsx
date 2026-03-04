import React, { useState } from 'react';
import { Play, Eye, Heart, Copy, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const gradients = [
  'bg-card-gradient-1',
  'bg-card-gradient-2',
  'bg-card-gradient-3',
  'bg-card-gradient-4',
];

export default function MediaCard({ 
  type = 'image', 
  title,
  model,
  category,
  creator,
  views,
  likes,
  prompt,
  onClick,
  gradientIndex = 0,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        "hover:-translate-y-1 hover:border-glow-red",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={cn(
        "aspect-[4/5] w-full",
        gradients[gradientIndex % gradients.length]
      )}>
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
        {model && (
          <span className="px-2 py-1 text-xs font-semibold bg-primary text-white rounded-full">
            {model}
          </span>
        )}
        {category && (
          <span className="px-2 py-1 text-xs font-medium bg-black/60 text-white rounded-full backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      {/* Hover Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent",
        "flex flex-col justify-end p-4 transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <div className="space-y-3">
          {title && (
            <h3 className="text-white font-semibold text-lg">{title}</h3>
          )}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 border-white/30 text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-1" />
              View Prompt
            </Button>
            <Button 
              size="sm"
              className="flex-1 bg-primary hover:bg-primary-hover text-white"
            >
              <Wand2 className="w-4 h-4 mr-1" />
              Recreate
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      {(creator || views || likes) && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between text-sm text-foreground-secondary">
            {creator && <span>@{creator}</span>}
            <div className="flex items-center gap-3">
              {views && (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {views}
                </span>
              )}
              {likes && (
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {likes}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}