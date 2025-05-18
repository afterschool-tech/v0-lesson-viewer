"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface Flashcard {
  id: string
  front: string
  back: string
}

interface FlashcardsRendererProps {
  title?: string
  cards?: Flashcard[]
}

export function FlashcardsRenderer({ title = "Flashcards", cards = [] }: FlashcardsRendererProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = cards[currentCardIndex]

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
  }

  if (cards.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No flashcards available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative perspective-1000">
          <div
            className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={flipCard}
          >
            <div
              className={`absolute w-full h-full backface-hidden flex items-center justify-center p-6 border rounded-md ${
                isFlipped ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-medium">{currentCard.front}</div>
                <div className="mt-4 text-sm text-muted-foreground">Click to flip</div>
              </div>
            </div>
            <div
              className={`absolute w-full h-full backface-hidden flex items-center justify-center p-6 border rounded-md rotate-y-180 ${
                isFlipped ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="text-center">
                <div className="text-lg">{currentCard.back}</div>
                <div className="mt-4 text-sm text-muted-foreground">Click to flip back</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousCard} disabled={currentCardIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={flipCard}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextCard} disabled={currentCardIndex === cards.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
      </CardFooter>
    </Card>
  )
}
