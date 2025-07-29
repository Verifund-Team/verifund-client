// Pastikan Link diimpor dari next/link
import Link from "next/link";
import CampaignCard from "@/features/campaign/components/campaign-list/campaign-card";
import { ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useGetCampaigns } from "@/features/campaign/api/get-campaigns";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const SectionFeaturedCampaigns = () => {
  const { data } = useGetCampaigns();

  return (
    <section id="campaigns" className="relative bg-[#0A0F2C] py-20 sm:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-radial-gradient from-cyan-500/10 to-transparent blur-3xl"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-radial-gradient from-purple-500/10 to-transparent blur-3xl"></div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-cyan-400/50"></div>
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-cyan-400/50"></div>
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-cyan-400/50"></div>
        </motion.div>
      </div>
      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <div className="text-cyan-400 font-semibold mb-3 tracking-wider">OUR CAMPAIGNS</div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Featured Campaign</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Support verified and transparent campaigns to bring about change.{" "}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {data?.slice(0, 4).map((campaign) => (
            <motion.div
              variants={itemVariants}
              key={campaign.address}
              className="group relative h-full"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-lg opacity-0 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative h-full">
                <CampaignCard key={campaign.address} campaign={campaign} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <Link href="/campaigns">
            <motion.div
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg border-2 border-cyan-400 text-cyan-400 font-semibold transition-all duration-300 hover:bg-cyan-400 hover:text-gray-900 hover:shadow-lg hover:shadow-cyan-400/20 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              View all campaigns
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionFeaturedCampaigns;
