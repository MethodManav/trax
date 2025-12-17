import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Shirt, Plane, TrendingDown, Bell, Zap } from "lucide-react";

const categories = [
  { 
    icon: Smartphone, 
    label: "Mobiles", 
    description: "Track smartphone prices",
    color: "bg-mobile/10 text-mobile",
    delay: 0.2 
  },
  { 
    icon: Shirt, 
    label: "Clothing", 
    description: "Fashion deals & drops",
    color: "bg-clothing/10 text-clothing",
    delay: 0.4 
  },
  { 
    icon: Plane, 
    label: "Flights", 
    description: "Best airfare alerts",
    color: "bg-flights/10 text-flights",
    delay: 0.6 
  },
];

const features = [
  { icon: TrendingDown, label: "Price History", description: "Track price trends over time" },
  { icon: Bell, label: "Smart Alerts", description: "Get notified when prices drop" },
  { icon: Zap, label: "Instant Updates", description: "Real-time price monitoring" },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <span className="text-lg">📊</span>
            </div>
            <span className="font-semibold text-xl text-foreground">PriceTracker</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="glass" size="sm">
                Go to Dashboard
              </Button>
            </Link>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-mobile/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-clothing/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-flights/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Track Prices.
              <br />
              <span className="text-gradient">Buy at the Right Time.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Monitor prices across mobiles, clothing, and flights. Get instant alerts when prices drop to your target.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Start Tracking
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="glass" size="xl">
              Learn More
            </Button>
          </motion.div>
        </div>

        {/* Floating Category Cards */}
        <div className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: cat.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`float${i === 1 ? "-delayed" : i === 2 ? "-delayed-2" : ""}`}
            >
              <div className="glass rounded-3xl p-8 hover-lift cursor-pointer">
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-4`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{cat.label}</h3>
                <p className="text-muted-foreground">{cat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to save money
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features to help you track and save
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-3xl p-8 text-center hover-lift"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.label}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-4xl p-12 md:p-16 text-center max-w-4xl mx-auto shadow-lifted"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to start saving?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of smart shoppers tracking prices every day.
          </p>
          <Link to="/dashboard">
            <Button variant="hero" size="xl" className="group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2024 PriceTracker. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
