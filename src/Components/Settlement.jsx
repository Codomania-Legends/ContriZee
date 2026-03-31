import React, { useEffect, useRef, useState } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useLocation, useNavigate } from 'react-router';
import Xarrow, { useXarrow } from 'react-xarrows'; 
import { useUser } from '../UserContext';
import { sileo } from 'sileo';
import QRCode from 'qrcode';

const colors = ["#C599B6", "#eff7f6" ,"#50E3C2", "#B8E986", "#ff8fab", "#d5bdaf", "#a2d2ff", "#cdb4db", "#e4c1f9"];

const CustomTriangleHead = () => (
    <svg viewBox="0 0 20 20">
        <polygon points="0,10 20,10 10,0" fill="green" />
    </svg>
);

function Settlement({openRouter}) { 
    const updateArrow = useXarrow();
    const { members, expenses } = useUser();
    const [transactions, setTransactions] = useState([]);
    const [showOptions, setShowOptions] = useState(null);
    const [exportFormat, setExportFormat] = useState("Quick ContriZee update: Hey [Payee], you're down ₹[Amount] for the latest bill. 💸 Hit me up when you've sent it so I can mark it settled! 📱⚡");
    const navigate = useNavigate();

    useEffect( () => {
        async function Genarate_Text(){
            try {
                const res = await openRouter.chat.send({
                    chatGenerationParams: {
                        model: 'openrouter/free',
                        messages: [
                            {
                                role: "user",
                                content: "Generate a short, funny, and slightly passive-aggressive text message for a friend who owes me money. Make it sound like I'm joking but also hinting that I want my money back. Just give me the Text with no Options or extra text. Strictly follow the format:Use [Payee] for the name and [Amount] for the amount. also use Emojis to make it Light Hearted.",
                            },
                        ],
                    },
                });
                setExportFormat(res.choices[0].message.content);
                sileo.success({description : "Dynamic Text Generated Successfully! 🤖", title: "Success"})
            } catch (error) {
                console.log(error)
                sileo.info({description : "Default Text Used 📝", title: "Info"})
            }
        }
        // Genarate_Text();
    } , [] )

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

    const handleSettle = (index) => {
        const newTransactions = [...transactions];
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        setShowOptions(null);
        sileo.success("Transaction marked as Settled! ✅");
    };

    const handleAsk = (item) => {
        const text = exportFormat.replace("[Payee]", item.from).replace("[Amount]", item.amount.toFixed(2));
        navigator.clipboard.writeText(text);
        sileo.success(`Request copied for ${item.from}! 📋`);
        setShowOptions(null);
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

    const [qr_data , setQR_data] = useState({
        upi_id: '',
        amount: '',
        name: '',
        for : ""
    })

    const canvas_ref = useRef(null)

    const generateQR = () => {
        if( !qr_data.upi_id ){
            sileo.error({description : "Please fill all the fields 🛑", title: "Error"})
            return
        }
        const data = `upi://pay?pa=${qr_data.upi_id}&pn=${qr_data.name}&am=${qr_data.amount}`
        QRCode.toCanvas(canvas_ref.current, data, {width: 200}, (error) => {
            if (error) sileo.error({description : "Error Generating QR Code 🚨", title: "Error"})
            else sileo.success({description : "QR Code Generated Successfully! 📱", title: "Success"})
        })
    }

    return (
        <div className="p-10 font-sans w-full flex flex-col items-center justify-center relative min-h-screen">
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
                <h3 className="font-bold mb-3">Active Debts 📋</h3>
                {transactions.length === 0 ? (
                    <p className="text-green-600 font-medium">Everyone is square! No debts found. ✨</p>
                ) : (
                    transactions.map((item, idx) => (
                        <div key={`${item.from}-${item.to}`} className="flex justify-between items-center py-2 border-b-2 solid border-gray-100 last:border-none">
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
        </div>
    );
}

export default Settlement;