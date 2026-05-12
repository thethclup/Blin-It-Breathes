import { useGameStore } from '../store/gameStore';
import { motion } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { GAME_ERC8021_CONFIG, buildAttributedCalldata } from '../lib/erc8021';

export default function ResultScreen() {
  const { timeSurvived, setScreen, resetGame } = useGameStore();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending } = useSendTransaction();

  const stringToHex = (str: string) => {
    return Array.from(new TextEncoder().encode(str))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleRecordOnChain = () => {
    // Simulate recording survival time on chain or SIWE signature
    const dummyCalldata = "0x" + stringToHex("SurvivalTime:" + Math.floor(timeSurvived));
    const attributedData = buildAttributedCalldata(dummyCalldata, GAME_ERC8021_CONFIG);

    sendTransaction({
      to: address, // sending to self with data as a dummy record
      data: attributedData as `0x${string}`,
      value: parseEther('0'),
    });
  };

  const handleSayGM = () => {
    const gmData = "0x" + stringToHex("GM");
    sendTransaction({
      to: address,
      data: gmData as `0x${string}`,
      value: parseEther('0'),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center w-full h-screen bg-[#8A0303] bg-opacity-20 relative p-6"
    >
      <div className="absolute inset-0 bg-black mix-blend-multiply z-0"></div>
      
      <div className="z-10 flex flex-col items-center max-w-md w-full text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-white uppercase tracking-widest drop-shadow-[0_0_10px_red]">
           You Blinked
        </h1>
        
        <p className="mt-8 font-mono text-[#B6CABD] tracking-widest text-sm uppercase">
          Time Survived
        </p>
        <p className="text-4xl font-mono mt-2 text-white">
          {Math.floor(timeSurvived)}s
        </p>

        <div className="mt-12 w-full space-y-4">
          {!isConnected ? (
            <button 
              onClick={() => connect({ connector: injected() })}
              className="w-full py-4 bg-white text-black font-mono uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
            >
              Connect Wallet (Base)
            </button>
          ) : (
            <>
              <p className="font-mono text-xs text-gray-400 mb-4 break-all">
                Connected: {address}
              </p>
              
              <button 
                onClick={handleRecordOnChain}
                disabled={isPending}
                className="w-full py-4 border border-red-500 text-red-500 font-mono uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
              >
                {isPending ? 'Recording...' : 'Record This Nightmare On-Chain'}
              </button>

               <button 
                onClick={handleSayGM}
                disabled={isPending}
                className="w-full py-4 border border-white/20 text-white font-mono uppercase tracking-widest text-xs hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Say "GM" On-Chain
              </button>

               <button 
                onClick={() => disconnect()}
                className="text-xs font-mono text-gray-500 uppercase tracking-widest underline mt-4 block mx-auto"
              >
                Disconnect
              </button>
            </>
          )}

          <div className="pt-8">
            <button 
              onClick={() => {
                resetGame();
                setScreen('title');
              }}
              className="text-xs font-mono text-[#B6CABD] uppercase tracking-widest hover:text-white transition-colors"
            >
              Return to the shadows
            </button>
          </div>
        </div>
      </div>
      
      <div className="noise-overlay" />
    </motion.div>
  );
}
