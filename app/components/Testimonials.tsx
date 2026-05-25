'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Property Investor',
    location: 'Sydney, NSW',
    image: '/testimonials/sarah.jpg',
    rating: 5,
    text: 'Suburb Intel helped me identify an undervalued suburb in Western Sydney. Within 18 months, my property appreciated by $180,000. The investment score was spot on!',
    highlight: '$180k gain in 18 months',
  },
  {
    id: 2,
    name: 'Michael Thompson',
    role: 'First Home Buyer',
    location: 'Melbourne, VIC',
    image: '/testimonials/michael.jpg',
    rating: 5,
    text: 'As a first home buyer, I was overwhelmed by choices. The school ratings and demographic data helped me find the perfect family suburb within my budget.',
    highlight: 'Found perfect family suburb',
  },
  {
    id: 3,
    name: 'David & Emma Wilson',
    role: 'Rental Property Owners',
    location: 'Brisbane, QLD',
    image: '/testimonials/david.jpg',
    rating: 5,
    text: 'The rental yield data is incredibly accurate. We used it to build a 3-property portfolio generating $2,400/week in rental income.',
    highlight: '$2,400/week rental income',
  },
  {
    id: 4,
    name: 'Jennifer Liu',
    role: 'Real Estate Agent',
    location: 'Perth, WA',
    image: '/testimonials/jennifer.jpg',
    rating: 5,
    text: 'I recommend Suburb Intel to all my clients. The suburb reports are professional and the AI insights help buyers make confident decisions.',
    highlight: 'Professional suburb reports',
  },
  {
    id: 5,
    name: 'Robert Martinez',
    role: 'Portfolio Investor',
    location: 'Adelaide, SA',
    image: '/testimonials/robert.jpg',
    rating: 5,
    text: 'The compare feature saved me hours of research. I can quickly analyze 5 suburbs side-by-side and make data-driven decisions.',
    highlight: 'Hours of research saved',
  },
  {
    id: 6,
    name: 'Amanda Foster',
    role: 'Property Developer',
    location: 'Gold Coast, QLD',
    image: '/testimonials/amanda.jpg',
    rating: 5,
    text: 'Growth predictions have been remarkably accurate. Three suburbs I invested in based on Suburb Intel data all outperformed the market.',
    highlight: '3/3 suburbs outperformed',
  },
]

const stats = [
  { value: '14,500+', label: 'Suburbs Analyzed' },
  { value: '50,000+', label: 'Monthly Searches' },
  { value: '4.9/5', label: 'User Rating' },
  { value: '97%', label: 'Accuracy Rate' },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Trusted by Investors
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of property investors making smarter decisions with Suburb Intel
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 md:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="relative bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8">
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <Quote className="w-12 h-12 md:w-16 md:h-16 text-blue-100" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Avatar and Info */}
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0 md:min-w-[200px]">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="md:mt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">{testimonials[currentIndex].name}</h3>
                <p className="text-sm md:text-base text-gray-600">{testimonials[currentIndex].role}</p>
                <p className="text-sm text-gray-500">{testimonials[currentIndex].location}</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="flex-1">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed mb-6">
                "{testimonials[currentIndex].text}"
              </p>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                ✓ {testimonials[currentIndex].highlight}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentIndex(index)
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonial Grid - Mobile Scrollable, Desktop Grid */}
        <div className="overflow-x-auto pb-4 md:overflow-visible">
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 min-w-max md:min-w-0">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="w-[300px] md:w-auto flex-shrink-0 bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm line-clamp-4">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
