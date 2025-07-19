'use client'

import { CheckCircle, Plus, Shield, Wallet } from 'lucide-react'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useState } from 'react'

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <nav className="bg-card backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <img
                src="/logoverifund.png"
                alt="Verifund Logo"
                width={32}
                height={32}
                className="rounded-lg object-contain"
              />
            </div>
            <span className="text-xl font-bold text-foreground">Verifund</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Beranda
            </Link>
            <Link href="/campaigns" className="text-muted-foreground hover:text-foreground">
              Kampanye
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {!isConnected ? (
              <Button onClick={() => setIsConnected(true)} className="bg-primary">
                <Wallet className="w-4 h-4 mr-2" />
                Hubungkan Dompet
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-primary border-primary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Terhubung
                </Badge>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Kampanye
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
