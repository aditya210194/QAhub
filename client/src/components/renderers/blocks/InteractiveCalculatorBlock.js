import React, { useState } from 'react';

const InteractiveCalculatorBlock = ({ block, index }) => {
    const [values, setValues] = useState(() => {
        const initial = {};
        block.fields?.forEach((field, i) => { initial[i] = field.default || 0; });
        return initial;
    });
    const [result, setResult] = useState(null);

    const calculate = () => {
        try {
            const timeSavings = parseFloat(values[0]) || 0;
            const teamSize = parseFloat(values[1]) || 0;
            const hourlyRate = parseFloat(values[2]) || 0;
            const defectsPrevented = parseFloat(values[3]) || 0;
            const costPerDefect = parseFloat(values[4]) || 0;
            const total = (timeSavings * teamSize * hourlyRate * 48) + (defectsPrevented * costPerDefect * 12);
            setResult(total);
        } catch (e) { setResult('Error'); }
    };

    const reset = () => {
        const resetValues = {};
        block.fields?.forEach((field, i) => { resetValues[i] = field.default || 0; });
        setValues(resetValues);
        setResult(null);
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

    return (
        <div className="interactive-calculator card my-4">
            <div className="card-header bg-primary bg-opacity-10"><h5 className="mb-0"><i className="fas fa-calculator me-2"></i>{block.title || "Interactive Calculator"}</h5></div>
            <div className="card-body">
                <div className="row g-3">
                    {block.fields?.map((field, i) => (
                        <div key={i} className="col-md-6">
                            <label className="form-label">{field.label}</label>
                            <input type="number" className="form-control" value={values[i]} onChange={(e) => setValues(prev => ({ ...prev, [i]: parseFloat(e.target.value) || 0 }))} />
                        </div>
                    ))}
                </div>
                <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-primary" onClick={calculate}>Calculate</button>
                    <button className="btn btn-outline-secondary" onClick={reset}>Reset</button>
                </div>
                {result !== null && (
                    <div className="mt-3 p-3 bg-success bg-opacity-10 rounded text-center">
                        <div className="h5 mb-0 text-success">{formatCurrency(result)}</div>
                        <small className="text-muted">Total Annual Value</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(InteractiveCalculatorBlock);