// sih-project/src/Components/LandingPage/LokSamadhanLanding.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Camera, 
  Clock, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Users, 
  CheckCircle,
  Menu,
  X,
  Play,
  ArrowRight,
  Star,
  TrendingUp,
  FileText,
  AlertCircle,
  Send,
  Download,
  ExternalLink,
  Heart,
  ThumbsUp,
  Target,
  Zap,
  Cloud,
  Server,
  Cpu,
  Map
} from 'lucide-react';

const LokSamadhanLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState({
    complaints: 0,
    citizens: 0,
    responseTime: 0,
    satisfaction: 0
  });

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate counters
  useEffect(() => {
    const targets = {
      complaints: 25847,
      citizens: 50000,
      responseTime: 24,
      satisfaction: 94
    };

    const animateCounter = (key, target) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setStats(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }
      }, 30);
    };

    const timer = setTimeout(() => {
      Object.entries(targets).forEach(([key, value]) => {
        animateCounter(key, value);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Instant Reporting",
      description: "Report issues with photos, videos, and automatic location tagging. Voice notes and text descriptions provide complete context for faster resolution.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Live Issue Map",
      description: "Interactive city-wide map showing all reported issues in real-time. Priority areas highlighted based on volume and urgency for better resource allocation.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description: "Track your complaint through every stage: Registered → In Review → Assigned → In Progress → Resolved. Stay informed with automatic notifications.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Government authorities access powerful analytics with complaint heatmaps, trend analysis, and workload distribution for data-driven decisions.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Smart Routing",
      description: "Automated complaint routing to relevant departments based on issue type and location. Escalation mechanism ensures timely resolution.",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Scalable",
      description: "Built on AWS cloud infrastructure with enterprise-grade security. Handles reporting spikes with fast image uploads and responsive performance.",
      gradient: "from-emerald-500 to-green-600"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Report the Issue",
      description: "Take a photo, add your location, select the issue category, and provide a brief description. Submit in seconds through our mobile app or web portal.",
      icon: <Camera className="w-6 h-6" />
    },
    {
      number: "02",
      title: "Automatic Processing",
      description: "Your report is automatically categorized and routed to the appropriate government department. You receive a unique tracking ID instantly.",
      icon: <Cpu className="w-6 h-6" />
    },
    {
      number: "03",
      title: "Department Action",
      description: "The responsible department reviews your report, assigns it to field teams, and begins resolution work. Progress updates are sent automatically.",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor resolution progress in real-time through the app. Receive notifications at each stage and rate the service once resolved.",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  const platformOverview = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Multi-Platform Access",
      description: "Android app built with Kotlin and Jetpack Compose, plus a responsive web portal using React and Tailwind CSS."
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: "Complaint Registration",
      description: "Citizens can log issues with photos, videos, geo-location, and category selection for precise reporting."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-Time Status Tracking",
      description: "Track complaints through all stages: Registered → In Review → Assigned → In Progress → Resolved."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Notifications & Alerts",
      description: "Automatic updates via push notifications, SMS, or email to keep citizens informed at every step."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Government authorities get access to complaint heatmaps, trends, and workload distribution."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Escalation Mechanism",
      description: "Unresolved complaints automatically escalate to higher authorities based on predefined rules."
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Secure & Scalable Backend",
      description: "Built on AWS with Lambda, API Gateway, and S3 for reliability and high availability."
    },
    {
      icon: <ThumbsUp className="w-6 h-6" />,
      title: "Feedback Loop",
      description: "Citizens can rate resolution quality, creating a continuous improvement cycle for services."
    }
  ];

  const innovations = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI-Powered Categorization",
      description: "Future capability for auto-tagging complaints using image/text recognition for faster routing.",
      status: "Future Scope"
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: "Geospatial Mapping",
      description: "Issues plotted on interactive maps to identify high-density problem areas and optimize resource allocation.",
      status: "Implemented"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Escalation Matrix",
      description: "Automated escalation if deadlines are missed, ensuring accountability at all government levels.",
      status: "Implemented"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Citizen–Authority Feedback Loop",
      description: "Rating system after resolution improves trust and service quality through continuous feedback.",
      status: "Implemented"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Cloud-Native Scalability",
      description: "AWS-driven serverless architecture ensures cost-effective scaling as usage grows exponentially.",
      status: "Implemented"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 100 ? 'bg-gradient-to-r from-blue-900 to-purple-900 shadow-lg' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-white font-bold text-xl">Lok Samadhan</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-blue-300 transition-colors">Home</a>
              <a href="#overview" className="text-white hover:text-blue-300 transition-colors">Overview</a>
              <a href="#features" className="text-white hover:text-blue-300 transition-colors">Features</a>
              <a href="#how-it-works" className="text-white hover:text-blue-300 transition-colors">How It Works</a>
              <a href="#innovation" className="text-white hover:text-blue-300 transition-colors">Innovation</a>
              <a href="#stats" className="text-white hover:text-blue-300 transition-colors">Impact</a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download App
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 bg-white/10 backdrop-blur-md rounded-lg">
              <div className="flex flex-col space-y-2 px-4">
                <a href="#home" className="text-white hover:text-blue-300 py-2" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#overview" className="text-white hover:text-blue-300 py-2" onClick={() => setIsMenuOpen(false)}>Overview</a>
                <a href="#features" className="text-white hover:text-blue-300 py-2" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-white hover:text-blue-300 py-2" onClick={() => setIsMenuOpen(false)}>How It Works</a>
                <a href="#innovation" className="text-white hover:text-blue-300 py-2" onClick={() => setIsMenuOpen(false)}>Innovation</a>
                <a href="#stats" className="text-white hover:text-blue-300 py-2" onClick={() => setIsMenuOpen(false)}>Impact</a>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full mt-2 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download App
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Voice, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Our Action</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Report civic issues instantly and track their resolution in real-time. 
              Join thousands of citizens making their communities better with Lok Samadhan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Report an Issue
              </button> */}
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300 flex items-center gap-2">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview Section */}
      <section id="overview" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Platform <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Overview</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lok Samadhan is a digital platform that enables citizens to register complaints about civic infrastructure
              and services, while providing government authorities with tools for efficient management and resolution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformOverview.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">How It Addresses the Problem</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    Current Gap
                  </h4>
                  <p className="text-gray-600">
                    Manual complaint redressal systems are slow, lack transparency, and discourage citizen participation.
                    This leads to unresolved issues and frustrated communities.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Solution Fit
                  </h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Single-window digital platform simplifies complaint reporting</li>
                    <li>• Transparency through real-time status tracking</li>
                    <li>• Efficiency boost by automating workflows</li>
                    <li>• Empowers both citizens and authorities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure seamless reporting, tracking, and resolution of civic issues
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent, and efficient process from reporting to resolution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  <div className="absolute top-10 left-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section id="innovation" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Innovation & <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Uniqueness</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Going beyond traditional complaint systems with cutting-edge technology and thoughtful design
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {innovations.map((item, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Implemented" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Making a Real <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Thousands of citizens and government authorities trust our platform for transparent civic engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stats.complaints.toLocaleString()}
              </div>
              <div className="text-xl text-blue-200">Complaints Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stats.citizens.toLocaleString()}+
              </div>
              <div className="text-xl text-blue-200">Active Citizens</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                {stats.responseTime}
              </div>
              <div className="text-xl text-blue-200">Avg Response Time (Hours)</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                {stats.satisfaction}%
                <Star className="w-8 h-8 text-yellow-400 fill-current" />
              </div>
              <div className="text-xl text-blue-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Make a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Difference?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are actively participating in making their communities better. 
            Download the app today and start reporting issues in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Mobile App
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all duration-300 flex items-center justify-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Access Web Portal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-white font-bold text-lg">Lok Samadhan</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering citizens and government authorities to work together for better civic infrastructure and services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#overview" className="text-gray-400 hover:text-white block transition-colors">Platform Overview</a>
                <a href="#features" className="text-gray-400 hover:text-white block transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-400 hover:text-white block transition-colors">How It Works</a>
                <a href="#innovation" className="text-gray-400 hover:text-white block transition-colors">Innovation</a>
                <a href="#stats" className="text-gray-400 hover:text-white block transition-colors">Impact</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Government</h3>
              <div className="space-y-2">
                <a href="#dashboard" className="text-gray-400 hover:text-white block transition-colors">Admin Dashboard</a>
                <a href="#integration" className="text-gray-400 hover:text-white block transition-colors">API Integration</a>
                <a href="#analytics" className="text-gray-400 hover:text-white block transition-colors">Analytics</a>
                <a href="#training" className="text-gray-400 hover:text-white block transition-colors">Training Resources</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center"><span className="mr-2">📞</span> 1800-SAMADHAN</p>
                <p className="flex items-center"><span className="mr-2">✉️</span> support@loksamadhan.gov.in</p>
                <p className="flex items-center"><span className="mr-2">🏛️</span> Ministry of Electronics & IT</p>
                <p className="flex items-center"><span className="mr-2">📍</span> New Delhi, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Lok Samadhan Portal. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default LokSamadhanLanding;