import { Eye, Plus, ShieldCheck, Wallet } from "lucide-react";
import { motion, Variants } from "framer-motion";
import React from "react";

const steps = [
  {
    icon: Plus,
    title: "Create Campaign",
    description:
      "Campaigners create campaigns with detailed client information. Data is stored in IPFS for maximum transparency.",
  },
  {
    icon: ShieldCheck,
    title: "Get Verified (Optional)",
    description:
      "To build donor trust, creators can undergo a verification process. Once approved, they receive a non-transferable Soulbound Token (SBT) as a permanent, on-chain badge of credibility.",
  },
  {
    icon: Wallet,
    title: "Donate IDRX",
    description:
      "Donors can use IDRX to make donations, and the funds will go directly into a secure smart contract.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "All transactions are recorded on the blockchain, ensuring transparency.",
  },
];
const textVariant: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const iconVariant: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

const SectionHowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative bg-[#0A0F2C] py-24 sm:py-32 px-4 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 flex justify-center pointer-events-none">
        <svg
          width="1000"
          height="100%"
          viewBox="0 0 1000 1200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient
              id="path-gradient"
              gradientUnits="userSpaceOnUse"
              x1="500"
              y1="0"
              x2="500"
              y2="1200"
            >
              <stop stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="0.1" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="0.9" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M 500 0 V 150 C 500 250, 800 250, 800 350 S 500 450, 500 550 V 650 C 500 750, 200 750, 200 850 S 500 950, 500 1050 V 1200"
            fill="none"
            stroke="url(#path-gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
          />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">How does it work?</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            A simple yet secure process with blockchain technology
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-16">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                className="flex-shrink-0 w-48 h-48 flex items-center justify-center relative"
                variants={iconVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <div className="absolute inset-0 bg-radial-gradient from-cyan-500/15 to-transparent rounded-full blur-2xl"></div>
                <div className="w-32 h-32 rounded-full bg-gray-800/50 border border-cyan-400/20 flex items-center justify-center">
                  <step.icon className="w-12 h-12 text-cyan-400" />
                </div>
              </motion.div>

              <motion.div
                className="text-center md:text-left"
                variants={textVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <p className="text-cyan-400 font-bold mb-3 tracking-widest">STEP 0{index + 1}</p>
                <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400 max-w-md">{step.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionHowItWorks;
