// Statistics card component for dashboard
export const StatCard = ({ title, value, change, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        {change && <p className="stat-change">{change}</p>}
      </div>
    </div>
  );
};
