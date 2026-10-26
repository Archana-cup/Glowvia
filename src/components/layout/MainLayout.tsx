import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { AnnouncementBar } from '../common/AnnouncementBar'
import { DevModeBanner } from '../common/DevModeBanner'
import { CartDrawer } from '../cart/CartDrawer'

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F7] text-[#29212A] selection:bg-[#FFF0F5] selection:text-[#267A50]">
      <DevModeBanner />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

