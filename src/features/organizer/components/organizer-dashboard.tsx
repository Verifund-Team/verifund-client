"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import StatCards from "./stat-cards";
import CampaignsTab from "./campaigns-tab";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProfileCard from "./Profile/profile-card";

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState("campaigns");

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
                variant={activeTab === "campaigns" ? "ghost-active" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("campaigns")}
              >
                Kampanye Saya
              </Button>
              <Button
                variant={"ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("donations")}
                disabled
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
            {/* <TabsContent value="donations" className="space-y-6">
              <RecentDonationsTab />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
