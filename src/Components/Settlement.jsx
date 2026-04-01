import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useNavigate } from 'react-router';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows'; 
import { useUser } from '../UserContext';
import { sileo } from 'sileo';
import QRCode from 'qrcode';

const colors = ["#C599B6", "#eff7f6" ,"#50E3C2", "#B8E986", "#ff8fab", "#d5bdaf", "#a2d2ff", "#cdb4db", "#e4c1f9"];

function Settlement({openRouter}) { 
    // --- CONSOLIDATED DIMENSIONS (Fixed the double declaration error) ---
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth > 768 ? 600 : 350,
        radius: window.innerWidth > 768 ? 220 : 120,
        nodeSize: window.innerWidth > 768 ? 120 : 80
    });

    const updateArrow = useXarrow();

    useEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const isDesktop = window.innerWidth > 768;
                setDimensions({
                    width: isDesktop ? 600 : 350,
                    radius: isDesktop ? 220 : 120, 
                    nodeSize: isDesktop ? 120 : 80
                });
                updateArrow();
            }, 150);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [updateArrow]);

    const center = dimensions.width / 2;
    const { members, expenses } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [showOptions, setShowOptions] = useState(null);
    const [exportFormat, setExportFormat] = useState("Quick ContriZee update: Hey [Payee], you're down ₹[Amount] for the latest bill. 💸 Hit me up when you've sent it so I can mark it settled! 📱⚡");
    const navigate = useNavigate();
    
    // Data processing logic
    const membersHash = JSON.stringify(members);
    const expensesHash = JSON.stringify(expenses);

    useEffect(() => {
        if (members?.length > 0) {
            const Details = {
                members: members.map(m => m.name),
                expenses: expenses || []
            };
            const result = splitExpenses(Details);
            setTransactions(result.transactions);
        }
    }, [membersHash, expensesHash]);

    const handleSettle = useCallback((index) => {
        setTransactions(prev => prev.filter((_, i) => i !== index));
        setShowOptions(null);
        sileo.success("Transaction marked as Settled! ✅");
    }, []);

    const handleAsk = useCallback((item) => {
        const text = exportFormat.replace("[Payee]", item.from).replace("[Amount]", item.amount.toFixed(2));
        navigator.clipboard.writeText(text);
        sileo.success(`Request copied for ${item.from}! 📋`);
        setShowOptions(null);
    }, [exportFormat]);

    const [qr_data, setQR_data] = useState({ upi_id: '', amount: '', name: '', for: "" });
    const canvas_ref = useRef(null);

    const generateQR = useCallback(() => {
        if (!qr_data.upi_id) {
            sileo.error({description : "Please fill all the fields 🛑", title: "Error"});
            return;
        }
        const data = `upi://pay?pa=${qr_data.upi_id}&pn=${qr_data.name}&am=${qr_data.amount}`;
        QRCode.toCanvas(canvas_ref.current, data, {width: 200}, (error) => {
            if (error) sileo.error({description : "Error Generating QR Code 🚨", title: "Error"});
            else sileo.success({description : "QR Code Generated Successfully! 📱", title: "Success"});
        });
    }, [qr_data]);

    const renderedArrows = useMemo(() => {
        return transactions.map((item, index) => {
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
                />
            );
        });
    }, [transactions, members, updateArrow]);

    return (
        <div className="p-4 md:p-10 font-sans w-full flex flex-col items-center relative min-h-screen text-gray-800">
            
            {/* Clay Header - YOUR ORIGINAL CSS */}
            <div className="flex items-center justify-between mb-10 max-w-5xl mx-auto w-full rounded-full px-6 py-4">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black font-semibold px-4 transition-colors flex items-center gap-2">
                    ←<span className="hidden md:inline">Back</span>
                </button>
                <h2 className="text-md md:text-2xl font-bold text-center m-0 text-gray-800 tracking-wide">Settlement Plan 💸</h2>
                <div className="w-[80px]"></div>
            </div>

            {/* Clay Graph Container - RESPONSIVE & STYLED */}
            <div className="rounded-4xl md:rounded-[3rem] p-4 md:p-12 mb-12 flex justify-center items-center overflow-visible w-full max-w-5xl mx-auto">
                <Xwrapper>
                    <div 
                        className="relative z-10 touch-none transition-all duration-500 ease-in-out" 
                        style={{ width: `${dimensions.width}px`, height: `${dimensions.width}px` }}
                    >
                        {members.map((m, index) => {
                            const angle = (index / members.length) * 2 * Math.PI;
                            const x = center + dimensions.radius * Math.cos(angle) - (dimensions.nodeSize / 2);
                            const y = center + dimensions.radius * Math.sin(angle) - (dimensions.nodeSize / 2);

                            const pendingTransactionIdx = transactions.findIndex(t => t.from === m.name);
                            const pendingTransaction = pendingTransactionIdx !== -1 ? transactions[pendingTransactionIdx] : null;
                            const color = colors[index % colors.length];

                            return (
                                <div 
                                    id={m.name} 
                                    key={m.name}
                                    onClick={() => pendingTransaction ? setShowOptions(showOptions === index ? null : index) : null}
                                    style={{ 
                                        left: `${x}px`, top: `${y}px`, 
                                        width: `${dimensions.nodeSize}px`, height: `${dimensions.nodeSize}px`,
                                        backgroundColor: color, position: 'absolute'
                                    }}
                                    className={`flex items-center justify-center rounded-full small-box-shadow font-bold z-20 transition-all duration-300 ${pendingTransaction ? 'cursor-pointer hover:scale-105 ring-white/50 hover:ring-4' : 'cursor-default'}`}
                                >
                                    {showOptions === index && (
                                        <div className="options-popup absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-999 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-xl border border-white/50">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAsk(pendingTransaction); }}
                                                className="bg-blue-500 text-white text-[10px] md:text-xs px-4 py-2 rounded-full shadow-md whitespace-nowrap hover:bg-blue-600 active:scale-95 transition-all"
                                            >
                                                📩 Ask to Pay
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSettle(pendingTransactionIdx); }}
                                                className="bg-green-600 text-white text-[10px] md:text-xs px-4 py-2 rounded-full shadow-md whitespace-nowrap hover:bg-green-700 active:scale-95 transition-all"
                                            >
                                                ✅ Mark Settled
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/50 shadow-inner flex items-center justify-center text-gray-800 mb-1 text-sm md:text-lg">
                                            {m.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[10px] md:text-xs text-gray-900 truncate max-w-[60px] md:max-w-[80px]">
                                            {m.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {renderedArrows}
                    </div>
                </Xwrapper>
            </div>

            {/* Bottom Grid Layout - ALL ORIGINAL BOX SHADOWS RE-ADDED */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                
                {/* Active Debts Clay Card */}
                <div className="bg-white p-8 big-box-shadow rounded-4xl flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#d3d3d3] rounded-xl small-box-shadow text-xl">📋</div>
                        <h3 className="font-extrabold text-xl text-gray-800 m-0">Active Debts</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        {transactions.length === 0 ? (
                            <div className="bg-white/50 p-6 rounded-2xl border-2 border-dashed border-gray-400 text-center">
                                <p className="text-green-700 font-bold m-0">Everyone is square! ✨</p>
                            </div>
                        ) : (
                            transactions.map((item, idx) => (
                                <div key={idx} className="bg-gray-100 shadow-inner rounded-2xl p-4 flex justify-between items-center transition-transform hover:-translate-y-1">
                                    <div className="flex flex-col text-sm">
                                        <span>From <b className="text-red-500">{item.from}</b></span>
                                        <span>To <b className="text-green-600">{item.to}</b></span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-lg">₹{item.amount.toFixed(2)}</span>
                                        <button onClick={() => handleSettle(idx)} className="bg-[#B8E986] text-green-900 font-bold px-4 py-2 rounded-xl shadow-inner hover:brightness-105">✅</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Fast Pay Clay Card */}
                <div className="bg-white p-8 big-box-shadow rounded-4xl flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-[#d3d3d3] rounded-xl small-box-shadow text-xl">⚡</div>
                        <h3 className="font-extrabold text-xl text-gray-800 m-0">Fast Pay UPI</h3>
                    </div>

                    <input 
                        value={qr_data.upi_id} 
                        onChange={(e) => setQR_data({...qr_data, upi_id: e.target.value})} 
                        placeholder='Receiver UPI ID'
                        className="w-full px-5 py-4 rounded-2xl bg-gray-100 shadow-inner border-none mb-6 outline-none focus:ring-4 focus:ring-[#C599B6]/30 font-medium"
                    />
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                        {transactions.map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => {
                                    setQR_data({...qr_data, amount: item.amount, for: item.from});
                                    setTimeout(generateQR, 100); 
                                }}
                                className="bg-[#C599B6] text-white font-bold text-sm px-5 py-2.5 rounded-xl small-box-shadow hover:brightness-105 active:scale-95 transition-all"
                            >
                                QR: {item.from}
                            </button>
                        ))}
                    </div>
                    
                    <div className='flex flex-col items-center justify-center bg-gray-100 shadow-inner p-6 rounded-3xl mt-auto'>
                        {qr_data.for ? (
                            <div className="text-center mb-4">
                                <span className="text-sm text-gray-500 block">Paying for <b>{qr_data.for}</b></span>
                                <span className="text-xl font-black">₹{qr_data.amount}</span>
                            </div>
                        ) : (
                            <span className="text-sm text-gray-400 italic mb-6">Select a transaction above 👆</span>
                        )}
                        <div className="bg-gray-300 z-10 shadow-inner p-3 rounded-2xl">
                            <canvas ref={canvas_ref} className="w-[180px] h-[180px] rounded-xl"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settlement;