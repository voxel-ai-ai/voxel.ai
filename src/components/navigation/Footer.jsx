import React from 'react';
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
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <VoxelLogo size="default" />
            <p className="mt-4 text-sm text-foreground-muted max-w-xs">
              AI-Driven Content Creation. Revolutionizing how creators, businesses, and marketers produce content.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-foreground-muted hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-heading text-lg tracking-wider text-white mb-4">PRODUCT</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-sm text-foreground-muted hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-heading text-lg tracking-wider text-white mb-4">RESOURCES</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-sm text-foreground-muted hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading text-lg tracking-wider text-white mb-4">COMPANY</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-foreground-muted hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-muted">
            © 2026 VOXEL AI™. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-foreground-muted">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
}