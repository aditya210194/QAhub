import React, { useState } from 'react';

const QuizBlock = ({ block, index }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const checkAnswer = () => {
        if (selectedAnswer === null) return;
        const correct = selectedAnswer === block.correctAnswer;
        setIsCorrect(correct);
        setShowExplanation(true);
    };

    const resetQuiz = () => {
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsCorrect(false);
    };

    const getOptionClass = (optionIndex) => {
        if (!showExplanation) return selectedAnswer === optionIndex ? 'border-primary bg-primary bg-opacity-10' : '';
        if (optionIndex === block.correctAnswer) return 'border-success bg-success bg-opacity-10';
        if (optionIndex === selectedAnswer && !isCorrect) return 'border-danger bg-danger bg-opacity-10';
        return '';
    };

    const getOptionIcon = (optionIndex) => {
        if (!showExplanation) return selectedAnswer === optionIndex ? '🔵' : '⚪';
        if (optionIndex === block.correctAnswer) return '✅';
        if (optionIndex === selectedAnswer && !isCorrect) return '❌';
        return '⚪';
    };

    return (
        <div className="interactive-quiz card my-4 shadow-sm">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0"><i className="fas fa-brain me-2"></i>{block.title || "Knowledge Check"}</h5>
            </div>
            <div className="card-body">
                <h6 className="question-text mb-3">{block.question}</h6>
                <div className="quiz-options mb-3">
                    {block.options?.map((option, i) => (
                        <div key={i} className={`quiz-option p-2 mb-2 border rounded cursor-pointer ${getOptionClass(i)}`} onClick={() => !showExplanation && setSelectedAnswer(i)}>
                            <span className="option-icon me-2">{getOptionIcon(i)}</span>
                            <span className="option-text">{option}</span>
                        </div>
                    ))}
                </div>
                <div className="quiz-actions">
                    {!showExplanation ? (
                        <button className="btn btn-primary" onClick={checkAnswer} disabled={selectedAnswer === null}>Check Answer</button>
                    ) : (
                        <button className="btn btn-outline-secondary" onClick={resetQuiz}>Try Again <i className="fas fa-redo ms-1"></i></button>
                    )}
                </div>
                {showExplanation && block.explanation && (
                    <div className={`quiz-explanation mt-3 p-3 rounded ${isCorrect ? 'alert-success' : 'alert-danger'}`}>
                        <strong>{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</strong>
                        <p className="mb-0 mt-1">{block.explanation}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(QuizBlock);