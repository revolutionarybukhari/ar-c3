import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#060a12] text-foreground flex flex-col">
      {children}
    </div>
  );
}
