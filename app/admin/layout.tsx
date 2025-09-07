import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Admin Panel | Dopetech Nepal',
  description: 'Admin panel for managing Dopetech Nepal products, orders, and website content.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
