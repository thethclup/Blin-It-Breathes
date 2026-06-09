import { useGameStore } from '../store/gameStore';
import { motion } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { GAME_ERC8021_CONFIG, buildAttributedCalldata } from '../lib/erc8021';

export default function ResultScreen() {
  const { sessionDuration, harmony, setScreen, resetGame } = useGameStore();
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
    const dummyCalldata = "0x" + stringToHex(`SessionTime:${Math.floor(sessionDuration)}|Harmony:${Math.floor(harmony)}`);
    const attributedData = buildAttributedCalldata(dummyCalldata, GAME_ERC8021_CONFIG);

    sendTransaction({
      to: address,
      data: attributedData as `0x${string}`,
      value: parseEther('0'),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center w-full h-screen bg-[#0B0F19] relative p-6"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg rounded-full bg-gradient-to-r from-[#2B6CB0]/20 to-[#319795]/20 blur-[100px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-md w-full text-center bg-black/20 backdrop-blur-md p-10 rounded-[3rem] border border-white/5 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-serif text-[#F0F4F8] uppercase tracking-[0.2em]">
           Session Complete
        </h1>

        <div className="flex gap-12 mt-10">
            <div>
                <p className="font-mono text-[#90CDF4] tracking-widest text-[10px] uppercase">Duration</p>
                <p className="text-3xl font-mono mt-2 text-white">{Math.floor(sessionDuration)}s</p>
            </div>
            <div>
                <p className="font-mono text-[#F6E05E] tracking-widest text-[10px] uppercase">Harmony</p>
                <p className="text-3xl font-mono mt-2 text-white">{Math.floor(harmony)}%</p>
            </div>
        </div>

        <div className="mt-12 w-full space-y-4">
          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              className="w-full py-4 bg-gradient-to-r from-[#2B6CB0]/30 to-[#319795]/30 text-white font-mono uppercase tracking-[0.2em] text-xs hover:from-[#2B6CB0]/40 hover:to-[#319795]/40 transition-colors rounded-full border border-white/10"
            >
              Connect Wallet (Base)
            </button>
          ) : (
            <>
              <p className="font-mono text-[10px] text-[#A0AEC0] mb-4 break-all bg-black/30 p-2 rounded-lg inline-block">
                {address}
              </p>

              <button
                onClick={handleRecordOnChain}
                disabled={isPending}
                className="w-full py-4 border border-[#BEE3F8]/30 text-[#BEE3F8] font-mono uppercase tracking-[0.15em] text-xs hover:bg-[#BEE3F8]/10 transition-all disabled:opacity-50 rounded-full"
              >
                {isPending ? 'Recording State...' : 'Record Session On-Chain'}
              </button>

              <button
                onClick={() => disconnect()}
                className="text-[10px] font-mono text-[#718096] uppercase tracking-widest underline mt-4 block mx-auto"
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
              className="text-[10px] font-mono text-[#A0AEC0] uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Return to Sanctuary
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
