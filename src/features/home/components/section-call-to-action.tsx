import { Button } from '@/components/ui/button'

const SectionCallToAction = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Siap Memulai Perubahan?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan orang yang telah mempercayai Verifund untuk menyalurkan
          kebaikan mereka dengan transparan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Mulai Berdonasi
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-3 text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
          >
            Buat Kampanye
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SectionCallToAction
