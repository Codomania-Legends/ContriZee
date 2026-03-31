import React, { useEffect, useRef, useState } from 'react';
import { splitExpenses } from '../Utility/Algo';
import { useLocation, useNavigate } from 'react-router';
import Xarrow, { useXarrow } from 'react-xarrows'; 
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useUser } from '../UserContext'; 
import { sileo } from 'sileo';
import QRCode from 'qrcode';

const colors = ["#4A90E2", "#50E3C2", "#B8E986", "#FFD200", "#FF6B6B"];

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
                sileo.success({description : "Dynamic Text Generated Successfully!", title: "Success"})
            } catch (error) {
                console.log(error)
                sileo.info({description : "Default Text Used", title: "Info"})
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

    // Animation for the popup buttons 🎬
    useGSAP(() => {
        if (showOptions !== null) {
            gsap.fromTo(".options-popup", { opacity: 0, scale: 0.8, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" });
        }
    }, [showOptions]);

    const handleSettle = (index) => {
        const newTransactions = [...transactions];
        newTransactions.splice(index, 1);
        setTransactions(newTransactions);
        setShowOptions(null);
        sileo.useState("Transaction marked as Settled! ✅");
    };

    const handleAsk = (item) => {
        const text = exportFormat.replace("[Payee]", item.from).replace("[Amount]", item.amount.toFixed(2));
        navigator.clipboard.writeText(text);
        sileo.success(`Request copied for ${item.from}! 📋`);
        setShowOptions(null);
    };

    const radius = 250; 
    const center = { x: 300, y: 300 }; 

    const [qr_data , setQR_data] = useState({
        upi_id: '',
        amount: '',
        name: '',
        for : ""
    })

    const canvas_ref = useRef(null)

    const generateQR = () => {
        if( !qr_data.upi_id ){
            sileo.error({description : "Please fill all the fields", title: "Error"})
            return
        }
        const data = `upi://pay?pa=${qr_data.upi_id}&pn=${qr_data.name}&am=${qr_data.amount}`
        QRCode.toCanvas(canvas_ref.current, data, {width: 200}, (error) => {
            if (error) sileo.error({description : "Error Generating QR Code", title: "Error"})
            else sileo.success({description : "QR Code Generated Successfully!", title: "Success"})
        })
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', position: 'relative' }}>
            {/* Header with Back button 🔙 */}
            <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-black transition-colors">
                    ← Back
                </button>
                <h2 style={{ textAlign: 'center', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Settlement Plan 💸</h2>
                <div style={{ width: '50px' }}></div> {/* Spacer ⚖️ */}
            </div>

            {/* Circular Graph Area 🕸️ */}
            <div style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto', zIndex: 1 }}>
                
                {members.map((m, index) => {
                    const angle = (index / members.length) * 2 * Math.PI;
                    const x = center.x + radius * Math.cos(angle) - 60;
                    const y = center.y + radius * Math.sin(angle) - 60;

                    const pendingTransactionIdx = transactions.findIndex(t => t.from === m.name);
                    const pendingTransaction = transactions[pendingTransactionIdx];

                    return (
                        <div 
                            id={m.name} 
                            key={m.name}
                            onClick={() => pendingTransaction ? setShowOptions(showOptions === index ? null : index) : null}
                            style={{
                                position: 'absolute', 
                                left: `${x}px`, 
                                top: `${y}px`,
                                width: '120px', 
                                height: '120px',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                borderRadius: '50%', 
                                border: `3px solid ${colors[index % colors.length]}`,
                                background: '#f9f9f9', 
                                fontWeight: 'bold', 
                                color: colors[index % colors.length],
                                cursor: pendingTransaction ? 'pointer' : 'default',
                                zIndex: 20,
                                overflow: 'visible',
                                animation : true
                            }}
                            className='small-box-shadow'
                        >
                            {/* POPUP MENU 💬 */}
                            {showOptions === index && (
                                <div 
                                    className="options-popup" 
                                    style={{
                                        position: 'absolute',
                                        top: '-90px', 
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        zIndex: 999, 
                                        pointerEvents: 'auto' 
                                    }}
                                >
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleAsk(pendingTransaction); }}
                                        className="bg-blue-500 text-white text-[11px] px-4 py-2 rounded-full shadow-xl whitespace-nowrap hover:scale-105 transition-transform"
                                    >
                                        📩 Ask Money
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleSettle(pendingTransactionIdx); }}
                                        className="bg-green-600 text-white text-[11px] px-4 py-2 rounded-full shadow-xl whitespace-nowrap hover:scale-105 transition-transform"
                                    >
                                        ✅ Settle Now
                                    </button>
                                </div>
                            )}

                            {/* Node Avatar 👤 */}
                            <div className='flex flex-col items-center justify-center'>
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-1">
                                    {m.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs">{m.name}</span>
                            </div>
                        </div>
                    );
                })}

                {/* Xarrows connecting the nodes 🔗 */}
                {transactions.map((item, index) => {
    const fromIndex = members.findIndex(m => m.name === item.from);
    const toIndex = members.findIndex(m => m.name === item.to);

    // Decide label side based on direction
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

            // 🔥 Better animation (see section 2)
            animateDrawing={1.2}

            dashness={{
                strokeLen: 6,
                nonStrokeLen: 6,
                animation: true
            }}

            labels={{
                [isRightSide ? "end" : "start"]: (
                    <div
                        style={{
                            transform: "translateY(-10px)",
                        }}
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

            {/* Summary List Area 📝 */}
            <div style={{ marginTop: '50px', background: '#f4f4f4', padding: '20px', borderRadius: '15px' }} className="max-w-2xl mx-auto">
                <h3 className="font-bold mb-3">Active Debts 📋</h3>
                {transactions.length === 0 ? (
                    <p className="text-green-600 font-medium">Everyone is square! No debts found. ✨</p>
                ) : (
                    transactions.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <span><b>{item.from}</b> owes <b>{item.to}</b>: ₹{item.amount.toFixed(2)}</span>
                            <button 
                                onClick={() => handleSettle(idx)}
                                className="text-xs bg-white border border-green-500 text-green-600 px-2 py-1 rounded-md hover:bg-green-50 active:scale-95 transition-transform"
                            >
                                Settle
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div>
                <input value={qr_data.upi_id} onChange={(e) => setQR_data({...qr_data, upi_id: e.target.value})} placeholder='UPI ID'/>
                {
                    transactions.map((item, idx) => {
                        console.log(item)
                        return (
                        <button key={idx} onClick={() => {
                            setQR_data({...qr_data, amount: item.amount, for: item.from})
                            generateQR()
                            }}>Generate QR for {item.from} to pay {item.to}</button>
                    )})
                }
            </div>
            <div className='flex flex-col items-center justify-center'>
                <span>QR code generated for {qr_data.for}</span>
                <h4>Scan this to pay <button>{qr_data.amount}</button> to {qr_data.from}</h4>
                <canvas ref={canvas_ref} id='qr-code'></canvas>
            </div>

            <style>
                {`
                    .small-box-shadow { box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease; }
                    .small-box-shadow:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.7; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .pulse {
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: lightgreen;
                        animation: pulse 1.5s infinite;
                    }
                `}
            </style>
        </div>
    );
}

export default Settlement;