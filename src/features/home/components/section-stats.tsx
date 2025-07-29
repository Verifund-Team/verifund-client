import { motion, Variants } from 'framer-motion'
import CountUp from 'react-countup'
import { FaHandHoldingHeart, FaBullhorn, FaUsers } from 'react-icons/fa'
import { FiTrendingUp } from 'react-icons/fi'
import type { ElementType } from 'react'

const MOCK_STATS = {
  totalRaised: { value: 2.4, suffix: 'B', decimals: 1 },
  totalCampaigns: { value: 1247, separator: '.' },
  totalDonors: { value: 45678, separator: '.' },
  successRate: { value: 94, suffix: '%' },
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 300 },
  },
}

interface Stat {
  value: number
  suffix?: string
  separator?: string
  decimals?: number
}

interface StatCardProps {
  icon: ElementType
  stat: Stat
  label: string
}

const StatCard = ({ icon: IconComponent, stat, label }: StatCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className="
        relative flex flex-col items-center justify-center p-8 
        rounded-2xl border border-white/10 
        bg-black/40 backdrop-blur-lg
        transition-colors duration-300 hover:bg-black/20
      "
    >
      <div className="text-5xl md:text-6xl font-extrabold mb-4 text-cyan-400">
        <CountUp
          end={stat.value}
          duration={4}
          decimals={stat.decimals}
          suffix={stat.suffix}
          separator={stat.separator}
          enableScrollSpy
          scrollSpyOnce
        />
      </div>

      <IconComponent className="text-2xl mb-2 text-gray-400" />
      <div className="text-sm uppercase tracking-wider text-gray-400 font-medium">{label}</div>
    </motion.div>
  )
}

const SectionWeb3 = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0A0F2C] text-white overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-lighten filter blur-[150px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-800 rounded-full mix-blend-lighten filter blur-[150px] opacity-10 animate-pulse animation-delay-4000"></div>

      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <StatCard
            icon={FaHandHoldingHeart}
            stat={MOCK_STATS.totalRaised}
            label="Total Funds Collected"
          />
          <StatCard icon={FaBullhorn} stat={MOCK_STATS.totalCampaigns} label="Created Campaigns" />
          <StatCard icon={FaUsers} stat={MOCK_STATS.totalDonors} label="Total Donors" />
          <StatCard icon={FiTrendingUp} stat={MOCK_STATS.successRate} label="Success Rate" />
        </motion.div>
      </div>
    </section>
  )
}

export default SectionWeb3
