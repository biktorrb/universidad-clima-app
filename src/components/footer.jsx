import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import About from '@/components/about' 

export default function Footer(){
    return (
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Copyright Section */}
          <div className="text-center md:text-left text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Derechos reservados por la UNEFA.
          </div>
  
          {/* Navigation Links Section */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-medium">
            <About/>
            <a href="/admin/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Administrador
            </a>
          </nav>
  
          {/* Social Media Icons Section */}
          <div className="flex justify-center md:justify-end space-x-4">
            <a
              href="https://www.facebook.com/unefa.ve/"
              aria-label="Facebook"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/unefa_ven"
              aria-label="Twitter"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/unefa_ve/"
              aria-label="Instagram"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    );
  };