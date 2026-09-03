// src/pages/profile/components/TabButton.jsx
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium ${
      active 
        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105' 
        : 'bg-primary-foreground text-gray-600 hover:bg-primary/10 hover:text-primary border border-gray-200/50'
    }`}
  >
    <Icon className={`h-4 w-4 ${active ? 'text-primary-foreground' : ''}`} />
    <span>{label}</span>
    {count !== undefined && count > 0 && (
      <span className={`text-xs px-2.5 py-0.5 rounded-full ${
        active 
          ? 'bg-primary-foreground/20 text-primary-foreground' 
          : 'bg-primary/10 text-primary'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default TabButton;