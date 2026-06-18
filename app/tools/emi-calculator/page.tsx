"use client"

import { useState, useMemo } from "react"
import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, IndianRupee, Percent, Calendar } from "lucide-react"

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(5000000)
  const [interestRate, setInterestRate] = useState(8.5)
  const [loanTenure, setLoanTenure] = useState(20)
  const [tenureType, setTenureType] = useState<"years" | "months">("years")

  const calculations = useMemo(() => {
    const principal = loanAmount
    const rate = interestRate / 12 / 100
    const tenure = tenureType === "years" ? loanTenure * 12 : loanTenure

    if (rate === 0) {
      const emi = principal / tenure
      return {
        emi: Math.round(emi),
        totalPayment: Math.round(principal),
        totalInterest: 0,
        tenure,
      }
    }

    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)
    const totalPayment = emi * tenure
    const totalInterest = totalPayment - principal

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      tenure,
    }
  }, [loanAmount, interestRate, loanTenure, tenureType])

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)} Cr`
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)} Lac`
    }
    return amount.toLocaleString("en-IN")
  }

  const interestPercentage = calculations.totalPayment > 0
    ? Math.round((calculations.totalInterest / calculations.totalPayment) * 100)
    : 0

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="w-full py-12 md:py-16 px-4 bg-gradient-to-br from-[#002366] to-[#003d99] text-white">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">EMI Calculator</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Calculate your home loan EMI instantly. Plan your property investment with accurate monthly payment estimates.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="w-full py-12 md:py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Loan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Loan Amount */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                        Loan Amount
                      </label>
                      <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-md">
                        <span className="text-sm font-semibold">Rs. {formatCurrency(loanAmount)}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={500000}
                      max={100000000}
                      step={100000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 Lac</span>
                      <span>10 Cr</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Percent className="w-4 h-4 text-muted-foreground" />
                        Interest Rate (p.a.)
                      </label>
                      <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-md">
                        <span className="text-sm font-semibold">{interestRate}%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={20}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Loan Tenure
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-md">
                          <span className="text-sm font-semibold">{loanTenure} {tenureType}</span>
                        </div>
                        <div className="flex rounded-md border border-border overflow-hidden">
                          <button
                            onClick={() => {
                              setTenureType("years")
                              if (loanTenure > 30) setLoanTenure(30)
                            }}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${tenureType === "years" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                              }`}
                          >
                            Yr
                          </button>
                          <button
                            onClick={() => {
                              setTenureType("months")
                              setLoanTenure(loanTenure * 12 > 360 ? 360 : loanTenure * 12)
                            }}
                            className={`px-3 py-1 text-xs font-medium transition-colors ${tenureType === "months" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                              }`}
                          >
                            Mo
                          </button>
                        </div>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={tenureType === "years" ? 1 : 12}
                      max={tenureType === "years" ? 30 : 360}
                      step={tenureType === "years" ? 1 : 12}
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{tenureType === "years" ? "1 Yr" : "12 Mo"}</span>
                      <span>{tenureType === "years" ? "30 Yr" : "360 Mo"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Section */}
              <div className="space-y-6">
                {/* EMI Display */}
                <Card className="bg-gradient-to-br from-[#002366] to-[#003d99] text-white border-0">
                  <CardContent className="p-8 text-center">
                    <p className="text-blue-100 text-sm mb-2">Your Monthly EMI</p>
                    <p className="text-4xl md:text-5xl font-bold mb-1">
                      Rs. {calculations.emi.toLocaleString("en-IN")}
                    </p>
                    <p className="text-blue-200 text-xs">for {calculations.tenure} months</p>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card className="border-border">
                  <CardContent className="p-6 space-y-6">
                    {/* Visual Breakdown */}
                    <div className="space-y-3">
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-primary"
                          style={{ width: `${100 - interestPercentage}%` }}
                        />
                        <div
                          className="bg-red-500"
                          style={{ width: `${interestPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                          <span className="text-muted-foreground">Principal ({100 - interestPercentage}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-muted-foreground">Interest ({interestPercentage}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Principal Amount</span>
                        <span className="font-semibold">Rs. {loanAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border">
                        <span className="text-sm text-muted-foreground">Total Interest</span>
                        <span className="font-semibold text-red-500">Rs. {calculations.totalInterest.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-sm font-medium">Total Payment</span>
                        <span className="font-bold text-lg">Rs. {calculations.totalPayment.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="border-border bg-muted/50">
                  <CardContent className="p-6 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Ready to find your dream property in Gurugram?
                    </p>
                    <Button asChild>
                      <a href="/properties">Browse Properties</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="w-full py-12 px-4 bg-muted/30 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-center">Understanding EMI</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">What is EMI?</h3>
                <p className="text-sm text-muted-foreground">
                  EMI (Equated Monthly Installment) is the fixed amount you pay each month towards your loan repayment.
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Percent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Factors Affecting EMI</h3>
                <p className="text-sm text-muted-foreground">
                  Your EMI depends on loan amount, interest rate, and tenure. Lower rates or longer tenure reduce EMI.
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Plan Wisely</h3>
                <p className="text-sm text-muted-foreground">
                  Choose an EMI that fits your budget. Experts recommend EMI should not exceed 40% of your monthly income.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
