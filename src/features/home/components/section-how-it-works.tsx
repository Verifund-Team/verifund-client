import { Eye, Plus, Wallet } from 'lucide-react'

const SectionHowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proses yang sederhana namun aman dengan teknologi blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">1. Buat Kampanye</h3>
            <p className="text-gray-600">
              Campaigner membuat kampanye dengan detail lengkap. Data disimpan di IPFS untuk
              transparansi maksimal.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">2. Donasi IDRX</h3>
            <p className="text-gray-600">
              Donatur menggunakan IDRX untuk berdonasi. Dana langsung masuk ke smart contract yang
              aman.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">3. Transparansi Penuh</h3>
            <p className="text-gray-600">
              Semua transaksi tercatat di blockchain. Donatur dapat melacak kemana dana mereka
              disalurkan.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionHowItWorks
