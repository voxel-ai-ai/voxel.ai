import React from 'react';
import Navbar from './components/navigation/Navbar';
import Footer from './components/navigation/Footer';
import { Toaster } from '@/components/ui/sonner';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <Toaster position="bottom-right" />
      
      {/* Mobile Floating Create Button */}
      <Link
        to={createPageUrl('Image')}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-full shadow-lg border-glow-red transition-all"
      >
        <Plus size={20} />
        Create
      </Link>
    </div>
  );
}