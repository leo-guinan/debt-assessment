import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, MessageSquare, GripVertical, Plus, X } from 'lucide-react';
import { questions } from '../data/questions';
import { QuizAnswer, QuizResult } from '../types/quiz';
import { calculateQuizResult } from '../utils/scoring';
import { submitQuizToAirtable } from "../services/airtable";

interface QuizProps {
  onComplete: (result: QuizResult) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [freeformResponse, setFreeformResponse] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [selectedDebtTypes, setSelectedDebtTypes] = useState<string[]>([]);
  const [rankedDebtTypes, setRankedDebtTypes] = useState<string[]>([]);
  const [multiSelectOptions, setMultiSelectOptions] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentQuestionData = questions[currentQuestion];
  const isFreeform = currentQuestionData.type === 'freeform';
  const isDragDrop = currentQuestionData.type === 'drag-drop';
  const isMultiSelect = currentQuestionData.type === 'multi-select';

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleFreeformChange = (value: string) => {
    setFreeformResponse(value);
    setSelectedOption('freeform'); // Set a default value for freeform questions
  };

  const handleContactInfoChange = (value: string) => {
    setContactInfo(value);
    setSelectedOption('freeform'); // Set a default value for contact info questions
  };

  const handleDebtTypeToggle = (value: string) => {
    if (value === 'H') { // "I have no debt" option
      setSelectedDebtTypes(['H']);
      setRankedDebtTypes(['H']);
      setSelectedOption('H');
      return;
    }

    if (selectedDebtTypes.includes('H')) {
      // Remove "no debt" if selecting actual debt types
      setSelectedDebtTypes([value]);
      setRankedDebtTypes([value]);
    } else if (selectedDebtTypes.includes(value)) {
      // Remove from both selected and ranked
      const newSelected = selectedDebtTypes.filter(item => item !== value);
      const newRanked = rankedDebtTypes.filter(item => item !== value);
      setSelectedDebtTypes(newSelected);
      setRankedDebtTypes(newRanked);
    } else {
      // Add to selected and ranked
      setSelectedDebtTypes([...selectedDebtTypes, value]);
      setRankedDebtTypes([...rankedDebtTypes, value]);
    }

    // Set selectedOption for validation
    setSelectedOption(selectedDebtTypes.length > 0 || value !== '' ? 'ranked' : '');
  };

  const handleDragStart = (e: React.DragEvent, value: string) => {
    setDraggedItem(value);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetValue: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetValue) return;

    const draggedIndex = rankedDebtTypes.indexOf(draggedItem);
    const targetIndex = rankedDebtTypes.indexOf(targetValue);

    const newRanked = [...rankedDebtTypes];
    newRanked.splice(draggedIndex, 1);
    newRanked.splice(targetIndex, 0, draggedItem);

