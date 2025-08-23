import React from 'react';
import { ArrowRight, Users, TrendingUp, Heart, Shield } from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: () => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Debt
              <span className="block text-blue-200">Liberation Path</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Take our comprehensive assessment to understand your unique debt profile and discover personalized strategies for financial freedom through community-based solutions.
            </p>
            <button
              onClick={onStartQuiz}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-blue-700 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Your Assessment
              <ArrowRight className="ml-2 h-6 w-6" />
            </button>
            <p className="mt-4 text-blue-200">
              12 questions • 5 minutes • Completely confidential
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Take This Assessment?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our scientifically-designed quiz identifies your debt profile and readiness for alternative economic solutions, providing you with a personalized roadmap to financial wellness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Profile</h3>
              <p className="text-gray-600">
                Discover whether you're a Student Loan Struggler, Credit Card Cycler, Medical Debt Survivor, or another unique profile.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Solutions</h3>
              <p className="text-gray-600">
                Learn about cooperative economics, mutual aid networks, and community-based approaches to debt relief.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Readiness Assessment</h3>
              <p className="text-gray-600">
                Understand your readiness for alternative approaches and get recommendations tailored to your comfort level.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Actionable Insights</h3>
              <p className="text-gray-600">
                Receive specific recommendations and next steps based on your unique situation and goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who have discovered new paths to financial freedom through community-centered approaches.
          </p>
          <button
            onClick={onStartQuiz}
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-blue-700 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Begin Your Journey
            <ArrowRight className="ml-2 h-6 w-6" />
          </button>
        </div>
      </section>
    </div>
  );
}