export function ClientDetailSkeleton() {
  return (
    <div
      className="content client-detail-content client-detail-loading"
      role="status"
      aria-live="polite"
    >
      <span className="loading-copy">Carregando dados do cliente...</span>
      <div className="loading-bar loading-back" />
      <div className="loading-bar loading-title" />
      <div className="panel loading-profile">
        <div className="loading-circle" />
        <div className="loading-lines">
          <div className="loading-bar" />
          <div className="loading-bar" />
        </div>
      </div>
      <div className="loading-metrics">
        {Array.from({ length: 5 }, (_, index) => (
          <div className="panel loading-metric" key={index}>
            <div className="loading-bar" />
            <div className="loading-bar" />
          </div>
        ))}
      </div>
      <div className="panel loading-content">
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
      </div>
    </div>
  );
}
