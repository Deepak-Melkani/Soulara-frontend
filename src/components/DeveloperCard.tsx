'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react';

interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'portfolio';
  url: string;
}

interface Developer {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks: SocialLink[];
}

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <Github className="w-6 h-6" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6" />;
      case 'twitter':
        return <Twitter className="w-6 h-6" />;
      case 'portfolio':
        return <Globe className="w-6 h-6" />;
      default:
        return <ExternalLink className="w-6 h-6" />;
    }
  };

  const getSocialColor = (platform: string) => {
    switch (platform) {
      case 'github':
        return 'hover:bg-gray-900 hover:text-white';
      case 'linkedin':
        return 'hover:bg-blue-600 hover:text-white';
      case 'twitter':
        return 'hover:bg-blue-400 hover:text-white';
      case 'portfolio':
        return 'hover:bg-purple-600 hover:text-white';
      default:
        return 'hover:bg-gray-600 hover:text-white';
    }
  };

  return (
    <div 
      className="group perspective-1000 h-[520px] w-full max-w-sm mx-auto"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d duration-700 cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <motion.div 
          className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-200 hover:shadow-2xl transition-shadow duration-300"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="aspect-square overflow-hidden rounded-t-2xl">
            <Image 
              src={developer.image} 
              alt={developer.name}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-primary-800 mb-2">{developer.name}</h3>
            <p className="text-primary-600 font-semibold mb-4 text-base">{developer.role}</p>
            <p className="text-sm text-foreground leading-relaxed line-clamp-3">
              {developer.description}
            </p>
          </div>
          
          {/* Hover indicator */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary-500 text-white p-3 rounded-full shadow-lg">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Back Side */}
        <motion.div 
          className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-xl overflow-hidden border border-primary-200 flex flex-col justify-center items-center p-10"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">{developer.name}</h3>
            <p className="text-primary-100 font-semibold text-lg">{developer.role}</p>
          </div>
          
          <div className="text-center mb-8 w-full">
            <h4 className="text-white font-semibold mb-6 text-lg">Connect with me</h4>
            <div className="grid grid-cols-2 gap-4">
              {developer.socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center justify-center p-4 rounded-xl 
                    bg-white/10 backdrop-blur-sm border border-white/20 
                    text-white transition-all duration-300 transform
                    hover:scale-105 hover:shadow-lg
                    ${getSocialColor(link.platform)}
                  `}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {getSocialIcon(link.platform)}
                  <span className="ml-2 text-sm font-medium capitalize">
                    {link.platform}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          <motion.div 
            className="text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-primary-100 text-sm leading-relaxed">
              &quot;Building the future of meaningful connections through code&quot;
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeveloperCard;