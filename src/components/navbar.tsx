"use client";

import { useState, useEffect } from "react";
import { Plus, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ConnectButton } from "@xellar/kit";
import { useAccount } from "wagmi";
import clsx from "clsx";
import { ClientOnly } from "./ClientOnly";
import Image from "next/image";

const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const Navbar = () => {
  const { isConnected } = useAccount();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full p-4">
      <nav
        className={clsx(
          "mx-auto max-w-7xl rounded-xl p-3",
          "relative flex items-center justify-between",
          "transition-all duration-300",
          {
            "bg-card/95 backdrop-blur-md border shadow-lg": isScrolled,
            "bg-transparent border-transparent": !isScrolled,
          },
        )}
      >
        <div className="relative flex w-full items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logoverifund.png"
              alt="Verifund Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-foreground">Verifund</span>
          </Link>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={clsx(
                "hover:text-foreground transition-colors",
                pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground",
              )}
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className={clsx(
                "hover:text-foreground transition-colors",
                pathname.startsWith("/campaigns")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground",
              )}
            >
              Campaigns
            </Link>
            <Link
              href="/dashboard"
              className={clsx(
                "hover:text-foreground transition-colors",
                pathname.startsWith("/dashboard")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground",
              )}
            >
              Profile
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <ClientOnly>
            <div className="hidden md:flex items-center space-x-3">
              <ConnectButton.Custom>
                {({ account, chain, openProfileModal, openConnectModal }) => {
                  const connected = account && chain;
                  if (!connected) {
                    return (
                      <Button
                        onClick={openConnectModal}
                        className="hover:cursor-pointer bg-primary"
                      >
                        Connect Wallet
                      </Button>
                    );
                  }
                  return (
                    <Button onClick={openProfileModal} variant="secondary" size="sm">
                      {truncateAddress(account.address)}
                    </Button>
                  );
                }}
              </ConnectButton.Custom>

              {isConnected && (
                <Button asChild>
                  <Link href="/create-campaign">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              )}
            </div>
          </ClientOnly>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={clsx(
          "mx-auto max-w-7xl rounded-xl p-4 mt-2",
          "md:hidden",
          {
            "bg-card/95 backdrop-blur-md border shadow-lg": isScrolled,
            "bg-card border": !isScrolled,
          }
        )}>
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className={clsx(
                "hover:text-foreground transition-colors p-2 rounded",
                pathname === "/" ? "text-foreground font-semibold bg-muted" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/campaigns" 
              className={clsx(
                "hover:text-foreground transition-colors p-2 rounded",
                pathname.startsWith("/campaigns") ? "text-foreground font-semibold bg-muted" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link 
              href="/dashboard" 
              className={clsx(
                "hover:text-foreground transition-colors p-2 rounded",
                pathname.startsWith("/dashboard") ? "text-foreground font-semibold bg-muted" : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
            
            {/* Mobile Connect Wallet */}
            <ClientOnly>
              <div className="pt-3 border-t">
                <ConnectButton.Custom>
                  {({ account, chain, openProfileModal, openConnectModal }) => {
                    const connected = account && chain;
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          className="w-full hover:cursor-pointer bg-primary"
                        >
                          Connect Wallet
                        </Button>
                      );
                    }
                    return (
                      <Button onClick={openProfileModal} variant="secondary" className="w-full">
                        {truncateAddress(account.address)}
                      </Button>
                    );
                  }}
                </ConnectButton.Custom>
                
                {isConnected && (
                  <Button asChild className="w-full mt-2">
                    <Link href="/create-campaign" onClick={() => setIsMobileMenuOpen(false)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Campaign
                    </Link>
                  </Button>
                )}
              </div>
            </ClientOnly>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
