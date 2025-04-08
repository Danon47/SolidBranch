export function Card({ className, children }) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border ${className || ""}`}>
        {children}
      </div>
    );
  }