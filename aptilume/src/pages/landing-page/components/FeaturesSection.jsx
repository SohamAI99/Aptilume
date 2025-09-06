import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: "Brain",
      title: "AI-Powered Questions",
      description: "Advanced algorithms generate personalized questions tailored to your skill level and learning pace.",
      color: "primary"
    },
    {
      id: 2,
      icon: "Eye",
      title: "Real-Time Proctoring",
      description: "Secure exam environment with webcam monitoring, tab-switch detection, and integrity verification.",
      color: "secondary"
    },
    {
      id: 3,
      icon: "BarChart3",
      title: "Comprehensive Analytics",
      description: "Detailed performance insights with difficulty analysis, time tracking, and improvement recommendations.",
      color: "accent"
    },
    {
      id: 4,
      icon: "Clock",
      title: "Adaptive Testing",
      description: "Dynamic difficulty adjustment based on your responses for optimal learning and assessment experience.",
      color: "warning"
    },
    {
      id: 5,
      icon: "Shield",
      title: "Enterprise Security",
      description: "Bank-grade security with HMAC verification, encrypted data transmission, and secure authentication.",
      color: "error"
    },
    {
      id: 6,
      icon: "Users",
      title: "Multi-Role Platform",
      description: "Seamless experience for students, educators, and administrators with role-based access control.",
      color: "primary"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  // Get color classes based on feature color
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary': return 'bg-primary text-primary-foreground';
      case 'secondary': return 'bg-secondary text-secondary-foreground';
      case 'accent': return 'bg-accent text-accent-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'error': return 'bg-error text-error-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for <span className="text-primary">Modern Assessment</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, deliver, and analyze assessments with cutting-edge technology
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features?.map((feature) => (
            <motion.div
              key={feature?.id}
              variants={itemVariants}
              className="group"
            >
              <div className="glass-card p-8 h-full hover:shadow-elevation-3 transition-all duration-300 spring-bounce">
                {/* Icon */}
                <div className={`w-16 h-16 ${getColorClasses(feature?.color)} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature?.icon} size={24} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-4">{feature?.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature?.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;