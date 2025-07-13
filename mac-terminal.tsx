"use client"

import type React from "react"

import { useState } from "react"

export default function MacTerminal() {
  const [commands, setCommands] = useState([
    { type: "command", text: "ls -la" },
    { type: "output", text: "total 24" },
    { type: "output", text: "drwxr-xr-x  5 user  staff   160 Dec  7 14:30 ." },
    { type: "output", text: "drwxr-xr-x  3 user  staff    96 Dec  7 14:25 .." },
    { type: "output", text: "-rw-r--r--  1 user  staff  1024 Dec  7 14:30 README.md" },
    { type: "output", text: "drwxr-xr-x  3 user  staff    96 Dec  7 14:28 src" },
    { type: "command", text: "pwd" },
    { type: "output", text: "/Users/user/projects/my-app" },
  ])

  const [currentInput, setCurrentInput] = useState("")

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (currentInput.trim()) {
        setCommands((prev) => [...prev, { type: "command", text: currentInput }])
        // Simulate some basic command responses
        if (currentInput === "clear") {
          setCommands([])
        } else if (currentInput === "date") {
          setCommands((prev) => [...prev, { type: "output", text: new Date().toString() }])
        } else if (currentInput.startsWith("echo ")) {
          setCommands((prev) => [...prev, { type: "output", text: currentInput.slice(5) }])
        } else {
          setCommands((prev) => [...prev, { type: "output", text: `command not found: ${currentInput}` }])
        }
      }
      setCurrentInput("")
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm font-medium text-gray-600">Terminal</div>
        <div className="w-14"></div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 bg-white min-h-96 font-mono text-sm">
        {/* Command History */}
        <div className="space-y-1">
          {commands.map((cmd, index) => (
            <div key={index} className="flex">
              {cmd.type === "command" ? (
                <div className="flex w-full">
                  <span className="text-green-600 mr-2">user@macbook</span>
                  <span className="text-blue-600 mr-2">~</span>
                  <span className="text-gray-800 mr-2">$</span>
                  <span className="text-gray-900">{cmd.text}</span>
                </div>
              ) : (
                <div className="text-gray-700 ml-0">{cmd.text}</div>
              )}
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-green-600 mr-2">user@macbook</span>
          <span className="text-blue-600 mr-2">~</span>
          <span className="text-gray-800 mr-2">$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-gray-900 font-mono"
            placeholder="Type a command..."
            autoFocus
          />
          <span className="w-2 h-5 bg-gray-900 animate-pulse ml-1"></span>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-xs text-gray-500 border-t border-gray-100 pt-4">
          <p>
            Try commands like: <span className="font-semibold">ls</span>, <span className="font-semibold">pwd</span>,{" "}
            <span className="font-semibold">date</span>, <span className="font-semibold">echo hello</span>, or{" "}
            <span className="font-semibold">clear</span>
          </p>
        </div>
      </div>
    </div>
  )
}
