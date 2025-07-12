"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const words = [
  "apple",
  "banana",
  "cherry",
  "dragon",
  "elephant",
  "flower",
  "guitar",
  "house",
  "island",
  "jungle",
  "keyboard",
  "lemon",
  "mountain",
  "notebook",
  "ocean",
  "piano",
  "queen",
  "rainbow",
  "sunset",
  "tiger",
  "umbrella",
  "village",
  "window",
  "yellow",
  "zebra",
  "coffee",
  "bridge",
  "castle",
  "diamond",
  "engine",
]

export default function Component() {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "finished">("waiting")
  const [currentWord, setCurrentWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [totalWords, setTotalWords] = useState(0)
  const [correctWords, setCorrectWords] = useState(0)
  const [wordTimeLeft, setWordTimeLeft] = useState(5)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const gameTimerRef = useRef<NodeJS.Timeout>()
  const wordTimerRef = useRef<NodeJS.Timeout>()

  const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)]
  }

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setTimeLeft(60)
    setTotalWords(0)
    setCorrectWords(0)
    setStreak(0)
    setMaxStreak(0)
    setCurrentWord(getRandomWord())
    setUserInput("")
    setWordTimeLeft(5)

    inputRef.current?.focus()

    // ゲーム全体のタイマー
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // 単語ごとのタイマー
    startWordTimer()
  }

  const startWordTimer = () => {
    setWordTimeLeft(5)
    wordTimerRef.current = setInterval(() => {
      setWordTimeLeft((prev) => {
        if (prev <= 1) {
          // 時間切れ - 次の単語へ
          nextWord(false)
          return 5
        }
        return prev - 1
      })
    }, 1000)
  }

  const nextWord = (isCorrect: boolean) => {
    setTotalWords((prev) => prev + 1)

    if (isCorrect) {
      setCorrectWords((prev) => prev + 1)
      setScore((prev) => prev + 10 + streak * 2) // ストリークボーナス
      setStreak((prev) => {
        const newStreak = prev + 1
        setMaxStreak((current) => Math.max(current, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }

    setCurrentWord(getRandomWord())
    setUserInput("")

    // 単語タイマーをリセット
    if (wordTimerRef.current) {
      clearInterval(wordTimerRef.current)
    }
    startWordTimer()
  }

  const endGame = () => {
    setGameState("finished")
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current)
    }
    if (wordTimerRef.current) {
      clearInterval(wordTimerRef.current)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserInput(value)

    if (value.toLowerCase() === currentWord.toLowerCase()) {
      nextWord(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && gameState === "waiting") {
      startGame()
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setUserInput("")
    setCurrentWord("")
  }

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current)
      }
      if (wordTimerRef.current) {
        clearInterval(wordTimerRef.current)
      }
    }
  }, [])

  const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0
  const wpm = correctWords > 0 ? Math.round((correctWords / (60 - timeLeft)) * 60) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">タイピングゲーム</CardTitle>
          <CardDescription className="text-lg">
            反射神経チェック - 表示された単語を素早くタイピングしよう！
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {gameState === "waiting" && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                60秒間でできるだけ多くの単語を正確にタイピングしてください。
                <br />
                各単語には5秒の制限時間があります。
              </p>
              <Button onClick={startGame} size="lg" className="px-8 py-3 text-lg">
                ゲーム開始
              </Button>
              <p className="text-sm text-gray-500">または Enter キーを押してください</p>
            </div>
          )}

          {gameState === "playing" && (
            <div className="space-y-6">
              {/* ゲーム情報 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{timeLeft}</div>
                  <div className="text-sm text-gray-600">残り時間</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">スコア</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{streak}</div>
                  <div className="text-sm text-gray-600">連続正解</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{correctWords}</div>
                  <div className="text-sm text-gray-600">正解数</div>
                </div>
              </div>

              {/* 単語表示エリア */}
              <div className="text-center space-y-4">
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
                  <div className="text-4xl font-mono font-bold text-gray-800 mb-4">{currentWord}</div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-600">残り時間:</span>
                    <Badge variant={wordTimeLeft <= 2 ? "destructive" : "secondary"}>{wordTimeLeft}秒</Badge>
                  </div>
                  <Progress value={(wordTimeLeft / 5) * 100} className="mt-2 h-2" />
                </div>

                <Input
                  ref={inputRef}
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="ここに単語を入力してください..."
                  className="text-center text-xl py-3"
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          {gameState === "finished" && (
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">ゲーム終了！</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-gray-600">最終スコア</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-bold text-green-600">{correctWords}</div>
                    <div className="text-sm text-gray-600">正解数</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                    <div className="text-sm text-gray-600">正解率</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-3xl font-bold text-orange-600">{maxStreak}</div>
                    <div className="text-sm text-gray-600">最大連続正解</div>
                  </div>
                </div>

                <div className="text-gray-600 mb-4">
                  <p>総単語数: {totalWords}</p>
                  <p>推定WPM: {wpm}</p>
                </div>
              </div>

              <Button onClick={resetGame} size="lg" className="px-8 py-3 text-lg">
                もう一度プレイ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {gameState === "waiting" && <input className="sr-only" onKeyPress={handleKeyPress} autoFocus />}
    </div>
  )
}
