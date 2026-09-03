// components/ui/LoadingSpinner.jsx
const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p>در حال بارگذاری...</p>
    </div>
  );
};

export default LoadingSpinner;