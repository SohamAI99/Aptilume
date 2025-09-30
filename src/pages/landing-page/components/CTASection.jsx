import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Zap, Shield, Users, Award, CheckCircle, Clock, Rocket, PlayCircle } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/authentication-login-register');
  };

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      icon: <Zap className="h-5 w-5 text-white" />,
      text: "Get started in under 2 minutes"
    },
    {
      icon: <Shield className="h-5 w-5 text-white" />,
      text: "Enterprise-grade security"
    },
    {
      icon: <Users className="h-5 w-5 text-white" />,
      text: "24/7 customer support"
    },
    {
      icon: <Award className="h-5 w-5 text-white" />,
      text: "Trusted by 50K+ students"
    }
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to <span className="text-primary">Transform</span> Your Testing Experience?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students and institutions who have already discovered the power of AI-driven aptitude testing.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {benefits?.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 p-4 glass-card rounded-lg"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  {benefit?.icon}
                </div>
                <span className="text-sm font-medium text-foreground">{benefit?.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              variant="default"
              size="xl"
              icon={<Rocket className="h-5 w-5" />}
              iconPosition="left"
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-10 py-5 text-lg font-semibold spring-bounce"
            >
              Get Started Free
            </Button>
            <Button
              variant="outline"
              size="xl"
              icon={<PlayCircle className="h-5 w-5" />}
              iconPosition="left"
              onClick={handleLearnMore}
              className="w-full sm:w-auto px-10 py-5 text-lg font-semibold spring-bounce"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-accent" />
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-accent" />
              <span>100% secure & private</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;