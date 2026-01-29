import { useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import api from '@/lib/api'

export default function ScanQR() {
    const [scanResult, setScanResult] = useState<any>(null)
    const [error, setError] = useState('')
    const [scanning, setScanning] = useState(true)

    useEffect(() => {
        if (!scanning) return;

        function onScanSuccess(decodedText: string, decodedResult: any) {
            handleVerification(decodedText);
        }

        function onScanFailure(error: any) {
            // console.warn(`Code scan error = ${error}`);
        }

        const html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false);

        html5QrcodeScanner.render(onScanSuccess, onScanFailure);

        return () => {
            html5QrcodeScanner.clear().catch(error => {
                // console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        }
    }, [scanning]);

    const handleVerification = async (data: string) => {
        setScanning(false);
        try {
            let verificationData: any = {};
            try {
                const parsed = JSON.parse(data);
                verificationData.bookingReference = parsed.ref;
            } catch {
                verificationData.bookingReference = data;
            }

            const res = await api.post('/tickets/verify', verificationData);
            setScanResult(res.data.ticket);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Verification Failed');
        }
    }

    const handleReset = () => {
        setScanResult(null);
        setError('');
        setScanning(true);
    }

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h1 className="text-center mb-6">📷 Scan Ticket QR</h1>

            {error ? (
                <div className="alert alert-error mb-4">
                    <p className="font-bold mb-2">❌ Error</p>
                    <p>{error}</p>
                    <button className="btn btn-sm btn-outline mt-4 w-full" onClick={handleReset}>Try Again</button>
                </div>
            ) : scanResult ? (
                <div className="card p-6 text-center" style={{ borderTop: '4px solid var(--success-color)' }}>
                    <div className="mb-4">
                        <span className="badge badge-success text-lg px-4 py-2" style={{ background: '#dcfce7', color: '#166534' }}>✅ Verified & Boarded</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{scanResult.passengerName}</h2>
                    <p className="text-xl mb-4 text-gray-600 font-mono">{scanResult.bookingReference}</p>

                    <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'left' }}>
                        <p><strong>From:</strong> {scanResult.fromStop}</p>
                        <p><strong>To:</strong> {scanResult.toStop}</p>
                    </div>

                    <button className="btn btn-primary w-full" onClick={handleReset}>Scan Next Ticket</button>
                </div>
            ) : (
                <div className="card p-4">
                    <div id="reader"></div>
                    <p className="text-center mt-4 text-gray-500">Point camera at the QR code</p>
                </div>
            )}
        </div>
    )
}
