import React, { useState } from 'react';

const InteractiveQuizBlock = ({ block, index }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const questions = block.questions || [];
    const totalQuestions = questions.length;
    const currentAnswer = userAnswers[currentQuestion];

    const handleAnswerSelect = (answerIndex) => {
        if (quizCompleted) return;
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setUserAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setShowResults(true);
            setQuizCompleted(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setUserAnswers([]);
        setShowResults(false);
        setQuizCompleted(false);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, i) => {
            if (userAnswers[i] === q.correctAnswer) correct++;
        });
        return correct;
    };

    if (!questions.length) return null;

    if (showResults) {
        const score = calculateScore();
        return (
            <div className="quiz-results card my-4">
                <div className="card-header bg-success text-white"><h5 className="mb-0"><i className="fas fa-chart-bar me-2"></i>Quiz Results</h5></div>
                <div className="card-body text-center">
                    <div className="display-4 fw-bold text-success mb-2">{score}/{totalQuestions}</div>
                    <p className="mb-3">You scored {Math.round((score / totalQuestions) * 100)}%</p>
                    <button className="btn btn-primary" onClick={handleReset}>Retake Quiz <i className="fas fa-redo ms-1"></i></button>
                </div>
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="interactive-quiz card my-4 shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <span><i className="fas fa-brain me-2"></i>Quiz</span>
                <span className="badge bg-light text-dark">Question {currentQuestion + 1}/{totalQuestions}</span>
            </div>
            <div className="card-body">
                <div className="progress mb-3" style={{ height: '8px' }}>
                    <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}></div>
                </div>
                <h6 className="mb-3">{q.question}</h6>
                <div className="quiz-options mb-3">
                    {q.options?.map((opt, i) => (
                        <div key={i} className={`p-2 mb-2 border rounded cursor-pointer ${currentAnswer === i ? 'border-primary bg-primary bg-opacity-10' : ''}`} onClick={() => handleAnswerSelect(i)}>
                            <span className="me-2">{String.fromCharCode(65 + i)}.</span>
                            {opt}
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-outline-secondary" onClick={handlePrevious} disabled={currentQuestion === 0}>Previous</button>
                    <button className="btn btn-primary" onClick={handleNext} disabled={currentAnswer === undefined}>{currentQuestion === totalQuestions - 1 ? 'Finish' : 'Next'} <i className="fas fa-arrow-right ms-1"></i></button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(InteractiveQuizBlock);