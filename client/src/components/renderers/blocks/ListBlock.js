import React from 'react';

const ListBlock = ({ block }) => {
    const { items = [], ordered = false, type } = block;

    if (!items.length) return null;

    const ListTag = ordered ? 'ol' : 'ul';

    return (
        <ListTag className={`${type === 'checklist' ? 'list-unstyled' : 'ps-3'} my-3`}>
            {items.map((item, i) => (
                <li key={i} className={type === 'checklist' ? 'mb-2' : ''}>
                    {type === 'checklist' && (
                        <input type="checkbox" className="form-check-input me-2" readOnly />
                    )}
                    {item}
                </li>
            ))}
        </ListTag>
    );
};

export default React.memo(ListBlock);