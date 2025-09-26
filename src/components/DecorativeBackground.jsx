import React from 'react';

const DecorativeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating emojis and icons */}
      <div className="absolute top-1/4 left-1/4 text-4xl opacity-20 animate-float">
        🎓
      </div>
      <div className="absolute top-1/3 right-1/4 text-3xl opacity-20 animate-float-delay-1">
        🧠
      </div>
      <div className="absolute top-2/3 left-1/3 text-2xl opacity-20 animate-float-delay-2">
        ✨
      </div>
      <div className="absolute bottom-1/4 right-1/3 text-3xl opacity-20 animate-float-delay-3">
        📚
      </div>
      <div className="absolute top-1/5 right-1/5 text-2xl opacity-20 animate-float-delay-4">
        💡
      </div>
      <div className="absolute bottom-1/3 left-1/5 text-4xl opacity-20 animate-float-delay-5">
        🎯
      </div>
      <div className="absolute top-1/2 left-1/5 text-3xl opacity-15 animate-float-delay-3">
        📝
      </div>
      <div className="absolute bottom-1/4 left-2/3 text-4xl opacity-15 animate-float-delay-1">
        🧩
      </div>
      
      {/* Geometric shapes */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-accent/10 blur-xl animate-pulse-delay"></div>
      <div className="absolute top-1/3 left-1/2 w-16 h-16 rounded-full bg-success/10 blur-lg animate-pulse"></div>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 15px 15px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      {/* Additional floating elements */}
      <div className="absolute top-1/6 right-1/3 text-xl opacity-15 animate-float-delay-2">
        📊
      </div>
      <div className="absolute bottom-1/3 right-1/6 text-2xl opacity-15 animate-float-delay-4">
        ⏱️
      </div>
    </div>
  );
};

export default DecorativeBackground;