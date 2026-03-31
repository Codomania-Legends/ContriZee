import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useLocation, useNavigate } from 'react-router';
import Xarrow, { useXarrow } from 'react-xarrows'; 
import { useUser } from '../UserContext';
import { sileo } from 'sileo';
import QRCode from 'qrcode';

const colors = ["#C599B6", "#eff7f6" ,"#50E3C2", "#B8E986", "#ff8fab", "#d5bdaf", "#a2d2ff", "#cdb4db", "#e4c1f9"];

<<<<<<< HEAD
=======
const CustomTriangleHead = () => (
    <svg viewBox="0 0 20 20">
        <polygon points="0,10 20,10 10,0" fill="green" />
    </svg>
);

>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e
function Settlement({openRouter}) { 
    const updateArrow = useXarrow();
    const { members, expenses } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [showOptions, setShowOptions] = useState(null);
    const [exportFormat, setExportFormat] = useState("Quick ContriZee update: Hey [Payee], you're down ₹[Amount] for the latest bill. 💸 Hit me up when you've sent it so I can mark it settled! 📱⚡");
    const navigate = useNavigate();

    // 1. Debounced Window Resize to prevent rapid-fire re-renders
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth > 768 ? 600 : 350,
        radius: window.innerWidth > 768 ? 220 : 120,
        nodeSize: window.innerWidth > 768 ? 120 : 80
    });

    useEffect(() => {
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const isDesktop = window.innerWidth > 768;
                setDimensions({
                    width: isDesktop ? 600 : 350,
                    radius: isDesktop ? 220 : 120,
                    nodeSize: isDesktop ? 120 : 80
                });
<<<<<<< HEAD
            }, 150); // Waits 150ms after resizing stops to update state
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    const center = dimensions.width / 2;

    // 2. Fetch logic remains the same
    useEffect( () => {
        // ... (Keep your existing OpenRouter fetch logic here if you uncomment it)
=======
                setExportFormat(res.choices[0].message.content);
                sileo.success({description : "Dynamic Text Generated Successfully! 🤖", title: "Success"})
            } catch (error) {
                console.log(error)
                sileo.info({description : "Default Text Used 📝", title: "Info"})
            }
        }
        // Genarate_Text();
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e
    } , [] )

    // 3. Optimize splitExpenses calculation
    useEffect(() => {
        if (members.length > 0) {
            const Details = {
                members: members.map(m => m.name),
                expenses: expenses
            };
            const result = splitExpenses(Details);
            setTransactions(result.transactions);
        }
    }, [members, expenses]);