    setRankedDebtTypes(newRanked);
    setDraggedItem(null);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newRanked = [...rankedDebtTypes];
    const [movedItem] = newRanked.splice(fromIndex, 1);
    newRanked.splice(toIndex, 0, movedItem);
    setRankedDebtTypes(newRanked);
  };

  const handleMultiSelectToggle = (value: string) => {
    if (multiSelectOptions.includes(value)) {
      setMultiSelectOptions(multiSelectOptions.filter(item => item !== value));
    } else {
      setMultiSelectOptions([...multiSelectOptions, value]);
    }
    // Set selectedOption for validation
    setSelectedOption(multiSelectOptions.length > 0 || !multiSelectOptions.includes(value) ? 'multi-selected' : '');
  };

  const handleNext = async () => {
    if (!selectedOption && !isFreeform && !isDragDrop && !isMultiSelect) return;
    if (isFreeform && !freeformResponse.trim() && !selectedOption) {
      // Allow skipping freeform questions
      setSelectedOption('freeform');
    }
    if (isMultiSelect && multiSelectOptions.length === 0) return;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestionData.id,
      selectedOption: isFreeform ? 'freeform' : isDragDrop ? 'ranked' : isMultiSelect ? 'multi-selected' : selectedOption,
      rankedOptions: isDragDrop ? rankedDebtTypes : undefined,
      multiSelectOptions: isMultiSelect ? multiSelectOptions : undefined
    };

    const updatedAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestionData.id),
      newAnswer
    ];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        const result = calculateQuizResult(updatedAnswers, freeformResponse, contactInfo);
        
        // Submit to Airtable
        await submitQuizToAirtable(result);
        
        // Complete the quiz
        onComplete(result);
      } catch (error) {
        console.error('Submission error:', error);
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit response');
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption('');
      setFreeformResponse('');
      setContactInfo('');
      setSelectedDebtTypes([]);
      setRankedDebtTypes([]);
      setMultiSelectOptions([]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const previousAnswer = answers.find(a => a.questionId === questions[currentQuestion - 1].id);
      setSelectedOption(previousAnswer?.selectedOption || '');
      // Reset freeform response when going back
      if (questions[currentQuestion - 1].type === 'freeform') {
        setFreeformResponse('');
        setContactInfo('');
      }
      // Reset drag-drop state when going back
      if (questions[currentQuestion - 1].type === 'drag-drop') {
        setSelectedDebtTypes([]);
        setRankedDebtTypes([]);
      }
      // Reset multi-select state when going back
      if (questions[currentQuestion - 1].type === 'multi-select') {
        setMultiSelectOptions([]);
      }
    }
  };

  const getOptionLabel = (value: string) => {
    return currentQuestionData.options.find(opt => opt.value === value)?.label || '';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
            {currentQuestionData.question}
          </h2>

          {isDragDrop ? (
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                Select all debt types that apply to you, then drag to rank them from highest amount to lowest:
              </div>
              
              {/* Available Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Available Debt Types:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestionData.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDebtTypeToggle(option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        selectedDebtTypes.includes(option.value)
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {selectedDebtTypes.includes(option.value) ? (
                          <X className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Plus className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ranking Area */}
              {rankedDebtTypes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700">
                    Your Debt Ranking (Highest to Lowest Amount):
                  </h3>
                  <div className="space-y-2">
                    {rankedDebtTypes.map((value, index) => (
                      <div
                        key={value}
                        draggable={rankedDebtTypes.length > 1}
                        onDragStart={(e) => handleDragStart(e, value)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, value)}
                        className={`flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 ${
                          rankedDebtTypes.length > 1 ? 'cursor-move' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-4 text-blue-600 font-semibold">
                          {index + 1}
                        </div>
                        {rankedDebtTypes.length > 1 && (
                          <GripVertical className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <span className="flex-1 font-medium">{getOptionLabel(value)}</span>
                        <div className="flex space-x-1">
                          {index > 0 && (
                            <button
                              onClick={() => moveItem(index, index - 1)}
                              className="p-1 text-gray-400 hover:text-blue-500"
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {index < rankedDebtTypes.length - 1 && (
                            <button
                              onClick={() => moveItem(index, index + 1)}
                              className="p-1 text-gray-400 hover:text-blue-500"
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : isMultiSelect ? (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Select all ways your debt accumulated:
              </div>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleMultiSelectToggle(option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      multiSelectOptions.includes(option.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mr-4">
                          {option.value}
                        </span>
                        <span className="text-base md:text-lg">{option.label}</span>
                      </div>
                      {multiSelectOptions.includes(option.value) ? (
                        <CheckCircle className="h-6 w-6 text-blue-500" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {multiSelectOptions.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Selected: {multiSelectOptions.map(value => 
                      currentQuestionData.options.find(opt => opt.value === value)?.label
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ) : isFreeform ? (
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 mb-4">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="text-sm">This question is optional - feel free to share as much or as little as you'd like</span>
              </div>
              <textarea
                value={currentQuestionData.id === 11 ? contactInfo : freeformResponse}
                onChange={(e) => currentQuestionData.id === 11 ? handleContactInfoChange(e.target.value) : handleFreeformChange(e.target.value)}
                placeholder={currentQuestionData.id === 11 
                  ? "Email, Twitter handle, Discord username, or any other way you'd prefer to be contacted..."
                  : "Share your thoughts about your financial situation, experiences with debt, interest in collaborative economics, or anything else you'd like us to know..."
                }
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 min-h-32 resize-y"
                rows={4}
              />
              <p className="text-sm text-gray-500">
                {currentQuestionData.id === 11 
                  ? "We'll only use this to follow up about the platform development. Your contact info won't be shared."
                  : "Your response helps us provide more personalized recommendations."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedOption === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mr-4">
                        {option.value}
                      </span>
                      <span className="text-base md:text-lg">{option.label}</span>
                    </span>
                    {selectedOption === option.value && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              <strong>Submission Error:</strong> {submitError}
            </p>
            <p className="text-red-600 text-xs mt-1">
              You can still see your results, but your response wasn't saved. Please try again later.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting || (!selectedOption && !isFreeform && !isDragDrop && !(isMultiSelect && multiSelectOptions.length > 0))}
            className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
              !isSubmitting && (selectedOption || isFreeform || (isDragDrop && rankedDebtTypes.length > 0) || (isMultiSelect && multiSelectOptions.length > 0))
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : isLastQuestion ? 'Complete Assessment' : 'Next'}
            {!isLastQuestion && <ChevronRight className="h-5 w-5 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}