import { ClientAppLayout } from "@/components/client/client-app-layout"

export default function EspaceRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientAppLayout loginNext="/espace">{children}</ClientAppLayout>
}
