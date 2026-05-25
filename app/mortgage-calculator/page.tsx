'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calculator, DollarSign, Home, TrendingUp, Calendar, Percent, ArrowLeft, Info, Check, AlertCircle, X, BarChart3 } from 'lucide-react'
import DashboardLayout from '@/app/components/DashboardLayout'

export default function MortgageCalculatorPage() {
  // Calculator inputs
  const [propertyPrice, setPropertyPrice] = useState(800000)
  const [deposit, setDeposit] = useState(160000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [repaymentType, setRepaymentType] = useState<'principal-interest' | 'interest-only'>('principal-interest')
  const [repaymentFrequency, setRepaymentFrequency] = useState<'weekly' | 'fortnightly' | 'monthly'>('monthly')
  
  // Additional costs
  const [stampDuty, setStampDuty] = useState(0)
  const [lmiRequired, setLmiRequired] = useState(false)
  const [lmiCost, setLmiCost] = useState(0)
  
  // Results
  const [loanAmount, setLoanAmount] = useState(0)
  const [lvr, setLvr] = useState(0)
  const [monthlyRepayment, setMonthlyRepayment] = useState(0)
  const [weeklyRepayment, setWeeklyRepayment] = useState(0)
  const [fortnightlyRepayment, setFortnightlyRepayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalRepayment, setTotalRepayment] = useState(0)

  // Calculate stamp duty based on property price (NSW rates)
  const calculateStampDuty = (price: number): number => {
    if (price <= 16000) return price * 0.0125
    if (price <= 35000) return 200 + (price - 16000) * 0.015
    if (price <= 93000) return 485 + (price - 35000) * 0.0175
    if (price <= 351000) return 1500 + (price - 93000) * 0.035
    if (price <= 1168000) return 10530 + (price - 351000) * 0.045
    return 47280 + (price - 1168000) * 0.055
  }

  // Calculate LMI (Lenders Mortgage Insurance)
  const calculateLMI = (loanAmt: number, lvrRate: number): number => {
    if (lvrRate <= 80) return 0
    
    // Approximate LMI calculation
    const lmiRate = lvrRate > 90 ? 0.03 : lvrRate > 85 ? 0.02 : 0.01
    return loanAmt * lmiRate
  }

  // Calculate mortgage repayments
  useEffect(() => {
    const loan = propertyPrice - deposit
    const lvrRate = (loan / propertyPrice) * 100
    const calculatedStampDuty = calculateStampDuty(propertyPrice)
    const calculatedLMI = calculateLMI(loan, lvrRate)
    
    setLoanAmount(loan)
    setLvr(lvrRate)
    setStampDuty(calculatedStampDuty)
    setLmiCost(calculatedLMI)
    setLmiRequired(lvrRate > 80)

    // Calculate repayments
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (repaymentType === 'principal-interest') {
      // P&I calculation
      const monthly = loan * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      
      setMonthlyRepayment(monthly)
      setWeeklyRepayment(monthly * 12 / 52)
      setFortnightlyRepayment(monthly * 12 / 26)
      
      const totalPaid = monthly * numberOfPayments
      setTotalRepayment(totalPaid)
      setTotalInterest(totalPaid - loan)
    } else {
      // Interest only calculation
      const monthly = loan * monthlyRate
      
      setMonthlyRepayment(monthly)
      setWeeklyRepayment(monthly * 12 / 52)
      setFortnightlyRepayment(monthly * 12 / 26)
      
      const totalPaid = (monthly * numberOfPayments) + loan
      setTotalRepayment(totalPaid)
      setTotalInterest(monthly * numberOfPayments)
    }
  }, [propertyPrice, deposit, interestRate, loanTerm, repaymentType])

  const depositPercentage = (deposit / propertyPrice) * 100

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Australian Mortgage Calculator
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Home Loan Repayments
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Australia's most comprehensive mortgage calculator. Get accurate estimates for your home loan repayments, 
            including stamp duty, LMI, and total interest costs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Calculator Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Home className="h-7 w-7 text-blue-600" />
                Loan Details
              </h3>

              {/* Property Price */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Property Price</label>
                  <span className="text-2xl font-bold text-blue-600">
                    ${propertyPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="3000000"
                  step="10000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$200k</span>
                  <span>$3M</span>
                </div>
              </div>

              {/* Deposit */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Deposit ({depositPercentage.toFixed(1)}%)
                  </label>
                  <span className="text-2xl font-bold text-emerald-600">
                    ${deposit.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={propertyPrice * 0.5}
                  step="5000"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$0</span>
                  <span>${(propertyPrice * 0.5).toLocaleString()}</span>
                </div>
                {lvr > 80 && (
                  <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>LMI Required:</strong> Your LVR is {lvr.toFixed(1)}%. 
                      Lenders Mortgage Insurance of ${lmiCost.toLocaleString()} applies for deposits below 20%.
                    </p>
                  </div>
                )}
              </div>

              {/* Interest Rate */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Interest Rate</label>
                  <span className="text-2xl font-bold text-purple-600">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>2.0%</span>
                  <span>10.0%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Loan Term</label>
                  <span className="text-2xl font-bold text-indigo-600">
                    {loanTerm} years
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 years</span>
                  <span>30 years</span>
                </div>
              </div>

              {/* Repayment Type */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Repayment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRepaymentType('principal-interest')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      repaymentType === 'principal-interest'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {repaymentType === 'principal-interest' && <Check className="h-5 w-5" />}
                      <span className="font-semibold">Principal & Interest</span>
                    </div>
                    <p className="text-xs text-gray-600">Pay down the loan</p>
                  </button>
                  <button
                    onClick={() => setRepaymentType('interest-only')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      repaymentType === 'interest-only'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {repaymentType === 'interest-only' && <Check className="h-5 w-5" />}
                      <span className="font-semibold">Interest Only</span>
                    </div>
                    <p className="text-xs text-gray-600">Lower initial repayments</p>
                  </button>
                </div>
              </div>

              {/* Repayment Frequency */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Repayment Frequency</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['weekly', 'fortnightly', 'monthly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setRepaymentFrequency(freq)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        repaymentFrequency === freq
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {repaymentFrequency === freq && <Check className="h-4 w-4" />}
                        <span className="font-semibold capitalize">{freq}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-8 text-white sticky top-24">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Your Repayments
              </h3>

              {/* Main Repayment Display */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                <p className="text-sm opacity-90 mb-2">
                  {repaymentFrequency.charAt(0).toUpperCase() + repaymentFrequency.slice(1)} Repayment
                </p>
                <p className="text-5xl font-bold mb-1">
                  ${(repaymentFrequency === 'weekly' ? weeklyRepayment :
                     repaymentFrequency === 'fortnightly' ? fortnightlyRepayment :
                     monthlyRepayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm opacity-75">
                  {repaymentType === 'principal-interest' ? 'Principal & Interest' : 'Interest Only'}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Loan Amount</span>
                  <span className="font-bold text-lg">${loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">LVR</span>
                  <span className="font-bold text-lg">{lvr.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="text-sm opacity-90">Total Interest</span>
                  <span className="font-bold text-lg">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Total Repayment</span>
                  <span className="font-bold text-lg">${totalRepayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Additional Costs */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm font-semibold mb-3">Additional Costs (NSW)</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Stamp Duty</span>
                    <span className="font-semibold">${stampDuty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  {lmiRequired && (
                    <div className="flex justify-between">
                      <span className="opacity-90">LMI</span>
                      <span className="font-semibold">${lmiCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/20 flex justify-between font-bold">
                    <span>Total Upfront</span>
                    <span>${(deposit + stampDuty + (lmiRequired ? lmiCost : 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  href="/search"
                  className="block w-full bg-white text-blue-600 text-center font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-all shadow-lg"
                >
                  Find Properties in Your Budget
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Understanding Your Australian Home Loan
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Purchasing a property is one of the most significant financial decisions you'll make in your lifetime. 
              Our comprehensive Australian mortgage calculator helps you understand exactly what you'll be paying, 
              including hidden costs that many first-time buyers overlook.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're a first home buyer, property investor, or looking to refinance, this calculator provides 
              accurate estimates based on current Australian lending practices and includes all major costs such as 
              stamp duty, Lenders Mortgage Insurance (LMI), and total interest over the loan term.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Info className="h-8 w-8 text-blue-600" />
              How Mortgage Calculations Work
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Principal & Interest Repayments</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  The most common type of home loan in Australia, Principal & Interest (P&I) loans mean you pay both 
                  the principal (the amount you borrowed) and the interest each month. Your repayments are calculated 
                  using the following formula:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm overflow-x-auto">
                  M = P × [r(1+r)^n] / [(1+r)^n-1]
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Where: M = Monthly payment, P = Principal loan amount, r = Monthly interest rate, n = Number of payments
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  With P&I loans, your early repayments are mostly interest, but as you progress through the loan term, 
                  more of your repayment goes toward reducing the principal. This is called amortization, and it means 
                  you're building equity in your property from day one.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Interest-Only Repayments</h3>
                <p className="text-gray-700 leading-relaxed">
                  Interest-only loans are popular among property investors for tax benefits. With these loans, you only 
                  pay the interest charges each month, not the principal. This results in lower monthly repayments but 
                  means you're not reducing the loan amount. The calculation is simpler:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm mt-3 overflow-x-auto">
                  Monthly Payment = Loan Amount × (Annual Interest Rate / 12)
                </div>
                <p className="text-gray-700 leading-relaxed mt-3">
                  After the interest-only period (typically 1-5 years), the loan converts to principal & interest, 
                  and your repayments will increase significantly as you start paying down the principal over the 
                  remaining loan term.
                </p>
              </div>
            </div>
          </section>

          {/* LVR & LMI */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Percent className="h-8 w-8 text-emerald-600" />
              Loan-to-Value Ratio (LVR) & Lenders Mortgage Insurance
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What is LVR?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your Loan-to-Value Ratio (LVR) is the percentage of the property's value that you're borrowing. 
                  It's calculated by dividing your loan amount by the property's value and multiplying by 100. 
                  For example, if you're buying a $800,000 property with a $160,000 deposit (20%), your loan is 
                  $640,000, giving you an LVR of 80%.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">LVR Calculation:</p>
                  <p className="text-sm text-blue-800">LVR = (Loan Amount ÷ Property Value) × 100</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Understanding Lenders Mortgage Insurance (LMI)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If your LVR is above 80% (deposit less than 20%), lenders in Australia typically require you to pay 
                  Lenders Mortgage Insurance. Despite its name, LMI protects the lender, not you, in case you default 
                  on your loan. This is a one-off fee that can range from a few thousand to tens of thousands of dollars, 
                  depending on your loan amount and LVR.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 mb-2">LMI Cost Ranges:</p>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• 80-85% LVR: Approximately 1% of loan amount</li>
                        <li>• 85-90% LVR: Approximately 2% of loan amount</li>
                        <li>• 90-95% LVR: Approximately 3% of loan amount</li>
                      </ul>
                      <p className="text-sm text-amber-800 mt-3">
                        <strong>Tip:</strong> Saving a 20% deposit can save you thousands in LMI fees and give you 
                        access to better interest rates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stamp Duty */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
              Stamp Duty in Australia
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What is Stamp Duty?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Stamp duty (also called transfer duty) is a state government tax on property purchases. It's one of 
                  the largest upfront costs when buying property in Australia, and rates vary significantly between states. 
                  This calculator uses NSW rates, which are calculated on a sliding scale based on property value.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">NSW Stamp Duty Rates (2024)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Property Value</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Stamp Duty Calculation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">$0 - $16,000</td>
                        <td className="px-4 py-3 text-sm text-gray-700">1.25% of property value</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">$16,001 - $35,000</td>
                        <td className="px-4 py-3 text-sm text-gray-700">$200 + 1.5% of value over $16,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">$35,001 - $93,000</td>
                        <td className="px-4 py-3 text-sm text-gray-700">$485 + 1.75% of value over $35,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">$93,001 - $351,000</td>
                        <td className="px-4 py-3 text-sm text-gray-700">$1,500 + 3.5% of value over $93,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">$351,001 - $1,168,000</td>
                        <td className="px-4 py-3 text-sm text-gray-700">$10,530 + 4.5% of value over $351,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Over $1,168,000</td>
                        <td className="px-4 py-3 text-sm text-gray-700">$47,280 + 5.5% of value over $1,168,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <p className="text-sm font-semibold text-green-900 mb-2">First Home Buyer Concessions:</p>
                  <p className="text-sm text-green-800">
                    NSW first home buyers may be eligible for stamp duty concessions or exemptions on properties 
                    valued up to $800,000 (full exemption) or $650,000-$800,000 (reduced rates). Check with 
                    Revenue NSW for current eligibility criteria.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Repayment Strategies */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              Smart Repayment Strategies
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Make Extra Repayments</h3>
                <p className="text-gray-700 leading-relaxed">
                  One of the most powerful ways to save on interest is making extra repayments whenever possible. 
                  Even small additional payments can shave years off your loan term. For example, on a $640,000 loan 
                  at 6.5% over 30 years, paying just $100 extra per month could save you over $80,000 in interest 
                  and reduce your loan term by nearly 4 years.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Weekly or Fortnightly Repayments</h3>
                <p className="text-gray-700 leading-relaxed">
                  Switching from monthly to fortnightly repayments (half your monthly payment every two weeks) results 
                  in 26 repayments per year instead of 24 (12 months × 2). This extra payment can reduce your loan term 
                  significantly. The key is that you're making the equivalent of one extra monthly payment per year 
                  without feeling the impact as much.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Consider an Offset Account</h3>
                <p className="text-gray-700 leading-relaxed">
                  An offset account is a transaction account linked to your home loan. The balance in this account is 
                  offset against your loan balance when calculating interest. For example, if you have a $640,000 loan 
                  and $50,000 in your offset account, you only pay interest on $590,000. This can save thousands in 
                  interest while keeping your money accessible for emergencies.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Refinance to a Better Rate</h3>
                <p className="text-gray-700 leading-relaxed">
                  Interest rates change over time, and lenders often offer better rates to new customers than existing 
                  ones. If your current rate is significantly higher than the market rate, refinancing could save you 
                  hundreds of dollars per month. On a $640,000 loan, reducing your rate from 6.5% to 6.0% could save 
                  you approximately $200 per month ($2,400 per year).
                </p>
              </div>
            </div>
          </section>

          {/* Investment vs Owner-Occupied */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Home className="h-8 w-8 text-emerald-600" />
              Investment vs Owner-Occupied Loans
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">Owner-Occupied Loans</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <span>Lower interest rates (typically 0.3-0.5% less than investment)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <span>Principal & Interest repayments build equity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <span>May qualify for first home buyer benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <span>No rental income required for serviceability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-blue-600 mt-0.5" />
                    <span>Capital gains tax exemption when selling</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-purple-900 mb-3">Investment Loans</h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-purple-600 mt-0.5" />
                    <span>Interest payments are tax deductible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-purple-600 mt-0.5" />
                    <span>Interest-only options for better cash flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-purple-600 mt-0.5" />
                    <span>Can negative gear for tax benefits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-purple-600 mt-0.5" />
                    <span>Rental income helps with serviceability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 flex-shrink-0 text-purple-600 mt-0.5" />
                    <span>Capital growth potential plus rental returns</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Investment loans typically have interest rates 0.3-0.5% higher than 
                owner-occupied loans, but the tax benefits often outweigh this cost for investors in higher tax brackets. 
                Consult with a tax professional or financial advisor to determine which option is best for your situation.
              </p>
            </div>
          </section>

          {/* Factors Affecting Interest Rates */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Percent className="h-8 w-8 text-indigo-600" />
              What Affects Your Interest Rate?
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Loan-to-Value Ratio (LVR)</h3>
                <p className="text-gray-700">
                  Lower LVR = Lower rate. Borrowers with deposits of 20% or more typically receive the best rates 
                  because they present lower risk to lenders.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. Property Type</h3>
                <p className="text-gray-700">
                  Houses generally attract lower rates than apartments. Investment properties have higher rates than 
                  owner-occupied homes. Rural properties may face premium rates due to lower liquidity.
                </p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Employment & Income</h3>
                <p className="text-gray-700">
                  Stable employment and higher income can qualify you for better rates. PAYG employees typically get 
                  better rates than self-employed borrowers, who may face additional documentation requirements.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Credit Score</h3>
                <p className="text-gray-700">
                  A higher credit score (750+) can unlock premium rates. Lenders view applicants with strong credit 
                  history as lower risk. Late payments or defaults can significantly impact the rates you're offered.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Loan Features</h3>
                <p className="text-gray-700">
                  Basic variable loans typically have the lowest rates. Adding features like offset accounts, redraw 
                  facilities, or fixing your rate may increase the base rate by 0.1-0.3%.
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Reserve Bank Cash Rate</h3>
                <p className="text-gray-700">
                  The RBA cash rate influences all lending rates in Australia. When the RBA raises rates to combat 
                  inflation, mortgage rates typically follow. Variable loans are directly affected, while fixed loans 
                  are locked in for the fixed term.
                </p>
              </div>
            </div>
          </section>

          {/* Fixed vs Variable */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              Fixed vs Variable Rate Loans
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Variable Rate Loans</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Rate can decrease when RBA cuts rates</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">More flexibility with extra repayments</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Access to offset accounts and redraw facilities</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">No break fees if you refinance or sell</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-700">Rate can increase with RBA rate rises</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-700">Uncertain future repayments make budgeting harder</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fixed Rate Loans</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Predictable repayments for budgeting</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Protected from rate increases during fixed period</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Good for first-time buyers who want certainty</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-700">Can lock in low rates if timing is right</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-700">Can't benefit if rates decrease</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-700">Limited extra repayments (usually capped at $10-30k/year)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <X className="h-4 w-4 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-700">Break fees can be expensive if you exit early</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
              <p className="text-sm text-indigo-900 mb-2">
                <strong>Split Loan Strategy:</strong>
              </p>
              <p className="text-sm text-indigo-800">
                Many borrowers split their loan 50/50 or 60/40 between fixed and variable. This provides the 
                certainty of fixed repayments on part of your loan while maintaining flexibility and potential 
                savings on the variable portion. For example, fix $400k at 6.0% for 3 years and keep $400k variable 
                at 6.5% with an offset account.
              </p>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              Common Mortgage Mistakes to Avoid
            </h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-900 mb-2">1. Not Shopping Around for Rates</h3>
                <p className="text-sm text-red-800">
                  Many borrowers stick with their bank without comparing rates. A difference of just 0.25% on a 
                  $640,000 loan costs you approximately $32,000 extra over 30 years. Always compare at least 3-5 lenders.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-900 mb-2">2. Borrowing Your Maximum Capacity</h3>
                <p className="text-sm text-red-800">
                  Just because you're approved for $900,000 doesn't mean you should borrow it all. Leave a buffer 
                  for rate rises, emergency funds, and lifestyle. Financial stress from over-borrowing is a leading 
                  cause of mortgage defaults.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-900 mb-2">3. Ignoring Additional Costs</h3>
                <p className="text-sm text-red-800">
                  Stamp duty, LMI, legal fees, building inspections, and moving costs can add $50,000+ to your 
                  purchase. Factor these into your budget from day one or risk being caught short.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-900 mb-2">4. Not Reading the Fine Print</h3>
                <p className="text-sm text-red-800">
                  Understand all fees: application fees, ongoing fees, early exit fees, and break costs for fixed 
                  loans. A low advertised rate might come with high fees that negate the savings.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <h3 className="font-bold text-red-900 mb-2">5. Forgetting About Rate Rises</h3>
                <p className="text-sm text-red-800">
                  Test your budget against a 2-3% rate increase. If a rise from 6.5% to 8.5% would cause financial 
                  stress, you may be borrowing too much. The RBA's cash rate has varied from 0.1% to 4.35% in recent years.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How accurate is this mortgage calculator?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  This calculator provides highly accurate estimates using standard Australian mortgage formulas. 
                  However, actual repayments may vary slightly based on lender-specific calculation methods, 
                  rounding, and exact date of settlement. Always confirm final figures with your lender.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  What's a good LVR for first-time buyers?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Aim for 80% LVR (20% deposit) to avoid LMI and access the best rates. However, many first home 
                  buyers start with 90-95% LVR using the First Home Loan Deposit Scheme or family guarantees. 
                  While this helps you enter the market sooner, budget for higher repayments and LMI costs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Should I get a 25-year or 30-year loan?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  A 30-year loan has lower monthly repayments, making it easier to manage cash flow, especially 
                  for first-time buyers. However, you'll pay significantly more interest. A 25-year loan saves 
                  interest but requires higher repayments. Consider taking a 30-year loan but making extra repayments 
                  when possible – this gives you flexibility during tight months.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  When should I choose interest-only repayments?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Interest-only loans are primarily for investors seeking tax benefits and better cash flow. They're 
                  rarely suitable for owner-occupiers unless you have a specific short-term strategy. Remember, you're 
                  not building equity during the interest-only period, and repayments will increase significantly when 
                  it converts to P&I.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  How much can I borrow on my salary?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Most lenders use a rough guide of 6-7 times your annual income for maximum borrowing capacity. 
                  However, this depends heavily on your expenses, existing debts, number of dependents, and the 
                  lender's serviceability assessment. Use a borrowing calculator or speak with a mortgage broker 
                  for an accurate assessment.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  What's the difference between comparison rate and interest rate?
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The interest rate is what you pay on the loan amount. The comparison rate includes the interest 
                  rate plus most fees and charges (like application fees and ongoing fees) averaged over the loan 
                  term. Always check the comparison rate when comparing loans – a loan with a low interest rate but 
                  high fees might actually cost more than one with a slightly higher interest rate and lower fees.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Use our powerful search tool to find properties that match your budget and investment goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-xl"
              >
                <Home className="h-5 w-5" />
                Search Properties
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center gap-2 bg-blue-800 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-900 transition-all"
              >
                <BarChart3 className="h-5 w-5" />
                Compare Suburbs
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}
