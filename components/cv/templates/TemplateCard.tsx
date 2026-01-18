import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { TemplatePreview } from "./TemplatePreview"
import { Link } from "@/lib/navigation"
import { useTranslations } from "next-intl"

interface TemplateCardProps {
  id: string
  name: string
  description?: string
  selected?: boolean
  onSelect?: (id: string) => void
}

export function TemplateCard({ id, name, description, selected, onSelect }: TemplateCardProps) {
  const t = useTranslations("TemplateCard")

  return (
    <Card
      className={`group relative overflow-hidden transition-all hover:ring-2 hover:ring-primary ${
        selected ? "ring-2 ring-primary" : ""
      }`}
    >
      {selected && (
        <div className="absolute right-2 top-2 z-10 rounded-full bg-primary p-1 text-white shadow-sm">
          <Check className="h-4 w-4" />
        </div>
      )}
      <CardContent className="p-4">
        <TemplatePreview templateId={id} />
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4 pt-0">
        <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex w-full gap-2">
            <Button asChild className="w-full">
                <Link href={`/form/cv?template=${id}`}>{t("useTemplate")}</Link>
            </Button>
             {/* Future: Add Preview Modal Button */}
        </div>
      </CardFooter>
    </Card>
  )
}
