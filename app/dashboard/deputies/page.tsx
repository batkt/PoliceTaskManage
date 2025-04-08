import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DeputyList } from "@/components/deputy-list"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Deputies - Task Management System",
  description: "Police Department Task Management System Deputies",
}

export default function DeputiesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Дэд удирдлага</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Шинэ дэд удирдлага
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Дэд удирдлагууд</CardTitle>
          <CardDescription>Таны удирдлага дор ажиллаж буй дэд удирдлагууд</CardDescription>
        </CardHeader>
        <CardContent>
          <DeputyList />
        </CardContent>
      </Card>
    </div>
  )
}

