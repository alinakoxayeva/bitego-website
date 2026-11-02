import { Button } from "@/components/ui/button"
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-3">
      <Toaster richColors position="top-right" />
      <Button>Test</Button>
      <Button variant="outline">Outline</Button>
    </div>
  )
}