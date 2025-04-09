
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Question {
  id: number;
  text: string;
  options: Array<{
    id: string;
    text: string;
    value: number;
  }>;
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is the approximate square footage of your rooftop?",
    options: [
      { id: "small", text: "Small (less than 500 sq ft)", value: 500 },
      { id: "medium", text: "Medium (500-1000 sq ft)", value: 1000 },
      { id: "large", text: "Large (more than 1000 sq ft)", value: 1500 }
    ]
  },
  {
    id: 2,
    text: "How much sunlight does your property receive?",
    options: [
      { id: "low", text: "Minimal (lots of shade)", value: 0.7 },
      { id: "medium", text: "Average (partial sun)", value: 1 },
      { id: "high", text: "Abundant (full sun most of the day)", value: 1.3 }
    ]
  },
  {
    id: 3,
    text: "What's your average internet speed?",
    options: [
      { id: "slow", text: "Basic (less than 100 Mbps)", value: 50 },
      { id: "medium", text: "Fast (100-500 Mbps)", value: 150 },
      { id: "fast", text: "Very Fast (500+ Mbps)", value: 300 }
    ]
  }
];

const hourlyData = [
  { hour: '6 AM', solar: 10, network: 5 },
  { hour: '8 AM', solar: 35, network: 15 },
  { hour: '10 AM', solar: 65, network: 25 },
  { hour: '12 PM', solar: 90, network: 40 },
  { hour: '2 PM', solar: 80, network: 45 },
  { hour: '4 PM', solar: 50, network: 40 },
  { hour: '6 PM', solar: 20, network: 30 },
  { hour: '8 PM', solar: 0, network: 25 },
];

const monthlyData = [
  { name: 'Jan', earnings: 840 },
  { name: 'Feb', earnings: 940 },
  { name: 'Mar', earnings: 1020 },
  { name: 'Apr', earnings: 1120 },
  { name: 'May', earnings: 1240 },
  { name: 'Jun', earnings: 1340 },
  { name: 'Jul', earnings: 1380 },
  { name: 'Aug', earnings: 1320 },
  { name: 'Sep', earnings: 1160 },
  { name: 'Oct', earnings: 1080 },
  { name: 'Nov', earnings: 940 },
  { name: 'Dec', earnings: 840 },
];

const EarningsQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [earningEstimate, setEarningEstimate] = useState({ monthly: 0, yearly: 0 });
  
  const handleAnswer = (questionId: number, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate potential earnings
      calculateEarnings();
      setIsCompleted(true);
    }
  };
  
  const calculateEarnings = () => {
    // This is a simplified mock calculation
    let baseRooftopValue = 0;
    let sunMultiplier = 1;
    let internetValue = 0;
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (!answer) return;
      
      const selectedOption = question.options.find(opt => opt.id === answer);
      if (!selectedOption) return;
      
      if (question.id === 1) { // Rooftop size
        baseRooftopValue = selectedOption.value * 0.07; // $0.07 per sq ft per month
      } else if (question.id === 2) { // Sunlight
        sunMultiplier = selectedOption.value;
      } else if (question.id === 3) { // Internet
        internetValue = selectedOption.value * 0.15; // $0.15 per Mbps per month
      }
    });
    
    const monthlyEstimate = Math.round((baseRooftopValue * sunMultiplier) + internetValue);
    const yearlyEstimate = monthlyEstimate * 12;
    
    setEarningEstimate({
      monthly: monthlyEstimate,
      yearly: yearlyEstimate
    });
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setEarningEstimate({ monthly: 0, yearly: 0 });
  };

  return (
    <section id="quiz-section" className="py-16 md:py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Estimate Your Earning Potential</h2>
        <p className="text-lg text-tiptop-dark/70 max-w-2xl mx-auto">
          Take our quick quiz to get a personalized estimate of how much passive income your property could generate.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-tiptop-accent/20 shadow-lg">
          <CardContent className="pt-6">
            {!isCompleted ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-tiptop-dark/60">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <div className="flex gap-1">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 w-8 rounded-full ${
                          index === currentQuestion
                            ? "bg-tiptop-accent"
                            : index < currentQuestion
                            ? "bg-tiptop-accent/40"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-6">
                  {questions[currentQuestion].text}
                </h3>
                
                <RadioGroup
                  value={answers[questions[currentQuestion].id] || ""}
                  onValueChange={(value) => 
                    handleAnswer(questions[currentQuestion].id, value)
                  }
                  className="space-y-3 mb-8"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <RadioGroupItem
                        value={option.id}
                        id={`option-${option.id}`}
                        className="border-tiptop-accent text-tiptop-accent"
                      />
                      <Label 
                        htmlFor={`option-${option.id}`}
                        className="pl-2 flex-1 cursor-pointer py-3"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                <Button
                  onClick={handleNext}
                  disabled={!answers[questions[currentQuestion].id]}
                  className="w-full bg-tiptop-accent hover:bg-tiptop-accent/90"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      Next Question <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Calculate My Earnings"
                  )}
                </Button>
              </>
            ) : (
              <div className="py-4">
                <div className="flex items-center justify-center bg-tiptop-light rounded-full w-16 h-16 mx-auto mb-4">
                  <Check className="h-8 w-8 text-tiptop-accent" />
                </div>
                
                <h3 className="text-2xl font-bold text-center mb-2">
                  Your Estimated Earnings
                </h3>
                
                <p className="text-center mb-8 text-tiptop-dark/70">
                  Based on your answers, here's what your property could earn:
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-tiptop-light rounded-lg p-4 text-center">
                    <p className="text-sm font-medium mb-1">Monthly</p>
                    <h4 className="text-2xl font-bold text-tiptop-accent">
                      ${earningEstimate.monthly}
                    </h4>
                  </div>
                  <div className="bg-tiptop-light rounded-lg p-4 text-center">
                    <p className="text-sm font-medium mb-1">Yearly</p>
                    <h4 className="text-2xl font-bold text-tiptop-accent">
                      ${earningEstimate.yearly}
                    </h4>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4 flex items-center">
                    Hourly Earning Potential
                    <HelpCircle className="h-4 w-4 ml-2 text-tiptop-dark/60" />
                  </h4>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="solar" name="Solar (W)" fill="#AA94E2" />
                      <Bar dataKey="network" name="Network (Mbps)" fill="#4A3F68" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4">Annual Earnings Projection</h4>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#AA94E2" 
                        fill="#AA94E2" 
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={resetQuiz}
                    className="border-tiptop-accent text-tiptop-accent hover:bg-tiptop-accent/10"
                  >
                    Take Quiz Again
                  </Button>
                  <Button
                    className="bg-tiptop-accent hover:bg-tiptop-accent/90"
                    onClick={() => document.getElementById('asset-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Start Earning Now
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default EarningsQuiz;
