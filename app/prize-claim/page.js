'use client';

import { useState } from 'react';
import HeaderPolicy from '../components/HeaderPolicy';
import Footer from '../components/Footer';
import PrizeClaimForm from '../components/PrizeClaimForm';

export default function PrizeClaimPage() {
    const [showForm, setShowForm] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return ( <
        div className = "min-h-screen bg-white" >
        <
        HeaderPolicy / >

        { /* Hero Section */ } <
        section className = "relative pt-20 pb-24 overflow-hidden" > { /* Background Elements */ } <
        div className = "absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" > < /div> <
        div className = "absolute top-20 left-10 w-72 h-72 bg-yellow-200/30 rounded-full blur-3xl animate-pulse" > < /div> <
        div className = "absolute bottom-10 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse"
        style = {
            { animationDelay: '1s' } } > < /div>

        { /* Floating Trophy Icons */ } <
        div className = "absolute top-32 left-[15%] animate-bounce"
        style = {
            { animationDuration: '3s' } } >
        <
        div className = "w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-12" >
        <
        svg className = "w-6 h-6 text-white"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M5 3h14v2H5V3zm14 4v5c0 2.76-2.24 5-5 5h-1v2h3v2H8v-2h3v-2h-1c-2.76 0-5-2.24-5-5V7H2V3h4v4h12V3h4v4h-3zm-2 0H7v5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V7z" / >
        <
        /svg> <
        /div> <
        /div> <
        div className = "absolute top-48 right-[20%] animate-bounce"
        style = {
            { animationDuration: '2.5s', animationDelay: '0.5s' } } >
        <
        div className = "w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center" >
        <
        svg className = "w-5 h-5 text-white"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" / >
        <
        /svg> <
        /div> <
        /div> <
        div className = "absolute bottom-32 left-[25%] animate-bounce"
        style = {
            { animationDuration: '2.8s', animationDelay: '0.8s' } } >
        <
        div className = "w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg shadow-lg flex items-center justify-center transform -rotate-12" >
        <
        svg className = "w-4 h-4 text-white"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" / >
        <
        /svg> <
        /div> <
        /div>

        <
        div className = "relative max-w-6xl mx-auto px-4" >
        <
        div className = "text-center" > { /* Badge */ } <
        div className = "inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm mb-8" >
        <
        span className = "relative flex h-2.5 w-2.5" >
        <
        span className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" > < /span> <
        span className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" > < /span> <
        /span> <
        span className = "text-sm font-semibold text-amber-700" > Janya Foundation Marathon 2025 < /span> <
        /div>

        { /* Main Title with Trophy */ } <
        div className = "flex items-center justify-center gap-4 mb-6" >
        <
        div className = "hidden sm:flex w-16 h-16 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 rounded-2xl shadow-xl items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform" >
        <
        svg className = "w-9 h-9 text-white"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M5 3h14v2H5V3zm14 4v5c0 2.76-2.24 5-5 5h-1v2h3v2H8v-2h3v-2h-1c-2.76 0-5-2.24-5-5V7H2V3h4v4h12V3h4v4h-3zm-2 0H7v5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V7z" / >
        <
        /svg> <
        /div> <
        h1 className = "text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900" >
        Claim Your { ' ' } <
        span className = "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent" >
        Prize Money <
        /span> <
        /h1> <
        div className = "hidden sm:flex w-16 h-16 bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 rounded-2xl shadow-xl items-center justify-center transform rotate-6 hover:rotate-0 transition-transform" >
        <
        svg className = "w-9 h-9 text-white"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" / >
        <
        /svg> <
        /div> <
        /div>

        <
        p className = "text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed" >
        Congratulations, Champion!You 've earned it. Submit your documents and receive your well-deserved prize money. <
        /p>

        { /* CTA Button */ } <
        button onClick = {
            () => setShowForm(true) }
        className = "group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden" >
        <
        span className = "absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity" > < /span> <
        svg className = "relative w-6 h-6"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" / >
        <
        /svg> <
        span className = "relative" > Submit Your Documents < /span> <
        svg className = "relative w-5 h-5 group-hover:translate-x-1 transition-transform"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M17 8l4 4m0 0l-4 4m4-4H3" / >
        <
        /svg> <
        /button>

        { /* Trust Indicators */ } <
        div className = "flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500" >
        <
        div className = "flex items-center gap-2" >
        <
        svg className = "w-5 h-5 text-green-500"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" / >
        <
        /svg> <
        span > Secure & Encrypted < /span> <
        /div> <
        div className = "flex items-center gap-2" >
        <
        svg className = "w-5 h-5 text-blue-500"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" / >
        <
        /svg> <
        span > 60 - 70 Days Processing < /span> <
        /div> <
        div className = "flex items-center gap-2" >
        <
        svg className = "w-5 h-5 text-purple-500"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" / >
        <
        /svg> <
        span > 24 / 7 Support < /span> <
        /div> <
        /div> <
        /div> <
        /div> <
        /section>

        { /* Timeline Section - How It Works */ } <
        section className = "py-20 px-4 bg-white" >
        <
        div className = "max-w-5xl mx-auto" >
        <
        div className = "text-center mb-16" >
        <
        span className = "inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4" >
        Simple Process <
        /span> <
        h2 className = "text-3xl md:text-4xl font-bold text-gray-900 mb-4" >
        How to Claim Your Prize <
        /h2> <
        p className = "text-gray-600 max-w-xl mx-auto" >
        Follow these simple steps to receive your prize money securely <
        /p> <
        /div>

        { /* Timeline */ } <
        div className = "relative" > { /* Timeline Line */ } <
        div className = "hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400" > < /div>

        {
            [{
                    step: '01',
                    title: 'Fill Your Details',
                    description: 'Enter your personal information including name, contact details, and the race category you participated in.',
                    icon: ( <
                        svg className = "w-7 h-7"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "2"
                        d = "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" / >
                        <
                        /svg>
                    ),
                    color: 'amber',
                },
                {
                    step: '02',
                    title: 'Upload Documents',
                    description: 'Upload clear images of your Age Proof, Aadhar Card, and PAN Card for verification purposes.',
                    icon: ( <
                        svg className = "w-7 h-7"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "2"
                        d = "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" / >
                        <
                        /svg>
                    ),
                    color: 'orange',
                },
                {
                    step: '03',
                    title: 'Verification Process',
                    description: 'Our team will verify your documents within 7-14 working days. You\'ll be notified via email.',
                    icon: ( <
                        svg className = "w-7 h-7"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "2"
                        d = "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" / >
                        <
                        /svg>
                    ),
                    color: 'rose',
                },
                {
                    step: '04',
                    title: 'Receive Prize Money',
                    description: 'After successful verification, your prize money will be credited to your bank account within 60-70 working days.',
                    icon: ( <
                        svg className = "w-7 h-7"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "2"
                        d = "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" / >
                        <
                        /svg>
                    ),
                    color: 'pink',
                },
            ].map((item, index) => ( <
                div key = { index }
                className = { `relative flex items-center mb-12 last:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}` } > { /* Content Card */ } <
                div className = { `flex-1 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}` } >
                <
                div className = { `bg-white p-6 rounded-2xl border-2 border-${item.color}-100 shadow-lg hover:shadow-xl transition-shadow inline-block text-left` } >
                <
                span className = { `inline-block px-3 py-1 bg-${item.color}-100 text-${item.color}-600 text-xs font-bold rounded-full mb-3` } >
                STEP { item.step } <
                /span> <
                h3 className = "text-xl font-bold text-gray-900 mb-2" > { item.title } < /h3> <
                p className = "text-gray-600 text-sm leading-relaxed max-w-sm" > { item.description } < /p> <
                /div> <
                /div>

                { /* Center Icon */ } <
                div className = "hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-amber-400 to-rose-500 rounded-full items-center justify-center text-white shadow-lg z-10" > { item.icon } <
                /div>

                { /* Empty space for alignment */ } <
                div className = "hidden md:block flex-1" > < /div> <
                /div>
            ))
        } <
        /div> <
        /div> <
        /section>

        { /* Required Documents */ } <
        section className = "py-20 px-4 bg-gradient-to-br from-gray-50 to-amber-50/30" >
        <
        div className = "max-w-5xl mx-auto" >
        <
        div className = "text-center mb-14" >
        <
        span className = "inline-block px-4 py-1.5 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full mb-4" >
        Be Prepared <
        /span> <
        h2 className = "text-3xl md:text-4xl font-bold text-gray-900 mb-4" >
        Documents Required <
        /h2> <
        p className = "text-gray-600 max-w-xl mx-auto" >
        Keep these documents ready before starting your submission <
        /p> <
        /div>

        <
        div className = "grid md:grid-cols-3 gap-8" > {
            [{
                    title: 'Age Proof',
                    description: 'Birth Certificate, School ID Card, or any government-issued age proof document',
                    icon: ( <
                        svg className = "w-8 h-8"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "1.5"
                        d = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" / >
                        <
                        /svg>
                    ),
                    gradient: 'from-amber-400 to-yellow-500',
                },
                {
                    title: 'Aadhar Card',
                    description: 'Clear front and back image of your Aadhar Card for identity verification',
                    icon: ( <
                        svg className = "w-8 h-8"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "1.5"
                        d = "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" / >
                        <
                        /svg>
                    ),
                    gradient: 'from-orange-400 to-amber-500',
                },
                {
                    title: 'PAN Card',
                    description: 'Required for tax purposes and prize money transfer to your bank account',
                    icon: ( <
                        svg className = "w-8 h-8"
                        fill = "none"
                        stroke = "currentColor"
                        viewBox = "0 0 24 24" >
                        <
                        path strokeLinecap = "round"
                        strokeLinejoin = "round"
                        strokeWidth = "1.5"
                        d = "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" / >
                        <
                        /svg>
                    ),
                    gradient: 'from-rose-400 to-orange-500',
                },
            ].map((doc, index) => ( <
                div key = { index }
                className = "group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden" >
                { /* Background Glow */ } <
                div className = { `absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${doc.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity` } > < /div>

                <
                div className = { `relative w-16 h-16 bg-gradient-to-br ${doc.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform` } > { doc.icon } <
                /div> <
                h3 className = "text-xl font-bold text-gray-900 mb-3" > { doc.title } < /h3> <
                p className = "text-gray-600 leading-relaxed" > { doc.description } < /p>

                { /* Check mark */ } <
                div className = "absolute top-6 right-6 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" >
                <
                svg className = "w-4 h-4 text-green-600"
                fill = "none"
                stroke = "currentColor"
                viewBox = "0 0 24 24" >
                <
                path strokeLinecap = "round"
                strokeLinejoin = "round"
                strokeWidth = "2"
                d = "M5 13l4 4L19 7" / >
                <
                /svg> <
                /div> <
                /div>
            ))
        } <
        /div>

        { /* Important Note */ } <
        div className = "mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-xl" >
        <
        div className = "flex flex-col md:flex-row items-start md:items-center gap-6" >
        <
        div className = "w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0" >
        <
        svg className = "w-7 h-7 text-white"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" / >
        <
        /svg> <
        /div> <
        div >
        <
        h4 className = "font-bold text-white text-lg mb-2" > Important Guidelines < /h4> <
        ul className = "text-blue-100 space-y-1 text-sm" >
        <
        li className = "flex items-center gap-2" >
        <
        svg className = "w-4 h-4 flex-shrink-0"
        fill = "currentColor"
        viewBox = "0 0 24 24" > < path d = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" / > < /svg>
        Files should be in JPG, PNG, or PDF format <
        /li> <
        li className = "flex items-center gap-2" >
        <
        svg className = "w-4 h-4 flex-shrink-0"
        fill = "currentColor"
        viewBox = "0 0 24 24" > < path d = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" / > < /svg>
        Maximum file size: 5 MB per document <
        /li> <
        li className = "flex items-center gap-2" >
        <
        svg className = "w-4 h-4 flex-shrink-0"
        fill = "currentColor"
        viewBox = "0 0 24 24" > < path d = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" / > < /svg>
        Ensure all documents are clearly visible and not blurry <
        /li> <
        li className = "flex items-center gap-2" >
        <
        svg className = "w-4 h-4 flex-shrink-0"
        fill = "currentColor"
        viewBox = "0 0 24 24" > < path d = "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" / > < /svg>
        Your documents are handled with strict confidentiality <
        /li> <
        /ul> <
        /div> <
        /div> <
        /div> <
        /div> <
        /section>

        { /* FAQ Section */ } <
        section className = "py-20 px-4 bg-white" >
        <
        div className = "max-w-3xl mx-auto" >
        <
        div className = "text-center mb-14" >
        <
        span className = "inline-block px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-semibold rounded-full mb-4" >
        Got Questions ?
        <
        /span> <
        h2 className = "text-3xl md:text-4xl font-bold text-gray-900 mb-4" >
        Frequently Asked Questions <
        /h2> <
        p className = "text-gray-600" >
        Find answers to common questions about the prize claim process <
        /p> <
        /div>

        <
        div className = "space-y-4" > {
            [{
                    question: 'How long does the verification process take?',
                    answer: 'The verification process typically takes 7-14 working days. You will be notified via email once your documents are verified. Our team carefully reviews each submission to ensure accuracy.',
                },
                {
                    question: 'When will I receive my prize money?',
                    answer: 'After successful verification, your prize money will be credited to your bank account within 60-70 working days. The exact timeline may vary based on banking procedures and document verification.',
                },
                {
                    question: 'What if my documents are rejected?',
                    answer: 'If there are any issues with your documents, we will contact you via email or phone to request corrected documents. Common issues include blurry images, incomplete information, or mismatched details.',
                },
                {
                    question: 'Can I update my submitted documents?',
                    answer: 'Yes, you can submit a new claim with corrected documents. Contact us at janyafoundation.04@gmail.com for assistance. Our support team is available to help you through the process.',
                },
                {
                    question: 'Is my personal information secure?',
                    answer: 'Absolutely! We use industry-standard encryption to protect your data. Your documents are stored securely and are only accessed by authorized personnel for verification purposes.',
                },
            ].map((faq, index) => ( <
                div key = { index }
                className = { `bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  openFaq === index ? 'border-amber-400 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                }` } >
                <
                button onClick = {
                    () => toggleFaq(index) }
                className = "w-full flex items-center justify-between p-6 text-left" >
                <
                span className = "font-semibold text-gray-900 pr-8" > { faq.question } < /span> <
                div className = { `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    openFaq === index ? 'bg-amber-500 text-white rotate-180' : 'bg-gray-100 text-gray-600'
                  }` } >
                <
                svg className = "w-5 h-5"
                fill = "none"
                stroke = "currentColor"
                viewBox = "0 0 24 24" >
                <
                path strokeLinecap = "round"
                strokeLinejoin = "round"
                strokeWidth = "2"
                d = "M19 9l-7 7-7-7" / >
                <
                /svg> <
                /div> <
                /button> <
                div className = { `transition-all duration-300 overflow-hidden ${openFaq === index ? 'max-h-48' : 'max-h-0'}` } >
                <
                p className = "px-6 pb-6 text-gray-600 leading-relaxed" > { faq.answer } < /p> <
                /div> <
                /div>
            ))
        } <
        /div> <
        /div> <
        /section>

        { /* CTA Section */ } <
        section className = "py-20 px-4 relative overflow-hidden" > { /* Background */ } <
        div className = "absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500" > < /div> <
        div className = "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" > < /div>

        { /* Floating Elements */ } <
        div className = "absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl" > < /div> <
        div className = "absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" > < /div>

        <
        div className = "relative max-w-4xl mx-auto text-center" >
        <
        div className = "inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-full mb-8" >
        <
        svg className = "w-10 h-10 text-white"
        fill = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path d = "M5 3h14v2H5V3zm14 4v5c0 2.76-2.24 5-5 5h-1v2h3v2H8v-2h3v-2h-1c-2.76 0-5-2.24-5-5V7H2V3h4v4h12V3h4v4h-3zm-2 0H7v5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V7z" / >
        <
        /svg> <
        /div>

        <
        h2 className = "text-3xl md:text-5xl font-bold text-white mb-6" >
        Ready to Claim Your Prize ?
        <
        /h2> <
        p className = "text-xl text-white/90 mb-10 max-w-2xl mx-auto" >
        You 've worked hard for this achievement. Submit your documents now and receive your prize money within 60-70 working days. <
        /p>

        <
        button onClick = {
            () => setShowForm(true) }
        className = "group inline-flex items-center gap-3 px-10 py-5 bg-white text-orange-600 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1" >
        <
        svg className = "w-6 h-6"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" / >
        <
        /svg>
        Submit Documents Now <
        svg className = "w-5 h-5 group-hover:translate-x-1 transition-transform"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M17 8l4 4m0 0l-4 4m4-4H3" / >
        <
        /svg> <
        /button>

        { /* Contact Info */ } <
        div className = "mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80" >
        <
        a href = "mailto:janyafoundation.04@gmail.com"
        className = "flex items-center gap-2 hover:text-white transition-colors" >
        <
        svg className = "w-5 h-5"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" / >
        <
        /svg>
        janyafoundation .04 @gmail.com <
        /a> <
        span className = "hidden sm:block w-1.5 h-1.5 bg-white/50 rounded-full" > < /span> <
        a href = "tel:+919321496142"
        className = "flex items-center gap-2 hover:text-white transition-colors" >
        <
        svg className = "w-5 h-5"
        fill = "none"
        stroke = "currentColor"
        viewBox = "0 0 24 24" >
        <
        path strokeLinecap = "round"
        strokeLinejoin = "round"
        strokeWidth = "2"
        d = "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" / >
        <
        /svg> +
        91 93214 96142 <
        /a> <
        /div> <
        /div> <
        /section>

        <
        Footer / >

        { /* Prize Claim Form Modal */ } {
            showForm && < PrizeClaimForm onClose = {
                () => setShowForm(false) }
            />} <
            /div>
        );
    }