import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Dopetech Admin | Dopetech Nepal',
  description: 'Administrative panel for managing Dopetech Nepal products, orders, and website content.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DopetechAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
