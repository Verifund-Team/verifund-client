'use client'
import { Button } from '@/components/ui/button'
import { motion, Variants } from 'framer-motion'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@xellar/kit'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, Zap, ShieldCheck, Users, FileCheck, Rocket, Coins, TrendingUp } from 'lucide-react'
import BlockchainNetwork from '@/features/home/components/blockchain-network'
import GridPattern from '@/features/home/components/grid-pattern'
import { FloatingTransactionCard, BlockHashIndicator, FloatingIcon, Sparkle } from '@/features/home/components/floating-elements'
import React from 'react' 

const SectionHero = () => {
  const { isConnected } = useAccount();
  const { open } = useConnectModal();
  const router = useRouter();

  const handleActionClick = () => {
    if (isConnected) {
      router.push('/campaigns');
    } else {
      open();
    }
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatVariant1: Variants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
  };
  const floatVariant2: Variants = {
    animate: {
      y: [0, 8, 0],
      x: [0, -8, 0],
      rotate: [0, -3, 3, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    },
  };
  const floatVariant3: Variants = {
    animate: {
      y: [0, -8, 0],
      x: [0, 8, 0],
      rotate: [0, 8, -8, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
    },
  };
  const mockTransactions = [
    { amount: "1M IDRX", donor: "Faisal", position: "top-[20%] right-[10%]", delay: 0, icon: <Coins className="w-3 h-3 text-green-400" /> },
    { amount: "25K IDRX", donor: "Bagas", position: "top-[60%] left-[5%]", delay: 3, icon: <TrendingUp className="w-3 h-3 text-blue-400" /> },
    { amount: "100K IDRX", donor: "Opal", position: "bottom-[30%] right-[20%]", delay: 6, icon: <Coins className="w-3 h-3 text-purple-400" /> },
    { amount: "75K IDRX", donor: "Arep", position: "top-[40%] left-[85%]", delay: 9, icon: <TrendingUp className="w-3 h-3 text-yellow-400" /> },
  ];

  const blockHashes = [
    { position: "top-[15%] left-[25%]", delay: 2 },
    { position: "bottom-[25%] left-[15%]", delay: 5 },
    { position: "top-[50%] right-[25%]", delay: 8 },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#0A0F2C] text-white overflow-hidden flex flex-col justify-center -mt-20 pt-24 px-8 sm:px-16 lg:px-50">
      <GridPattern />
      <BlockchainNetwork />
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent" />

      <motion.div
        className="container mx-auto z-10 w-full relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-9 items-center">
          <div className="flex flex-col text-center md:text-left">
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-full px-4 py-2 mb-6 text-sm font-medium">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Powered by Web3 & Blockchain
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  Transparent Crowdfunding
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  for Indonesia
                </span>
              </h1>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
              Platform donasi terdesentralisasi pertama yang menggunakan teknologi blockchain untuk memastikan
              <span className="text-cyan-300 font-semibold"> 100% transparansi</span>.
              Setiap rupiah dapat dilacak, tanpa biaya platform, powered by IDRX.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8">
              <Button
                onClick={handleActionClick}
                size="lg"
                className="hover:cursor-pointer relative bg-gradient-to-r from-teal-500/20 via-cyan-400/25 to-blue-500/20 text-white font-semibold rounded-2xl px-12 py-4 text-lg border border-gradient-to-r border-teal-400/60 shadow-2xl shadow-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-400/60 hover:from-teal-400/30 hover:via-cyan-300/35 hover:to-blue-400/30 hover:scale-105 transition-all duration-500 backdrop-blur-lg group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 via-cyan-300/15 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 rounded-2xl" />
                <div className="absolute inset-0 rounded-2xl border border-cyan-400/50 group-hover:border-cyan-300/80 transition-colors duration-300" />

                <span className="relative z-10 drop-shadow-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Mulai Berdonasi
                </span>
              </Button>
            </motion.div>
          </div>
          <div className="relative h-[450px] md:h-[500px] flex items-center justify-center mt-12 md:mt-0">
            {mockTransactions.map((transaction, index) => (
              <FloatingTransactionCard
                key={index}
                amount={transaction.amount}
                donor={transaction.donor}
                positionClasses={transaction.position}
                delay={transaction.delay}
                icon={transaction.icon}
              />
            ))}
            {blockHashes.map((block, index) => (
              <BlockHashIndicator
                key={index}
                positionClasses={block.position}
                delay={block.delay}
              />
            ))}
            <Sparkle positionClasses="top-[5%] left-[50%]" duration={5.5} />
            <Sparkle positionClasses="top-[8%] left-[15%]" duration={4.1} />
            <Sparkle positionClasses="top-[10%] left-[88%]" duration={6.2} />
            <Sparkle positionClasses="top-[15%] left-[5%]" duration={3.8} />
            <Sparkle positionClasses="top-[18%] left-[70%]" duration={5.3} />
            <Sparkle positionClasses="top-[22%] left-[30%]" duration={4.5} />
            <Sparkle positionClasses="top-[25%] left-[95%]" duration={5.8} />
            <Sparkle positionClasses="top-[30%] left-[12%]" duration={3.5} />
            <Sparkle positionClasses="top-[35%] left-[60%]" duration={6.5} />
            <Sparkle positionClasses="top-[40%] left-[90%]" duration={4.0} />
            <Sparkle positionClasses="top-[45%] left-[25%]" duration={5.1} />
            <Sparkle positionClasses="top-[50%] left-[5%]" duration={3.9} />
            <Sparkle positionClasses="top-[55%] left-[80%]" duration={6.0} />
            <Sparkle positionClasses="top-[60%] left-[45%]" duration={4.7} />
            <Sparkle positionClasses="top-[65%] left-[98%]" duration={3.6} />
            <Sparkle positionClasses="top-[70%] left-[8%]" duration={5.4} />
            <Sparkle positionClasses="top-[75%] left-[65%]" duration={4.3} />
            <Sparkle positionClasses="top-[80%] left-[35%]" duration={6.3} />
            <Sparkle positionClasses="top-[85%] left-[92%]" duration={3.3} />
            <Sparkle positionClasses="top-[90%] left-[18%]" duration={5.7} />
            <Sparkle positionClasses="top-[95%] left-[75%]" duration={4.9} />
            <Sparkle positionClasses="top-[98%] left-[40%]" duration={6.1} />
            <motion.div
              className="w-[400px] h-[400px] lg:w-[450px] lg:h-[450px] relative"
              animate={{ y: [0, 15, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-gradient-radial from-cyan-400/30 via-cyan-400/10 to-transparent rounded-full blur-3xl" />
              <div className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-blue-400/5 to-transparent rounded-full blur-2xl" />

              <Image
                src="/earth.png"
                alt="Glowing Earth"
                width={450}
                height={450}
                className="object-contain filter drop-shadow-[0_0_2rem_#00F2DE] relative z-10"
              />
            </motion.div>
            <FloatingIcon
              imgSrc="/lisk.png"
              altText="Lisk Logo"
              positionClasses="top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 group"
              animationVariant={floatVariant1}
            />
            <FloatingIcon
              imgSrc="/metamask.png"
              altText="Metamask Logo"
              positionClasses="top-[70%] left-[30%] -translate-x-1/2 -translate-y-1/2 group"
              animationVariant={floatVariant2}
            />
            <FloatingIcon
              imgSrc="/react.png"
              altText="React Logo"
              positionClasses="top-[35%] right-[15%] translate-x-1/2 -translate-y-1/2 group"
              animationVariant={floatVariant3}
            />
            <FloatingIcon
              imgSrc="/xellar.png"
              altText="Xellar Logo"
              positionClasses="bottom-[15%] right-[20%] translate-x-1/2 translate-y-1/2 group"
              animationVariant={floatVariant2}
            />
          </div>
        </div>
        <motion.div variants={itemVariants} className="mt-8 lg:mt-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
            {[
              {
                icon: <Eye className="w-7 h-7 text-blue-400" />,
                title: "100%",
                subtitle: "Transparan",
                bgGradient: "from-white/5 to-white/5",
                borderColor: "border-white/20",
                glowColor: "shadow-transparent"
              },
              {
                icon: <Zap className="w-7 h-7 text-green-400" />,
                title: "0%",
                subtitle: "Biaya Platform",
                bgGradient: "from-white/5 to-white/5",
                borderColor: "border-white/20",
                glowColor: "shadow-transparent"
              },
              {
                icon: <ShieldCheck className="w-7 h-7 text-purple-400" />,
                title: "Terverifikasi",
                subtitle: "SBT",
                bgGradient: "from-white/5 to-white/5",
                borderColor: "border-white/20",
                glowColor: "shadow-transparent"
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className={`bg-gradient-to-br ${item.bgGradient} border ${item.borderColor} rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:scale-105 backdrop-blur-md hover:bg-white/10 ${item.glowColor} hover:shadow-xl group cursor-pointer`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`flex-shrink-0 p-2 bg-gradient-to-br ${item.bgGradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg group-hover:text-cyan-100 transition-colors duration-300">{item.title}</span>
                  <span className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">{item.subtitle}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-gray-400 text-sm max-w-4xl mx-auto">
            <motion.div
              className="flex items-center gap-2 hover:text-cyan-300 transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Users className="w-4 h-4" />
              <span>12.400 Donatur</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 hover:text-green-300 transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <FileCheck className="w-4 h-4" />
              <span>100% Audit Publik</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 hover:text-purple-300 transition-colors duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Rocket className="w-4 h-4" />
              <span>Didukung IDRX, Lisk, Xellar</span>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}

export default SectionHero;
