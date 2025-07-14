import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-gray-900 to-black text-white pt-10 pb-6 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        
        {/* Brand & Description */}
        <div>
          <h1 className="text-2xl font-bold mb-2">
            MyBlog<span className="text-blue-400">.</span>
          </h1>
          <p className="text-gray-400">
            Discover thoughts, stories, and ideas from people all over the world. Join us on a journey of creativity and expression.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-blue-400">Useful Links</h2>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
            <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-blue-400">Follow Us</h2>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-400 transition"><FaInstagram /></a>
            <a href="https://github.com/abdullahkhan88" className="hover:text-blue-400 transition"><FaGithub /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-700"></div>

      {/* Bottom Section */}
      <div className="text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} MyBlog. All rights reserved. | Created by <span className="text-blue-400 font-semibold">Er. Abdullah Khan</span>
      </div>
    </footer>
  );
};

export default Footer;
