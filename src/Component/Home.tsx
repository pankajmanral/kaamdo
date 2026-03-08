import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">

      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[25rem] h-[25rem] bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 backdrop-blur-sm">
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">The Modern Local Service Marketplace</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Find trusted vendors for <br />
            <span className="text-gradient">every job, fast.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-800 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
            Post your job in minutes, receive bids from service providers, and choose the right person with confidence.
          </motion.p>

          <motion.p variants={itemVariants} className="text-md text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From repairs and home services to everyday work needs, KaamDo helps you connect with the right professionals without the usual hassle.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Post a Job
            </Link>
            <Link
              to="/vendor-register"
              className="glass text-blue-700 px-8 py-3.5 rounded-full font-semibold hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Why KaamDo Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 bg-white/50 backdrop-blur-sm border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Why people choose KaamDo</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              KaamDo makes it easy to get work done. Instead of spending hours calling people and comparing prices, simply post your requirement and let service providers come to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="📝"
              title="Post a job easily"
              desc="Tell us what you need, when you need it, and where."
              delay={0}
            />
            <FeatureCard
              icon="🤝"
              title="Get bids from vendors"
              desc="Receive offers from interested service providers."
              delay={0.2}
            />
            <FeatureCard
              icon="⭐"
              title="Choose with confidence"
              desc="Compare options and select the one that fits your budget and need."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass p-12 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl -z-10 animate-pulse delay-1000"></div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 relative z-10">A smarter way to hire local services</h2>
            <div className="text-lg text-slate-700 font-medium space-y-4 leading-relaxed max-w-3xl mx-auto relative z-10">
              <p>
                No more guessing. No more endless searching. KaamDo gives you a simple way to discover available vendors, review offers, and move forward faster.
              </p>
              <p>
                Whether it’s a small task or an important job, KaamDo helps you get it done with less stress.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10 bg-slate-100/50 border-t border-slate-200/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How KaamDo works</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 z-0 opacity-50"></div>

            <StepCard number="1" title="Post your job" desc="Describe the work, location, and schedule." delay={0} />
            <StepCard number="2" title="Receive bids" desc="Vendors interested in your job send their offers." delay={0.15} />
            <StepCard number="3" title="Pick the right vendor" desc="Compare and choose the best match for your need." delay={0.3} />
            <StepCard number="4" title="Get the job done" desc="Track progress and move ahead with confidence." delay={0.45} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="absolute inset-0 bg-blue-600 transform -skew-y-2 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get your work done faster?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join KaamDo today and discover an easier way to find trusted service providers near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-700 px-8 py-3.5 rounded-full font-semibold shadow-xl hover:bg-slate-50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Try KaamDo Now
            </Link>
            <Link
              to="/login"
              className="border-2 border-white/80 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/10 hover:border-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: string, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: delay }}
      className="glass p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-500/30">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StepCard({ number, title, desc, delay }: { number: string, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay }}
      className="relative z-10 flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-500/40 border-4 border-white">
        {number}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}