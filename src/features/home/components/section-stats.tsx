const MOCK_STATS = {
  totalRaised: '2.4B',
  totalCampaigns: '1,247',
  totalDonors: '45,678',
  successRate: '94%',
}

const SectionMock = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {MOCK_STATS.totalRaised}
            </div>
            <div className="text-muted-foreground">Total Dana Terkumpul</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {MOCK_STATS.totalCampaigns}
            </div>
            <div className="text-muted-foreground">Kampanye Aktif</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {MOCK_STATS.totalDonors}
            </div>
            <div className="text-muted-foreground">Donatur</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {MOCK_STATS.successRate}
            </div>
            <div className="text-muted-foreground">Tingkat Keberhasilan</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionMock
