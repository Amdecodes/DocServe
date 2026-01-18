import { ArrowRight } from "lucide-react"
import { Link } from "@/lib/navigation"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { useTranslations } from "next-intl"

interface ServiceCardProps {
  title: string
  description: string
  price: string
  href: string
  icon: React.ReactNode
  popular?: boolean
}

export function ServiceCard({
  title,
  description,
  price,
  href,
  icon,
  popular,
}: ServiceCardProps) {
  const t = useTranslations("ServiceCard")
  
  return (
    <Card className={`relative flex flex-col ${popular ? "border-primary shadow-lg ring-1 ring-primary" : ""}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="default">{t("mostPopular")}</Badge>
        </div>
      )}
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-2xl font-bold text-primary">{price}</div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size="lg" variant={popular ? "default" : "outline"}>
          <Link href={href}>
            {t("startNow")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
