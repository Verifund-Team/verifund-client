'use client'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import ProfileCard from './profile-card'
import StatCards from './stat-cards'
import CampaignsTab from './campaigns-tab'
import RecentDonationsTab from './recent-donations-tab'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const MOCK_USER_DATA = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  publicName: 'Yayasan Peduli Anak',
  isNameSet: true,
  isVerified: true,
  isWhitelisted: false, // For SBT claim
  hasSBT: true,
  joinedDate: '2024-01-10',
  avatar: '/placeholder.svg?height=80&width=80',
}

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Organizer Dashboard</h1>
        <p className="text-xl text-muted-foreground">Kelola kampanye dan profil Anda</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div>
          <ProfileCard />
          <Card className="mt-8">
            <CardContent className="space-y-2">
              <Button
                variant={activeTab === 'campaigns' ? 'ghost-active' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('campaigns')}
              >
                Kampanye Saya
              </Button>
              <Button
                variant={activeTab === 'donations' ? 'ghost-active' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('donations')}
              >
                Donasi Terbaru
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <StatCards />
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            value={activeTab}
            className="w-full"
          >
            <TabsContent value="campaigns" className="space-y-6">
              <CampaignsTab />
            </TabsContent>
            <TabsContent value="donations" className="space-y-6">
              <RecentDonationsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