<<<<<<< HEAD
    useGSAP(() => {
        if (showOptions !== null) {
            gsap.fromTo(".options-popup", 
                { opacity: 0, scale: 0.8, y: 10 }, 
                { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
            );
        }
    }, [showOptions]);

    const handleSettle = useCallback((index) => {
        setTransactions(prev => prev.filter((_, i) => i !== index));
        setShowOptions(null);
        sileo.success("Transaction marked as Settled! ✅");
    }, []);
=======
    const handleSettle = (index) => {
        const newTransactions = [...transactions];
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        setShowOptions(null);
        sileo.success("Transaction marked as Settled! ✅");
    };
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e

    const handleAsk = useCallback((item) => {
        const text = exportFormat.replace("[Payee]", item.from).replace("[Amount]", item.amount.toFixed(2));
        navigator.clipboard.writeText(text);
        sileo.success(`Request copied for ${item.from}! 📋`);
        setShowOptions(null);
<<<<<<< HEAD
    }, [exportFormat]);
=======
    };

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth > 768 ? 600 : 350,
        radius: window.innerWidth > 768 ? 220 : 120,
        nodeSize: window.innerWidth > 768 ? 120 : 80
    });

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth > 768;
            setDimensions({
                width: isDesktop ? 600 : 350,
                radius: isDesktop ? 220 : 120, 
                nodeSize: isDesktop ? 120 : 80
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const center = dimensions.width / 2;
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e

    // 4. State for QR Code
    const [qr_data , setQR_data] = useState({
        upi_id: '',
        amount: '',
        name: '',
        for : ""
    })
    const canvas_ref = useRef(null)

<<<<<<< HEAD
    const generateQR = useCallback(() => {
        if(!qr_data.upi_id){
            sileo.error({description : "Please fill all the fields", title: "Error"})
=======
    const generateQR = () => {
        if( !qr_data.upi_id ){
            sileo.error({description : "Please fill all the fields 🛑", title: "Error"})
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e
            return
        }
        const data = `upi://pay?pa=${qr_data.upi_id}&pn=${qr_data.name}&am=${qr_data.amount}`
        QRCode.toCanvas(canvas_ref.current, data, {width: 200}, (error) => {
            if (error) sileo.error({description : "Error Generating QR Code 🚨", title: "Error"})
            else sileo.success({description : "QR Code Generated Successfully! 📱", title: "Success"})
        })
    }, [qr_data]);


    // 🔥 THE MAGIC FIX: Memoize the nodes so typing in the UPI input doesn't recalculate the math!
    const memoizedNodes = useMemo(() => {
        return members.map((m, index) => {
            const angle = (index / members.length) * 2 * Math.PI;
            const x = center + dimensions.radius * Math.cos(angle) - (dimensions.nodeSize / 2);
            const y = center + dimensions.radius * Math.sin(angle) - (dimensions.nodeSize / 2);

            const pendingTransactionIdx = transactions.findIndex(t => t.from === m.name);
            const pendingTransaction = transactions[pendingTransactionIdx];
            const color = colors[index % colors.length];

            return (
                <div 
                    id={m.name} 
                    key={m.name}
                    onClick={() => pendingTransaction ? setShowOptions(showOptions === index ? null : index) : null}
                    style={{ 
                        left: `${x}px`, top: `${y}px`, 
                        width: `${dimensions.nodeSize}px`, height: `${dimensions.nodeSize}px`,
                        backgroundColor: color, color: color 
                    }}
                    className={`absolute flex items-center justify-center rounded-full small-box-shadow font-bold z-20 overflow-visible shadow-lg transition-all duration-300 ${pendingTransaction ? 'cursor-pointer' : 'cursor-default'}`}
                >
                    {showOptions === index && (
                        <div className="options-popup absolute -top-20 md:-top-[90px] left-1/2 -translate-x-1/2 flex flex-col gap-1 md:gap-2 z-[999]">
                            <button onClick={(e) => { e.stopPropagation(); handleAsk(pendingTransaction); }} className="bg-blue-500 text-white text-[9px] md:text-[11px] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl whitespace-nowrap">
                                📩 Ask
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleSettle(pendingTransactionIdx); }} className="bg-green-600 text-white text-[9px] md:text-[11px] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl whitespace-nowrap">
                                ✅ Settle
                            </button>
                        </div>
                    )}
                    <div className="flex flex-col items-center justify-center scale-75 md:scale-100">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-1">
                            {m.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[10px] md:text-xs text-black truncate max-w-[60px] md:max-w-none">
                            {m.name}
                        </span>
                    </div>
                </div>
            );
        });
    }, [members, dimensions, transactions, showOptions, handleAsk, handleSettle, center]);

    // 🔥 THE MAGIC FIX: Memoize the heavy Xarrows so they only redraw when a transaction is settled or screen is resized
    const memoizedArrows = useMemo(() => {
        return transactions.map((item, index) => {
            const fromIndex = members.findIndex(m => m.name === item.from);
            const toIndex = members.findIndex(m => m.name === item.to);
            const isRightSide = fromIndex < toIndex;

            return (
                <Xarrow
                    updateArrow={updateArrow}
                    key={`${item.from}-${item.to}-${index}`}
                    start={item.from} end={item.to}
                    path="smooth" curviness={0.8} color="#4ade80" strokeWidth={2} animateDrawing={1.2}
                    dashness={{ strokeLen: 6, nonStrokeLen: 6, animation: true }}
                    labels={{
                        [isRightSide ? "end" : "start"]: (
                            <div style={{ transform: "translateY(-10px)" }} className="bg-white px-3 py-1 rounded-full border border-green-500 text-xs font-bold text-green-700 shadow-md">
                                ₹{item.amount.toFixed(2)}
                            </div>
                        )
                    }}
                    headSize={6} showHead={true}
                />
            );
        });
    }, [transactions, members, updateArrow]);


    return (
        <div className="p-10 font-sans w-full flex flex-col items-center justify-center relative min-h-screen">
<<<<<<< HEAD
            {/* Header */}
            <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-black px-8 transition-colors">← Back</button>
                <h2 className="text-2xl px-8 font-bold text-center m-0">Settlement Plan 💸</h2>
                <div className="w-[50px]"></div>
            </div>

            {/* Circular Graph Area */}
            <div className="relative z-10 touch-none" style={{ width: `${dimensions.width}px`, height: `${dimensions.width}px` }}>
                {memoizedNodes}
                {memoizedArrows}
            </div>

            {/* Summary List Area */}
            <div className="mt-12 bg-[#d3d3d3] p-5 big-box-shadow rounded-2xl w-full shadow-inner max-w-2xl">
=======
            <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto w-full">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-black px-4 transition-colors">
                    ← Back 🔙
                </button>
                <h2 className="text-2xl px-4 font-bold text-center m-0">Settlement Plan 💸</h2>
                <div className="w-[50px]"></div>
            </div>

            <div 
                className="relative z-10 touch-none" 
                style={{ width: `${dimensions.width}px`, height: `${dimensions.width}px` }}
            >
                {members.map((m, index) => {
                    const angle = (index / members.length) * 2 * Math.PI;
                    const x = center + dimensions.radius * Math.cos(angle) - (dimensions.nodeSize / 2);
                    const y = center + dimensions.radius * Math.sin(angle) - (dimensions.nodeSize / 2);

                    const pendingTransactionIdx = transactions.findIndex(t => t.from === m.name);
                    const pendingTransaction = transactions[pendingTransactionIdx];
                    const color = colors[index % colors.length];

                    return (
                        <div 
                            id={m.name} 
                            key={m.name}
                            onClick={() => pendingTransaction ? setShowOptions(showOptions === index ? null : index) : null}
                            style={{ 
                                left: `${x}px`, 
                                top: `${y}px`, 
                                width: `${dimensions.nodeSize}px`, 
                                height: `${dimensions.nodeSize}px`,
                                backgroundColor: color, 
                                color: color,
                                position: 'absolute'
                            }}
                            className={`flex items-center justify-center rounded-full small-box-shadow font-bold z-20 overflow-visible transition-all duration-300 ${pendingTransaction ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
                        >
                            {showOptions === index && (
                                <div className="options-popup absolute -top-20 md:-top-[90px] left-1/2 -translate-x-1/2 flex flex-col gap-1 md:gap-2 z-[999]">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAsk(pendingTransaction); }}
                                        className="bg-blue-500 text-white text-[9px] md:text-[11px] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl whitespace-nowrap active:scale-95 transition-transform"
                                    >
                                        📩 Ask
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleSettle(pendingTransactionIdx); }}
                                        className="bg-green-600 text-white text-[9px] md:text-[11px] px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl whitespace-nowrap active:scale-95 transition-transform"
                                    >
                                        ✅ Settle
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-col items-center justify-center scale-75 md:scale-100">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-1">
                                    {m.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[10px] md:text-xs text-black truncate max-w-[60px] md:max-w-none">
                                    {m.name}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {transactions.map((item, index) => {
                    const fromIndex = members.findIndex(m => m.name === item.from);
                    const toIndex = members.findIndex(m => m.name === item.to);
                    const isRightSide = fromIndex < toIndex;

                    return (
                        <Xarrow
                            updateArrow={updateArrow}
                            key={`${item.from}-${item.to}-${index}`}
                            start={item.from}
                            end={item.to}
                            path="smooth"
                            curviness={0.8}
                            color="#4ade80"
                            strokeWidth={2}
                            animateDrawing={false} 
                            dashness={{
                                strokeLen: 6,
                                nonStrokeLen: 6,
                                animation: true
                            }}
                            labels={{
                                [isRightSide ? "end" : "start"]: (
                                    <div
                                        style={{ transform: "translateY(-10px)" }}
                                        className="bg-white px-3 py-1 rounded-full border border-green-500 text-xs font-bold text-green-700 shadow-md"
                                    >
                                        ₹{item.amount.toFixed(2)}
                                    </div>
                                )
                            }}
                            headSize={6}
                            showHead={true}
                        />
                    );
                })}
            </div>

            <div className="mt-12 bg-[#d3d3d3] p-5 big-box-shadow rounded-2xl w-full max-w-lg shadow-inner">
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e
                <h3 className="font-bold mb-3">Active Debts 📋</h3>
                {transactions.length === 0 ? (
                    <p className="text-green-600 font-medium">Everyone is square! No debts found. ✨</p>
                ) : (
                    transactions.map((item, idx) => (
<<<<<<< HEAD
                        <div key={idx} className="flex justify-between items-center py-2 border-b-2 solid border-gray-100 last:border-0">
=======
                        <div key={`${item.from}-${item.to}`} className="flex justify-between items-center py-2 border-b-2 solid border-gray-100 last:border-none">
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e
                            <span><b className="font-bold">{item.from}</b> owes <b className="font-bold">{item.to}</b>: ₹{item.amount.toFixed(2)}</span>
                            <button 
                                onClick={() => handleSettle(idx)}
                                className="text-xs bg-white border border-green-500 text-green-600 px-3 py-1 rounded-md hover:bg-green-50 active:scale-95 transition-all"
                            >
                                Settle ✅
                            </button>
                        </div>
                    ))
                )}
            </div>

<<<<<<< HEAD
            {/* QR Generation Area */}
            <div className="mt-8 flex flex-col items-center gap-4 max-w-xl w-full">
                <input 
                    className="border-2 border-gray-300 p-2 rounded-lg w-full outline-none focus:border-green-500 transition-colors"
                    value={qr_data.upi_id} 
                    onChange={(e) => setQR_data({...qr_data, upi_id: e.target.value})} 
                    placeholder='Enter your UPI ID here...'
                />
                
                <div className="flex flex-wrap gap-2 justify-center">
                    {transactions.map((item, idx) => (
                        <button 
                            className="bg-gray-800 text-white text-xs px-4 py-2 rounded-lg hover:bg-black transition-colors"
                            key={idx} 
                            onClick={() => {
                                setQR_data({...qr_data, amount: item.amount, for: item.from, name: item.to});
                                setTimeout(generateQR, 100); // Small delay to ensure state sets before canvas draws
                            }}>
                            Generate QR: {item.from} pays {item.to}
                        </button>
                    ))}
                </div>

                <div className='flex flex-col items-center justify-center mt-4 bg-white p-4 rounded-xl shadow-md min-w-[250px] min-h-[250px]'>
                    {qr_data.for && (
                        <div className="text-center mb-2">
                            <span className="text-xs text-gray-500">QR generated for {qr_data.for}</span>
                            <h4 className="font-bold text-sm">Scan to pay ₹{parseFloat(qr_data.amount).toFixed(2)}</h4>
                        </div>
                    )}
                    <canvas ref={canvas_ref} id='qr-code'></canvas>
                </div>
            </div>

            <style>
                {`
                    .small-box-shadow { box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease; }
                    .small-box-shadow:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
                `}
            </style>
=======
            <div className="mt-10 bg-white p-6 rounded-2xl small-box-shadow w-full max-w-lg">
                <h3 className="font-bold mb-4 text-center">Fast Pay via UPI ⚡</h3>
                <input 
                    value={qr_data.upi_id} 
                    onChange={(e) => setQR_data({...qr_data, upi_id: e.target.value})} 
                    placeholder='Enter Receiver UPI ID (e.g. name@okhdfc)'
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 mb-4 outline-none focus:border-[#C599B6] transition-colors"
                />
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {transactions.map((item, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => {
                                setQR_data({...qr_data, amount: item.amount, for: item.from})
                                setTimeout(generateQR, 100); 
                            }}
                            className="bg-[#C599B6] text-white text-xs px-4 py-2 rounded-full hover:bg-[#8f577c] transition-colors shadow-md"
                        >
                            QR for {item.from} 👉 {item.to}
                        </button>
                    ))}
                </div>
                
                <div className='flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-100'>
                    {qr_data.for ? (
                        <>
                            <span className="text-sm text-gray-500 font-medium mb-1">QR code for <b className="text-black">{qr_data.for}</b> 📸</span>
                            <h4 className="text-sm font-bold mb-4">Scan to pay <span className="text-green-600">₹{qr_data.amount}</span> 💸</h4>
                        </>
                    ) : (
                        <span className="text-sm text-gray-400 italic mb-4">Select a transaction above to generate QR 👆</span>
                    )}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                        <canvas ref={canvas_ref} id='qr-code' className="w-[200px] h-[200px]"></canvas>
                    </div>
                </div>
            </div>
>>>>>>> 75add87703cb4349ff84b0096a9fa577ca86682e
        </div>
    );
}

export default Settlement;