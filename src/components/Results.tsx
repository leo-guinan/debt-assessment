import React from 'react';
import { RotateCcw, TrendingUp, Users, Target, Award } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface ResultsProps {
  result: QuizResult;
  onRestart: () => void;
}

export default function Results({ result, onRestart }: ResultsProps) {
  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'high': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-blue-500 to-indigo-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getReadinessDescription = (level: string) => {
    switch (level) {
      case 'high':
        return 'You\'re ready for immediate action in collaborative economics. You\'ve likely exhausted traditional options and are open to radical change.';
      case 'medium':
        return 'You\'re open to alternatives but may need gradual transition. You\'re frustrated with the current system and willing to experiment.';
      case 'low':
        return 'You\'re still exploring and may benefit from traditional approaches first. You haven\'t exhausted conventional options yet.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Debt Profile Assessment Results
          </h1>
          <p className="text-xl text-gray-600">
            Discover your personalized path to financial freedom
          </p>
        </div>

        {/* Primary Profile */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Primary Profile</h2>
              <h3 className="text-3xl font-bold text-blue-600 mb-4">{result.primaryProfile.name}</h3>
              <div className="flex items-center text-lg text-gray-600">
                <Target className="h-5 w-5 mr-2" />
                {result.primaryProfile.matchPercentage}% Match
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${result.primaryProfile.matchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Readiness Score */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Alternative Solutions Readiness</h2>
              <div className="flex items-center mb-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getReadinessColor(result.readinessLevel)}`}>
                  {result.readinessScore}% - {result.readinessLevel.toUpperCase()} READINESS
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {getReadinessDescription(result.readinessLevel)}
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${getReadinessColor(result.readinessLevel)}`}>
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 bg-gradient-to-r ${getReadinessColor(result.readinessLevel)}`}
              style={{ width: `${result.readinessScore}%` }}
            ></div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Recommendations</h2>
          <div className="grid gap-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-4 mt-1 flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Score Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(result.profileScores).map(([key, score]) => {
              const profileNames = {
                student: 'Student Loan Struggler',
                credit: 'Credit Card Cycler',
                medical: 'Medical Debt Survivor',
                mortgage: 'Asset-Secured Borrower',
                multi: 'Multi-Generational Carrier',
                solidarity: 'Solidarity Participant'
              };
              
              const maxScore = Math.max(...Object.values(result.profileScores), 1);
              const percentage = (score / maxScore) * 100;
              
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 w-48">
                    {profileNames[key as keyof typeof profileNames]}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-600 font-medium w-12 text-right">{score}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Freeform Response Display */}
        {result.freeformResponse && result.freeformResponse.trim() && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Additional Insights</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed italic">
                "{result.freeformResponse}"
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Thank you for sharing your perspective. This helps us understand your unique situation better.
            </p>
          </div>
        )}

        {/* Contact Info Confirmation */}
        {result.contactInfo && result.contactInfo.trim() && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Your Interest</h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                We've noted your interest in following up about the collaborative debt management platform. 
                We'll reach out using the contact method you provided when we have updates to share.
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Your contact information is kept confidential and will only be used for platform development updates.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Assessment Again
          </button>
          <button className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Explore Solutions
          </button>
        </div>
      </div>
    </div>
  );
}