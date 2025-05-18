"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Upload, Home, Award } from "lucide-react"
import { ComponentRenderer } from "@/components/component-renderer"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { Lesson } from "@/types/lesson"

export function LessonViewer() {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalPossible, setTotalPossible] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  // Calculate total possible score across all slides
  useEffect(() => {
    if (!lesson) return

    let total = 0

    lesson.slides.forEach((slide) => {
      slide.components.forEach((component) => {
        // Quiz points
        if (component.type === "quiz" && component.props.points) {
          const questionCount = component.props.questions?.length || 0
          total += component.props.points * questionCount
        }

        // Matching pairs points
        if (component.type === "matchingPairs" && component.props.points) {
          total += component.props.points
        }

        // Drag and drop points
        if (component.type === "dragDrop" && component.props.points) {
          total += component.props.points
        }

        // Fill in the blank points
        if (component.type === "fillInTheBlank" && component.props.points) {
          total += component.props.points
        }

        // Code editor points
        if (component.type === "codeEditor" && component.props.points) {
          total += component.props.points
        }
      })
    })

    setTotalPossible(total)
  }, [lesson])

  const addPoints = (points: number) => {
    setScore((prevScore) => prevScore + points)
  }

  const goToNextSlide = () => {
    if (lesson && currentSlideIndex < lesson.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
    setIsSidebarOpen(false)
    window.scrollTo(0, 0)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string
        const importedLesson = JSON.parse(result)

        // Validate basic lesson structure
        if (!importedLesson.id || !Array.isArray(importedLesson.slides)) {
          throw new Error("Invalid lesson format")
        }

        // Set the lesson
        setLesson(importedLesson)
        setCurrentSlideIndex(0)
        setScore(0)

        toast({
          title: "Lesson loaded successfully",
          description: `Loaded: ${importedLesson.title}`,
        })
      } catch (error) {
        console.error("Import error:", error)
        toast({
          title: "Import failed",
          description: "The selected file is not a valid lesson",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "Error reading the file",
        variant: "destructive",
      })
      setIsLoading(false)
    }

    reader.readAsText(file)

    // Reset the input
    e.target.value = ""
  }

  const resetLesson = () => {
    setLesson(null)
    setCurrentSlideIndex(0)
    setScore(0)
  }

  const scoreContext = {
    score,
    totalPossible,
    addPoints,
  }

  // If no lesson is loaded, show the import screen
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Afterschool Tech Lesson Viewer</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto flex items-center justify-center">
                  <Upload className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Load a Lesson</h2>
                  <p className="text-muted-foreground mb-6">
                    Import a lesson file to start learning interactive tech concepts
                  </p>
                </div>
                <Button onClick={handleImportClick} disabled={isLoading} size="lg" className="w-full">
                  {isLoading ? "Loading..." : "Choose Lesson File"}
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                <p className="text-sm text-muted-foreground">
                  Select a .json file created with the Afterschool Tech Lesson Builder
                </p>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
          <p>Afterschool Tech Lesson Viewer &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    )
  }

  const currentSlide = lesson.slides[currentSlideIndex]
  const progress = ((currentSlideIndex + 1) / lesson.slides.length) * 100

  // Mobile UI
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground p-3 shadow-md">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={resetLesson} className="text-primary-foreground">
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold truncate max-w-[200px]">{lesson.title}</h1>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <Award className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-bold">Lesson Progress</h2>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Your Score</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold">{score}</span>
                      <span className="text-muted-foreground">out of {totalPossible}</span>
                    </div>
                    <Progress value={(score / totalPossible) * 100} />
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">Slides</h3>
                    <div className="space-y-2">
                      {lesson.slides.map((slide, index) => (
                        <div
                          key={slide.id}
                          className={`p-2 rounded cursor-pointer ${
                            index === currentSlideIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => goToSlide(index)}
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 rounded-full bg-background text-foreground flex items-center justify-center text-xs mr-2">
                              {index + 1}
                            </span>
                            <span className="truncate">{slide.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Lesson Info</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Author:</span> {lesson.author}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Level:</span> {lesson.level}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Duration:</span> {lesson.duration} minutes
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <div className="bg-muted">
          <Progress value={progress} className="h-1 w-full" />
        </div>

        <main className="flex-1 p-4 overflow-auto">
          <div className="mb-4">
            <h2 className="text-xl font-bold">{currentSlide.title}</h2>
          </div>

          <div className="space-y-4">
            {currentSlide.components.map((component) => (
              <ComponentRenderer key={component.id} component={component} scoreContext={scoreContext} />
            ))}
          </div>
        </main>

        <footer className="p-3 border-t bg-background">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentSlideIndex + 1} / {lesson.slides.length}
            </div>

            <Button size="sm" onClick={goToNextSlide} disabled={currentSlideIndex === lesson.slides.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </footer>
      </div>
    )
  }

  // Desktop UI
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={resetLesson} className="text-primary-foreground">
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
              Score: {score} / {totalPossible}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-muted">
        <div className="container mx-auto">
          <Progress value={progress} className="h-1 w-full" />
        </div>
      </div>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-muted/30 hidden md:block overflow-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold">Lesson Progress</h2>
          </div>

          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Your Score</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold">{score}</span>
              <span className="text-muted-foreground">out of {totalPossible}</span>
            </div>
            <Progress value={(score / totalPossible) * 100} />
          </div>

          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Slides</h3>
            <div className="space-y-2">
              {lesson.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`p-2 rounded cursor-pointer ${
                    index === currentSlideIndex ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-background text-foreground flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="truncate">{slide.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t mt-auto">
            <h3 className="text-sm font-medium mb-2">Lesson Info</h3>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Author:</span> {lesson.author}
              </p>
              <p>
                <span className="text-muted-foreground">Level:</span> {lesson.level}
              </p>
              <p>
                <span className="text-muted-foreground">Duration:</span> {lesson.duration} minutes
              </p>
              <p className="text-xs text-muted-foreground mt-4">{lesson.description}</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{currentSlide.title}</h2>
            </div>

            <div className="space-y-4">
              {currentSlide.components.map((component) => (
                <ComponentRenderer key={component.id} component={component} scoreContext={scoreContext} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button variant="outline" onClick={goToPreviousSlide} disabled={currentSlideIndex === 0}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Slide
              </Button>

              <div className="text-sm text-muted-foreground">
                Slide {currentSlideIndex + 1} of {lesson.slides.length}
              </div>

              <Button onClick={goToNextSlide} disabled={currentSlideIndex === lesson.slides.length - 1}>
                Next Slide
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
