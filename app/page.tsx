'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Array<{prompt: string, image?: string, video?: string}>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Static images - 9 placeholders named 1.jpg to 9.jpg
  // Place files under public/images/ with these names or adjust extensions.
  const sampleImages = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
  ];


  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type: mediaType }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (mediaType === 'video' && data.error) {
          setError(data.error);
        } else {
          throw new Error(data.error || 'Failed to generate media');
        }
        return;
      }

      if (data.image) {
        setGeneratedImage(data.image);
        setConversation(prev => [...prev, { prompt, image: data.image }]);
      } else if (data.video) {
        setGeneratedVideo(data.video);
        setConversation(prev => [...prev, { prompt, video: data.video }]);
      } else if (data.message) {
        setMessage(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const hasGeneratedContent = generatedImage || generatedVideo || conversation.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <main className="w-screen h-screen overflow-hidden bg-black flex flex-col">
      {/* Header Navigation */}
      <nav className="flex items-center justify-center border mt-4 mx-auto max-md:mx-4 max-md:w-[calc(100%-2rem)] max-md:justify-between border-slate-700 px-4 py-3 rounded-full text-white text-sm font-semibold z-[400] w-fit">
        <a href="#" className="mr-3">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4.706" cy="16" r="4.706" fill="#D9D9D9" />
            <circle cx="16.001" cy="4.706" r="4.706" fill="#D9D9D9" />
            <circle cx="16.001" cy="27.294" r="4.706" fill="#D9D9D9" />
            <circle cx="27.294" cy="16" r="4.706" fill="#D9D9D9" />
          </svg>
        </a>
        <div className="hidden md:flex items-center gap-4">
          <a href="https://www.linkedin.com/in/adnankhalil099/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">LinkedIn</span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">LinkedIn</span>
          </a>
          <a href="https://github.com/adnaan-2/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">GitHub</span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">GitHub</span>
          </a>
          <a href="https://share.gameidea.org/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">Project 1</span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">Project 1</span>
          </a>
          <a href="https://interview-prep-ten-rose.vercel.app/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">Project 2</span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">Project 2</span>
          </a>
          <a href="https://www.osaidtraveltours.com/" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden h-6 group">
            <span className="block group-hover:-translate-y-full transition-transform duration-300">Project 3</span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">Project 3</span>
          </a>
          <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="border border-slate-600 hover:bg-slate-800 px-3 py-1.5 rounded-full text-xs font-medium transition ml-2">
            Contact
          </a>
          <a href="YOUR_CV_LINK" target="_blank" rel="noopener noreferrer" className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-100 transition duration-300">
            Download CV
          </a>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 bg-black/95 w-full flex flex-col items-center gap-4 py-6 z-[400] border-b border-slate-700">
          <a className="hover:text-indigo-400 transition-colors" href="https://www.linkedin.com/in/adnankhalil099/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="hover:text-indigo-400 transition-colors" href="https://github.com/adnaan-2/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="hover:text-indigo-400 transition-colors" href="https://share.gameidea.org/" target="_blank" rel="noopener noreferrer">Project 1</a>
          <a className="hover:text-indigo-400 transition-colors" href="https://interview-prep-ten-rose.vercel.app/" target="_blank" rel="noopener noreferrer">Project 2</a>
          <a className="hover:text-indigo-400 transition-colors" href="https://www.osaidtraveltours.com/" target="_blank" rel="noopener noreferrer">Project 3</a>
          <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="border border-slate-600 hover:bg-slate-800 px-4 py-2 rounded-full text-sm font-medium transition">
            Contact
          </a>
          <a href="YOUR_CV_LINK" target="_blank" rel="noopener noreferrer" className="bg-white hover:shadow-[0px_0px_30px_14px] shadow-[0px_0px_30px_7px] hover:shadow-white/50 shadow-white/50 text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition duration-300">
            Download CV
          </a>
        </div>
      )}

      {/* Title Section - Only show when no content generated */}
      {!hasGeneratedContent && (
        <div className="text-center pt-4 sm:pt-6 md:pt-8 pb-3 sm:pb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white px-4">
            Your ultimate creative
          </h1>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent px-4">
            companion - Creativ
          </h1>
        </div>
      )}

      {/* Chat-like Results Section - Show when content is generated */}
      {hasGeneratedContent && (
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {conversation.map((item, index) => (
            <div key={index} className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
              {/* User Prompt */}
              <div className="flex justify-end">
                <div className="bg-gray-800/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 max-w-[85%] sm:max-w-[80%] text-white text-xs sm:text-sm md:text-base">
                  {item.prompt}
                </div>
              </div>
              
              {/* Generated Media */}
              <div className="flex justify-start">
                <div className="max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl overflow-hidden">
                  {item.image && (
                    <img
                      src={item.image}
                      alt="Generated"
                      className="w-full h-auto rounded-xl sm:rounded-2xl"
                    />
                  )}
                  {item.video && (
                    <video
                      src={item.video}
                      controls
                      autoPlay
                      loop
                      className="w-full h-auto rounded-xl sm:rounded-2xl"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start max-w-4xl mx-auto px-3 sm:px-4">
              <div className="bg-gray-800/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Bar Section */}
      <div className={`px-3 sm:px-4 md:px-6 lg:px-8 ${hasGeneratedContent ? 'pb-4 md:pb-6 pt-4' : 'pb-3 sm:pb-4'} flex items-center justify-center ${!hasGeneratedContent ? 'flex-1' : ''}`}>
        <div className="max-w-3xl w-full mx-auto">
          <div className="relative flex items-center gap-1.5 sm:gap-2 bg-gray-800/40 border border-gray-700/60 rounded-xl sm:rounded-2xl px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-gray-800/60 hover:shadow-lg hover:shadow-white/10 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 focus-within:shadow-xl focus-within:shadow-white/10">
            {/* Photo/Video Dropdown Button - Left Side */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg text-white text-xs transition-all duration-200"
              >
                <span className="capitalize">{mediaType}</span>
                <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full left-0 mt-1 w-20 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[300] overflow-hidden">
                  <button
                    onClick={() => {
                      setMediaType('photo');
                      setShowDropdown(false);
                      setGeneratedImage(null);
                      setGeneratedVideo(null);
                    }}
                    className={`w-full px-3 py-1.5 text-xs transition-colors ${
                      mediaType === 'photo' 
                        ? 'bg-gray-700/50 text-white' 
                        : 'text-gray-300 hover:bg-gray-700/30'
                    }`}
                  >
                    Photo
                  </button>
                  <button
                    onClick={() => {
                      setMediaType('video');
                      setShowDropdown(false);
                      setGeneratedImage(null);
                      setGeneratedVideo(null);
                    }}
                    className={`w-full px-3 py-1.5 text-xs transition-colors ${
                      mediaType === 'video' 
                        ? 'bg-gray-700/50 text-white' 
                        : 'text-gray-300 hover:bg-gray-700/30'
                    }`}
                  >
                    Video
                  </button>
                </div>
              )}
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe the ${mediaType} you want to generate...`}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-xs sm:text-sm md:text-base px-1 sm:px-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />

            {/* Send Button - Right Side */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-600"
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-red-500/10 border border-red-500/50 rounded-lg sm:rounded-xl text-red-400 text-xs sm:text-sm md:text-base text-center">
              {error}
            </div>
          )}

          {/* Info Message */}
          {message && (
            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg sm:rounded-xl text-blue-400 text-xs sm:text-sm md:text-base text-center">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Static Images Gallery - Only show when no content generated */}
      {!hasGeneratedContent && (
        <div className="relative h-[42vh] sm:h-[46vh] md:h-[50vh] lg:h-[54vh] xl:h-[58vh] mt-8 sm:mt-12 pb-2 sm:pb-3 md:pb-4 flex items-end justify-center overflow-visible">
          <div
            className="relative h-full w-full flex items-end justify-center"
            style={{ transformStyle: 'flat' }}
          >
            {/* 9 static images - center is largest, sides get progressively smaller */}
            {sampleImages.map((img, index) => {
              const centerIndex = Math.floor(sampleImages.length / 2);
              const diff = index - centerIndex;
              const distanceFromCenter = Math.abs(diff);

              // Base size with 5% step decrease away from center
              const baseVw = 16; // reduced by 20% from 20
              const scalePercent = Math.max(70, 100 - 5 * distanceFromCenter); // 100%, 95%, 90%, 85%, 80%, 75%, 70%
              const sizeVw = (baseVw * scalePercent) / 100;
              const widthSize = `clamp(${96 * scalePercent / 100}px, ${sizeVw}vw, ${260 * scalePercent / 100}px)`;
              const heightSize = `clamp(${120 * scalePercent / 100}px, ${sizeVw * 1.25}vw, ${320 * scalePercent / 100}px)`;

              // Overlap horizontally and stack by z-index (center on top)
              const offset = `calc(${diff} * clamp(70px, 8.5vw, 130px))`;
              const zIndex = 100 - distanceFromCenter;

              return (
                <div
                  key={index}
                  className={"rounded-xl sm:rounded-2xl overflow-hidden absolute cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-white/30 hover:ring-4 hover:ring-white/60 hover:brightness-110"}
                  style={{
                    width: widthSize,
                    height: heightSize,
                    left: '50%',
                    bottom: '0',
                    transform: `translateX(-50%) translateX(${offset})`,
                    zIndex,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.zIndex = '200')}
                  onMouseLeave={(e) => (e.currentTarget.style.zIndex = String(zIndex))}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg sm:rounded-xl bg-gray-900"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to a simple gray square using SVG data URI
                      // This will show if the image file is missing
                      const target = e.target as HTMLImageElement;
                      // Only set fallback once to avoid infinite loop
                      if (!target.src.includes('data:image/svg')) {
                        const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="#1a1a1a"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle" dy=".3em">Image ${index + 1}</text></svg>`;
                        target.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 z-10 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center shadow-lg transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </main>
  );
}
