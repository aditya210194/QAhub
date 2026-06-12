import React from 'react';
import ReactMarkdown from 'react-markdown';
import { markdownComponents } from '../utils/rendererUtils';

const TextBlock = ({ block, index }) => {
    return (
        <div key={index} className="text-block mb-4">
            <ReactMarkdown components={markdownComponents}>
                {block.value || block.content}
            </ReactMarkdown>
            {block.subpoints && (
                <ul className="subpoints mt-3 ps-4">
                    {block.subpoints.map((point, i) => (
                        <li key={i}>
                            <ReactMarkdown components={markdownComponents}>
                                {point}
                            </ReactMarkdown>
                        </li>
                    ))}
                </ul>
            )}
            {block.example && (
                <div className="example-block bg-light p-3 rounded mt-3">
                    <strong>{block.example.title}: </strong>
                    <ReactMarkdown components={markdownComponents}>
                        {block.example.content}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default React.memo(TextBlock);