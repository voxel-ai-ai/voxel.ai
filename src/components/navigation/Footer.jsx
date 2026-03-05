import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import VoxelLogo from '../VoxelLogo';
import { Twitter, Instagram, Youtube, Linkedin, Github } from 'lucide-react';
import ChatWidget from '../common/ChatWidget';

const footerLinks = {
  product: [
    { name: 'Image Generation', path: 'Image' },
    { name: 'Video Creation', path: 'Video' },
    { name: 'Video Editor', path: 'Edit' },
    { name: 'Audio Studio', path: 'Audio' },
    { name: 'All Apps', path: 'Apps' },
    { name: 'Templates', path: 'Templates' },
  ],
  resources: [
    { name: 'Community', path: 'Community' },
    { name: 'Pricing', path: 'Pricing' },
    { name: 'Documentation', path: '#' },
    { name: 'API Reference', path: '#' },
    { name: 'Tutorials', path: '#' },
  ],
  company: [
    { name: 'About', path: '#' },
    { name: 'Blog', path: '#' },
    { name: 'Careers', path: '#' },
    { name: 'Press Kit', path: '#' },
    { name: 'Contact', path: '#' },
    { name: 'Q&A', path: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <>
      <ChatWidget />
      <footer className="bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground-muted">
              &copy; 2026 VOXEL AI&trade;. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Notice</a>
              <button
                onClick={() => window.__voxelChatOpen?.()}
                className="hover:text-white transition-colors"
              >
                Q&amp;A
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}