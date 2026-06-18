"use client"

import { useState, useRef } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Download, Copy, Check, Link2, Phone, Mail, MessageSquare } from "lucide-react"

export default function QRGeneratorPage() {
  const [inputType, setInputType] = useState<"url" | "phone" | "email" | "text">("url")
  const [inputValue, setInputValue] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const inputTypes = [
    { id: "url", label: "URL", icon: Link2, placeholder: "https://example.com" },
    { id: "phone", label: "Phone", icon: Phone, placeholder: "+91 9876543210" },
    { id: "email", label: "Email", icon: Mail, placeholder: "email@example.com" },
    { id: "text", label: "Text", icon: MessageSquare, placeholder: "Enter any text..." },
  ] as const

  const getQRValue = () => {
    switch (inputType) {
      case "phone":
        return `tel:${inputValue.replace(/\s/g, "")}`
      case "email":
        return `mailto:${inputValue}`
      default:
        return inputValue
    }
  }

  const generateQR = () => {
    if (!inputValue.trim()) return
    setQrGenerated(true)
  }

  const qrCodeUrl = qrGenerated
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getQRValue())}`
    : null

  const handleDownload = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `qr-code-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleCopy = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback: copy URL
      await navigator.clipboard.writeText(qrCodeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="w-full py-12 md:py-16 px-4 bg-gradient-to-br from-[#002366] to-[#003d99] text-white">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
              <QrCode className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">QR Code Generator</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Create QR codes instantly for URLs, phone numbers, emails, or any text. Perfect for sharing property listings and contact information.
            </p>
          </div>
        </section>

        {/* Generator Section */}
        <section className="w-full py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Create QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Type Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Select Type</label>
                    <div className="grid grid-cols-4 gap-2">
                      {inputTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setInputType(type.id)
                            setInputValue("")
                            setQrGenerated(false)
                          }}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${inputType === type.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                            }`}
                        >
                          <type.icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Field */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Enter {inputTypes.find(t => t.id === inputType)?.label}
                    </label>
                    {inputType === "text" ? (
                      <textarea
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value)
                          setQrGenerated(false)
                        }}
                        placeholder={inputTypes.find(t => t.id === inputType)?.placeholder}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    ) : (
                      <input
                        type={inputType === "email" ? "email" : inputType === "phone" ? "tel" : "url"}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value)
                          setQrGenerated(false)
                        }}
                        placeholder={inputTypes.find(t => t.id === inputType)?.placeholder}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    )}
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={generateQR}
                    className="w-full"
                    disabled={!inputValue.trim()}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                </CardContent>
              </Card>

              {/* QR Code Display */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Your QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    ref={qrRef}
                    className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border"
                  >
                    {qrGenerated && qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="Generated QR Code"
                        className="w-full h-full p-4"
                      />
                    ) : (
                      <div className="text-center space-y-3 p-8">
                        <QrCode className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Your QR code will appear here
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {qrGenerated && (
                    <div className="flex gap-3">
                      <Button onClick={handleDownload} variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button onClick={handleCopy} variant="outline" className="flex-1">
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="w-full py-12 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-center">How to Use QR Codes in Real Estate</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-lg border border-border space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Property Listings</h3>
                <p className="text-sm text-muted-foreground">
                  Add QR codes to brochures and signboards linking directly to property details.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-border space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Quick Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Let potential buyers call or message you instantly by scanning your QR code.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border border-border space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Virtual Tours</h3>
                <p className="text-sm text-muted-foreground">
                  Share links to virtual property tours and video walkthroughs effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
