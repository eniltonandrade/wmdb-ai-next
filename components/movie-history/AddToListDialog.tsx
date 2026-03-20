"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Star, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAddMovieToHistory } from "@/hooks/useAddMovieToHistory"

interface AddToListDialogProps {
  isOpen: boolean
  onClose: () => void
  movieId: string
  movieTitle: string
}

export function AddToListDialog({
  isOpen,
  onClose,
  movieId,
  movieTitle,
}: AddToListDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"))
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const { mutate, isPending } = useAddMovieToHistory()

  const handleSubmit = () => {
    if (!date) return

    // Combine date and time
    const [hours, minutes] = time.split(":").map(Number)
    const watchedDateTime = new Date(date)
    watchedDateTime.setHours(hours, minutes, 0, 0)

    mutate(
      {
        movieId,
        watchedDate: watchedDateTime,
        rating,
      },
      {
        onSuccess: () => {
          onClose()
          // Reset form
          setDate(new Date())
          setTime(format(new Date(), "HH:mm"))
          setRating(null)
        },
      }
    )
  }

  const handleSetNow = () => {
    const now = new Date()
    setDate(now)
    setTime(format(now, "HH:mm"))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Adicionar à lista</DialogTitle>
          <DialogDescription>
            Adicione &quot;{movieTitle}&quot; ao seu histórico de filmes
            assistidos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date and Time Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quando assistiu</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <div className="relative w-32">
                <Clock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleSetNow}
                className="shrink-0"
              >
                Agora
              </Button>
            </div>
          </div>

          {/* Rating Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Avaliação (opcional)</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="group relative p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      (
                        hoveredRating !== null
                          ? value <= hoveredRating
                          : rating !== null && value <= rating
                      )
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {value}
                  </span>
                </button>
              ))}
              {rating !== null && (
                <button
                  type="button"
                  onClick={() => setRating(null)}
                  className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              )}
            </div>
            {rating !== null && (
              <p className="text-sm text-muted-foreground">
                Avaliação: {rating}/10
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!date || isPending}>
            {isPending ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Made with Bob
