import { Shield } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-background border-t text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 Verifund. Dibangun dengan ❤️ untuk Indonesia.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
