"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Upload, Download, Settings, Play, Pencil, ChevronDown, Menu } from "lucide-react"
import type { Lesson } from "@/types/lesson"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface LessonControlsProps {
  lesson: Lesson
  updateLessonMetadata: (metadata: Partial<Omit<Lesson, "slides">>) => void
  exportLesson: () => void
  importLesson: (lesson: Lesson) => void
  previewMode: boolean
  setPreviewMode: (mode: boolean) => void
  isMobile: boolean
}

export function LessonControls({
  lesson,
  updateLessonMetadata,
  exportLesson,
  importLesson,
  previewMode,
  setPreviewMode,
  isMobile,
}: LessonControlsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string
        const importedLesson = JSON.parse(result)

        // Validate basic lesson structure
        if (!importedLesson.id || !Array.isArray(importedLesson.slides)) {
          throw new Error("Invalid lesson format")
        }

        // Completely replace the current lesson with the imported one
        importLesson(importedLesson)

        // Clear any local storage to prevent conflicts
        if (typeof window !== "undefined") {
          localStorage.removeItem("currentLesson")
        }

        toast({
          title: "Lesson imported successfully",
          description: `Loaded lesson: ${importedLesson.title}`,
        })

        // Close mobile menu if open
        if (isMobile) {
          setIsMobileMenuOpen(false)
        }
      } catch (error) {
        console.error("Import error:", error)
        toast({
          title: "Import failed",
          description: "The selected file is not a valid lesson file",
          variant: "destructive",
        })
      }
    }

    reader.onerror = () => {
      toast({
        title: "Import failed",
        description: "Error reading the file",
        variant: "destructive",
      })
    }

    reader.readAsText(file)

    // Reset the input
    e.target.value = ""
  }

  // Mobile UI
  if (isMobile) {
    return (
      <header className="border-b bg-background p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>{lesson.title || "Untitled Lesson"}</SheetTitle>
                <SheetDescription>Lesson Builder Menu</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Lesson Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={exportLesson}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleImportClick}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Lesson
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="font-bold text-lg truncate max-w-[180px]">{lesson.title || "Untitled Lesson"}</h1>
        </div>

        <Button variant={previewMode ? "default" : "outline"} size="sm" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Preview
            </>
          )}
        </Button>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Lesson Settings</DialogTitle>
              <DialogDescription>Configure the metadata for your lesson</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={lesson.title}
                  onChange={(e) => updateLessonMetadata({ title: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={lesson.description}
                  onChange={(e) => updateLessonMetadata({ description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={lesson.author}
                    onChange={(e) => updateLessonMetadata({ author: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value={lesson.level}
                    onChange={(e) => updateLessonMetadata({ level: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={lesson.duration}
                  onChange={(e) => updateLessonMetadata({ duration: Number(e.target.value) })}
                  min={1}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
    )
  }

  // Desktop UI
  return (
    <header className="border-b bg-background p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-lg">{lesson.title || "Untitled Lesson"}</h1>

        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)} title="Lesson Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant={previewMode ? "default" : "outline"} size="sm" onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? (
            <>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Preview
            </>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportLesson}>
              <Download className="h-4 w-4 mr-2" />
              Export Lesson
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Import Lesson
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lesson Settings</DialogTitle>
            <DialogDescription>Configure the metadata for your lesson</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={lesson.title}
                onChange={(e) => updateLessonMetadata({ title: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={lesson.description}
                onChange={(e) => updateLessonMetadata({ description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={lesson.author}
                  onChange={(e) => updateLessonMetadata({ author: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  value={lesson.level}
                  onChange={(e) => updateLessonMetadata({ level: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={lesson.duration}
                onChange={(e) => updateLessonMetadata({ duration: Number(e.target.value) })}
                min={1}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
