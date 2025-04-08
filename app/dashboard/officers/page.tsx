import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OfficerList } from "@/components/officer-list"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Officers - Task Management System",
  description: "Police Department Task Management System Officers",
}

export default function OfficersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Цагдаагийн бүртгэл</h2>
          <p className="text-muted-foreground">Цагдаагийн газрын ажилтнуудын бүртгэл</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/officers/new">
            <Plus className="mr-2 h-4 w-4" />
            Шинэ ажилтан
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Бүх ажилтан</CardTitle>
          <CardDescription>Цагдаагийн газрын бүх ажилтнуудын жагсаалт</CardDescription>
        </CardHeader>
        <CardContent>
          <OfficerList />
        </CardContent>
      </Card>
    </div>
  )
}

