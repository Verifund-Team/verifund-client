import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const SectionCallToAction = () => {
  return (
    <section className="relative bg-[#0A0F2C] py-24 sm:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"></div>
        <div className="absolute bottom-1/3 left-0 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-4xl max-h-4xl bg-radial-gradient from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto">
        <motion.div 
          className="bg-gray-800/20 backdrop-blur-lg border border-white/10 rounded-2xl max-w-4xl mx-auto p-10 sm:p-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
            Siap Memulai Perubahan?
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan orang yang telah mempercayai Verifund untuk menyalurkan kebaikan mereka dengan transparan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/campaigns">
              <motion.div
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-400 text-gray-900 font-bold rounded-lg text-lg transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/30 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                Mulai Berdonasi
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SectionCallToAction;