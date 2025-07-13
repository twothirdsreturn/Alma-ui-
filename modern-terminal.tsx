"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, GitBranch, Clock, Zap, Plus } from "lucide-react"

interface TerminalCommand {
  id: string
  type: "command" | "output" | "error"
  text: string
  timestamp: Date
  exitCode?: number
  duration?: number
}

interface Tab {
  id: string
  icon: string
  active: boolean
  title: string
}

export default function ModernTerminal() {
  const [isActive, setIsActive] = useState(true)
  const [commands, setCommands] = useState<TerminalCommand[]>([
    {
      id: "1",
      type: "command",
      text: "git status",
      timestamp: new Date(),
      exitCode: 0,
      duration: 120,
    },
    {
      id: "2",
      type: "output",
      text: "On branch main\nYour branch is up to date with 'origin/main'.\n\nnothing to commit, working tree clean",
      timestamp: new Date(),
    },
    {
      id: "3",
      type: "command",
      text: "npm run build",
      timestamp: new Date(),
      exitCode: 0,
      duration: 2340,
    },
    {
      id: "4",
      type: "output",
      text: "✓ Built in 2.34s\n📦 Bundle size: 234.5 KB",
      timestamp: new Date(),
    },
  ])

  const [currentInput, setCurrentInput] = useState("")
  const [showPalette, setShowPalette] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", icon: "🐚", active: true, title: "main" },
    { id: "2", icon: "⚙️", active: false, title: "config" },
  ])

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Git branch simulation
  const currentBranch = "main"
  const currentPath = "~/projects/modern-app"

  // AI suggestion simulation
  useEffect(() => {
    if (currentInput.length > 2) {
      const suggestions = {
        git: "git status",
        npm: "npm run dev",
        ls: "ls -la",
        cd: "cd ..",
        docker: "docker ps",
      }

      const matchedCommand = Object.keys(suggestions).find(
        (cmd) => currentInput.startsWith(cmd) && currentInput !== suggestions[cmd],
      )

      if (matchedCommand) {
        setAiSuggestion(suggestions[matchedCommand].slice(currentInput.length))
      } else {
        setAiSuggestion("")
      }
    } else {
      setAiSuggestion("")
    }
  }, [currentInput])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentInput.trim()) {
        const newCommand: TerminalCommand = {
          id: Date.now().toString(),
          type: "command",
          text: currentInput,
          timestamp: new Date(),
          exitCode: Math.random() > 0.1 ? 0 : 1,
          duration: Math.floor(Math.random() * 3000) + 100,
        }

        setCommands((prev) => [...prev, newCommand])

        // Simulate command output
        setTimeout(() => {
          const output: TerminalCommand = {
            id: (Date.now() + 1).toString(),
            type: newCommand.exitCode === 0 ? "output" : "error",
            text:
              newCommand.exitCode === 0
                ? `✓ Command executed successfully`
                : `✗ Command failed with exit code ${newCommand.exitCode}`,
            timestamp: new Date(),
          }
          setCommands((prev) => [...prev, output])
        }, 200)
      }
      setCurrentInput("")
      setAiSuggestion("")
    } else if (e.key === "Tab" && aiSuggestion) {
      e.preventDefault()
      setCurrentInput(currentInput + aiSuggestion)
      setAiSuggestion("")
    } else if (e.metaKey && e.key === "k") {
      e.preventDefault()
      setShowPalette(true)
    } else if (e.ctrlKey && e.key === "r") {
      e.preventDefault()
      setShowHistory(true)
    }
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div
      className={`w-full max-w-6xl mx-auto rounded-xl overflow-hidden transition-all duration-300 ${
        isActive ? "shadow-2xl bg-black/95" : "shadow-lg bg-black/80"
      }`}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Ultra-minimal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800/50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
        </div>

        {/* Minimal tab bar */}
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`px-3 py-1 rounded-md text-sm cursor-pointer transition-all ${
                tab.active ? "bg-gray-700/50 text-white" : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
            </div>
          ))}
          <button className="p-1 text-gray-400 hover:text-gray-300 transition-colors">
            <Plus size={14} />
          </button>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <button
            onClick={() => setShowPalette(true)}
            className="p-1 hover:text-gray-300 transition-colors"
            title="Command Palette (⌘K)"
          >
            <GitBranch size={14} />
          </button>
          <button className="p-1 hover:text-gray-300 transition-colors" title="Split Terminal">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Command Palette */}
      {showPalette && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-gray-900 rounded-lg border border-gray-700 w-96 shadow-2xl">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search commands, history, snippets..."
                  className="flex-1 bg-transparent text-white outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === "Escape" && setShowPalette(false)}
                />
              </div>
            </div>
            <div className="p-2 max-h-64 overflow-y-auto">
              {["git status", "npm run dev", "docker ps", "ls -la"].map((cmd, i) => (
                <div key={i} className="px-3 py-2 hover:bg-gray-800 rounded cursor-pointer text-gray-300">
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Terminal content */}
      <div
        ref={terminalRef}
        className="p-4 min-h-96 font-mono text-sm bg-transparent"
        style={{ fontFamily: "'Fira Code', 'Inconsolata', monospace" }}
      >
        {/* Command history */}
        <div className="space-y-2">
          {commands.map((cmd) => (
            <div key={cmd.id} className="group">
              {cmd.type === "command" ? (
                <div className="flex items-center space-x-2">
                  {/* Rich prompt */}
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-green-400 font-medium">→</span>
                    <span className="text-blue-400">{currentPath}</span>
                    <div className="flex items-center space-x-1 text-purple-400">
                      <GitBranch size={12} />
                      <span>{currentBranch}</span>
                    </div>
                    {cmd.exitCode !== undefined && (
                      <span
                        className={`text-xs px-1 rounded ${cmd.exitCode === 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {cmd.exitCode === 0 ? "✓" : "✗"}
                      </span>
                    )}
                    {cmd.duration && (
                      <div className="flex items-center space-x-1 text-gray-500 text-xs">
                        <Clock size={10} />
                        <span>{formatDuration(cmd.duration)}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-white">{cmd.text}</span>
                </div>
              ) : (
                <div className={`ml-4 whitespace-pre-wrap ${cmd.type === "error" ? "text-red-400" : "text-gray-300"}`}>
                  {cmd.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current input line */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-green-400 font-medium">→</span>
            <span className="text-blue-400">{currentPath}</span>
            <div className="flex items-center space-x-1 text-purple-400">
              <GitBranch size={12} />
              <span>{currentBranch}</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-transparent outline-none text-white font-mono"
              autoFocus
            />
            {aiSuggestion && (
              <span className="absolute left-0 top-0 text-gray-500 pointer-events-none font-mono">
                {currentInput}
                <span className="text-gray-600">{aiSuggestion}</span>
              </span>
            )}
          </div>
          <div className="w-2 h-5 bg-green-400 animate-pulse"></div>
        </div>

        {/* AI Assistant hint */}
        {aiSuggestion && (
          <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
            <Zap size={12} />
            <span>Press Tab to accept suggestion</span>
          </div>
        )}

        {/* Help text */}
        <div className="mt-8 text-xs text-gray-600 border-t border-gray-800/50 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Shortcuts:</p>
              <p>⌘K - Command palette</p>
              <p>⌃R - Search history</p>
              <p>Tab - Accept AI suggestion</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Features:</p>
              <p>• Git-aware prompt</p>
              <p>• AI-powered suggestions</p>
              <p>• Rich syntax highlighting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
