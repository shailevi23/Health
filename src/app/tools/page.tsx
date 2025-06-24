'use client';

import React, { useState } from 'react';

interface CalculatorProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Calculator: React.FC<CalculatorProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
};

export default function ToolsPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bmi, setBmi] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  const calculateBMI = () => {
    if (weight && height) {
      const weightKg = parseFloat(weight);
      const heightM = parseFloat(height) / 100;
      const bmiValue = weightKg / (heightM * heightM);
      setBmi(Math.round(bmiValue * 10) / 10);
    }
  };

  const calculateCalories = () => {
    if (weight && height && age) {
      const weightKg = parseFloat(weight);
      const heightCm = parseFloat(height);
      const ageYears = parseFloat(age);

      // Mifflin-St Jeor Equation
      let bmr = gender === 'male'
        ? (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) + 5
        : (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears) - 161;

      // Activity multiplier
      const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
      };

      const totalCalories = bmr * multipliers[activityLevel as keyof typeof multipliers];
      setCalories(Math.round(totalCalories));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health & Fitness Tools</h1>
          <p className="text-xl text-gray-600">
            Calculate your BMI, daily calorie needs, and more with our health calculators.
          </p>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BMI Calculator */}
          <Calculator
            title="BMI Calculator"
            description="Calculate your Body Mass Index (BMI) to check if you're a healthy weight."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter height"
                />
              </div>
              <button
                onClick={calculateBMI}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
              >
                Calculate BMI
              </button>
              {bmi !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-lg font-semibold">Your BMI: {bmi}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {bmi < 18.5
                      ? 'Underweight'
                      : bmi < 25
                      ? 'Normal weight'
                      : bmi < 30
                      ? 'Overweight'
                      : 'Obese'}
                  </p>
                </div>
              )}
            </div>
          </Calculator>

          {/* Calorie Calculator */}
          <Calculator
            title="Calorie Calculator"
            description="Calculate your daily calorie needs based on your activity level."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 times/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 times/week)</option>
                  <option value="active">Active (exercise 6-7 times/week)</option>
                  <option value="veryActive">Very Active (hard exercise daily)</option>
                </select>
              </div>
              <button
                onClick={calculateCalories}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
              >
                Calculate Calories
              </button>
              {calories !== null && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-lg font-semibold">
                    Daily Calorie Needs: {calories} calories
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    This is your estimated maintenance calories. For weight loss, consume 500
                    calories less. For weight gain, add 500 calories.
                  </p>
                </div>
              )}
            </div>
          </Calculator>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use These Tools</h2>
          <div className="prose prose-lg max-w-none">
            <p>
              Our health calculators are designed to help you make informed decisions about
              your health and fitness journey. Here's how to use them effectively:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>BMI Calculator:</strong> Enter your weight in kilograms and height
                in centimeters to calculate your BMI. This gives you a general idea of
                whether you're at a healthy weight for your height.
              </li>
              <li>
                <strong>Calorie Calculator:</strong> Input your age, gender, weight,
                height, and activity level to estimate your daily calorie needs. This can
                help you plan your diet whether you want to maintain, lose, or gain
                weight.
              </li>
            </ul>
            <p className="mt-4">
              Remember that these calculations are estimates and should be used as general
              guidelines. For personalized advice, consult with a healthcare professional
              or registered dietitian.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
