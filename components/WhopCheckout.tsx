'use client';

import React from 'react';
import Script from 'next/script';
import { Button } from './ui/button';

interface WhopCheckoutProps {
    planId: string;
    buttonText?: string;
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'whop-checkout': any;
        }
    }
}

export default function WhopCheckout({
    planId,
    buttonText = "Upgrade Now",
    className,
    variant = 'default'
}: WhopCheckoutProps) {
    return (
        <>
            <Script src="https://whop.com/checkout.js" strategy="lazyOnload" />

            {/* Whop Checkout Widget requires the element to be present */}
            <whop-checkout plan={planId} style={{ display: 'none' }} id={`checkout-${planId}`} />

            <Button
                onClick={() => {
                    const el = document.getElementById(`checkout-${planId}`);
                    if (el && 'open' in el) {
                        (el as any).open();
                    } else {
                        // Fallback to direct link if widget fails to load
                        window.open(`https://whop.com/checkout/${planId}`, '_blank');
                    }
                }}
                className={className}
                variant={variant}
            >
                {buttonText}
            </Button>
        </>
    );
}
