import { Settings, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PM</span>
            </div>
            <span className="font-semibold text-lg text-foreground">예측 유지보전</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <span className="text-sm text-foreground border-b-2 border-primary pb-1">대시보드</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">장비 목록</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">분석</span>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">리포트</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="장비 검색..."
              className="pl-9 w-64 bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
