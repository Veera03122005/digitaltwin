export default function LoadingSpinner() {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem' }}>Loading...</p>
        </div>
    )
}
