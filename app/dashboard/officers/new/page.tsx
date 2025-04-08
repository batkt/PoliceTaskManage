import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OfficerRegistrationForm } from "@/components/officer-registration-form"

export const metadata: Metadata = {
  title: "New Officer - Task Management System",
  description: "Police Department Task Management System New Officer Registration",
}

export default function NewOfficerPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Шинэ ажилтан бүртгэх</h2>
        <p className="text-muted-foreground">Цагдаагийн газрын шинэ ажилтны бүртгэл</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ажилтны мэдээлэл</CardTitle>
          <CardDescription>Шинэ ажилтны мэдээллийг бөглөж, бүртгэнэ үү.</CardDescription>
        </CardHeader>
        <CardContent>
          <OfficerRegistrationForm />
        </CardContent>
      </Card>
    </div>
  )
}

