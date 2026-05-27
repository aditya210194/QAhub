// HeaderWrapper.js - Alternative approach
import React, { useEffect, useState } from 'react';
import Header from './Header';
import SecondHeader from './SecondHeader';

const HeaderWrapper = () => {
    const [showSecondHeader, setShowSecondHeader] = useState(true);

    // You can add logic here to conditionally show/hide second header
    // based on route or other conditions

    return (
        <>
            <Header />
            {showSecondHeader && <SecondHeader />}
        </>
    );
};

export default HeaderWrapper;