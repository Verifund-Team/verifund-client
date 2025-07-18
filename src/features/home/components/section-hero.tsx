import { Button } from '@/components/ui/button'
import { Eye, Shield, TrendingUp, Zap } from 'lucide-react'

const SectionHero = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Crowdfunding{' '}
            <span className="bg-primary bg-clip-text text-transparent">Transparan</span> untuk
            Indonesia
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Platform donasi terdesentralisasi pertama yang menggunakan teknologi blockchain untuk
            memastikan 100% transparansi. Setiap rupiah dapat dilacak, tanpa biaya platform, powered
            by IDRX.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary text-lg px-8 py-3">
              Mulai Berdonasi
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-transparent">
              Buat Kampanye
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">100% Transparan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">0% Biaya Platform</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Terverifikasi SBT</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Lisk L2 Cepat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionHero
