import React, { useState } from 'react';

interface QRScannerStubProps {
    onClose: () => void;
    onScan?: (qrCode: string) => void;
}

const QRScannerStub: React.FC<QRScannerStubProps> = ({ onClose, onScan }) => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            const mockQr = `LP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            setResult(mockQr);
            if (onScan) onScan(mockQr);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center p-6">
            <div className="absolute top-6 right-6">
                <button onClick={onClose} className="text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="w-full max-w-sm aspect-square border-4 border-dashed border-blue-500 rounded-3xl relative overflow-hidden flex items-center justify-center bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>

                {scanning ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-blue-400 font-bold animate-pulse">SCANNING...</p>
                    </div>
                ) : result ? (
                    <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-white text-xl font-bold">QR SCANNED!</p>
                        <p className="text-gray-400 font-mono text-lg">{result}</p>
                        <button
                            onClick={() => setResult(null)}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
                        >
                            Scan Next
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <svg className="w-24 h-24 text-blue-500/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 17h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        <p className="text-gray-400 text-sm">Align the QR code within the frame</p>
                        <button
                            onClick={simulateScan}
                            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Start Camera
                        </button>
                    </div>
                )}

                {/* Scanning Line Animation */}
                {scanning && (
                    <div className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] animate-scan"></div>
                )}
            </div>

            <div className="mt-12 text-center max-w-xs">
                <h4 className="text-white font-bold text-xl mb-2">QR Check-in</h4>
                <p className="text-gray-500 text-sm">
                    Scanned attendees will be automatically marked as
                    <span className="text-green-500 font-bold"> Checked-in</span> in your dashboard.
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}} />
        </div>
    );
};

export default QRScannerStub;
