'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Phone, User, MapPin, Globe, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AgentSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agencyName: '',
    agencyAddress: '',
    agencyWebsite: '',
    licenseNumber: '',
    yearsExperience: '',
    specialization: 'Residential Sales',
    selectedPlan: 'professional',
    agreeToTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/agents/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStep(3) // Success step
      } else {
        alert('Signup failed. Please try again.')
      }
    } catch (error) {
      alert('Error during signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">SuburbIntel for Agents</h1>
            <button
              onClick={() => router.push('/')}
              className="text-white/70 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {step === 1 && (
          <div className="animate-fade-in">
            {/* Benefits Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Professional Agent Platform
              </h2>
              <p className="text-xl text-gray-300 mb-2">
                Attract serious buyers with investment intelligence
              </p>
              <div className="inline-block bg-blue-500/20 px-6 py-2 rounded-full">
                <span className="text-blue-400 font-semibold">$99/month • 14-day free trial</span>
              </div>
            </div>

            {/* Single Pricing Card */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-blue-500">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Professional Plan</h3>
                  <div className="text-5xl font-bold text-white mb-2">$99<span className="text-2xl text-gray-400">/month</span></div>
                  <p className="text-gray-400">Everything you need to succeed</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  {[
                    'Unlimited property listings',
                    'Full investment intelligence',
                    'Priority listing placement',
                    'Email + SMS notifications',
                    'Lead management dashboard',
                    'Advanced buyer filtering',
                    'Priority customer support',
                    'Detailed analytics'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                  <div className="text-sm text-green-400 font-semibold">✓ 14-day free trial • No credit card required</div>
                  <div className="text-xs text-gray-400 mt-1">Cancel anytime • No setup fees</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">What You Get:</h3>
              
              <div className="space-y-4 mb-8">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <div className="text-sm text-blue-400 font-semibold mb-2">Professional Plan - $99/month</div>
                  <div className="text-xs text-gray-400">Billed monthly • Cancel anytime • No setup fees</div>
                </div>

                {[
                  'Unlimited property listings',
                  'Full investment intelligence on every property',
                  'AI-powered suburb analysis shown to buyers',
                  'Priority listing placement',
                  'Lead management dashboard',
                  'Email + SMS inquiry notifications',
                  'Advanced buyer filtering',
                  'Priority customer support'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                Start Free Signup
                <ArrowRight className="h-5 w-5" />
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-2">Agent Registration</h2>
              <p className="text-gray-400 mb-8">Join the platform that tells buyers if it's actually a good investment.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Personal Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="john@agency.com.au"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="0400 000 000"
                      />
                    </div>
                  </div>
                </div>

                {/* Agency Details */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white">Agency Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agency Name *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={formData.agencyName}
                        onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="ABC Real Estate"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agency Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.agencyAddress}
                        onChange={(e) => setFormData({...formData, agencyAddress: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main St, Sydney NSW 2000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Agency Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="url"
                        value={formData.agencyWebsite}
                        onChange={(e) => setFormData({...formData, agencyWebsite: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="https://agency.com.au"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Real Estate License Number *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="NSW: 20123456 | VIC: 067890L"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Years Experience *</label>
                      <select
                        required
                        value={formData.yearsExperience}
                        onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Specialization *</label>
                      <select
                        required
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Residential Sales">Residential Sales</option>
                        <option value="Residential Leasing">Residential Leasing</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Investment Properties">Investment Properties</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Plan Selection */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white">Subscription Plan</h3>
                  
                  <div className="bg-blue-500/10 border-2 border-blue-500 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xl font-bold text-white">Professional Plan</div>
                        <div className="text-3xl font-bold text-white mt-2">$99<span className="text-lg text-gray-400">/month</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-400 font-semibold">✓ 14-day free trial</div>
                        <div className="text-xs text-gray-400">No credit card required</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>✓ Unlimited property listings</div>
                      <div>✓ Full investment intelligence on every property</div>
                      <div>✓ Priority placement & lead management</div>
                    </div>
                  </div>

                  <input type="hidden" name="selectedPlan" value="professional" />
                </div>

                {/* Terms */}
                <div className="pt-6 border-t border-white/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                      className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">
                      I agree to the Terms of Service and confirm I am a licensed real estate agent in Australia
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Complete Signup'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in text-center">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 border border-white/10">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to SuburbIntel!</h2>
              <p className="text-xl text-gray-300 mb-8">
                Your agent account has been created. Check your email for login details.
              </p>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-400">Next steps:</p>
                <div className="text-left max-w-md mx-auto space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    Check your email for verification link
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    Complete your profile setup
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    Start listing properties for FREE
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/agent/listings/new')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all"
              >
                Create Your First Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
