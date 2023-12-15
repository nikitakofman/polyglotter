function LoadingSpinner() {
  return (
    <div role="status" className="flex items-center justify-center">
      <div className="w-12">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <radialGradient
            id="a9"
            cx=".66"
            fx=".66"
            cy=".3125"
            fy=".3125"
            gradientTransform="scale(1.5)"
          >
            <stop offset="0" stopColor="#EF9351"></stop>
            <stop offset=".3" stopColor="#EF9351" stopOpacity=".9"></stop>
            <stop offset=".6" stopColor="#EF9351" stopOpacity=".6"></stop>
            <stop offset=".8" stopColor="#EF9351" stopOpacity=".3"></stop>
            <stop offset="1" stopColor="#EF9351" stopOpacity="0"></stop>
          </radialGradient>
          <circle
            fill="none"
            stroke="url(#a9)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeDasharray="200 1000"
            strokeDashoffset="0"
            cx="100"
            cy="100"
            r="70"
          >
            <animateTransform
              type="rotate"
              attributeName="transform"
              calcMode="spline"
              dur="2"
              values="360;0"
              keyTimes="0;1"
              keySplines="0 0 1 1"
              repeatCount="indefinite"
            ></animateTransform>
          </circle>
          <circle
            fill="none"
            opacity=".2"
            stroke="#EF9351"
            strokeWidth="13"
            strokeLinecap="round"
            cx="100"
            cy="100"
            r="70"
          ></circle>
        </svg>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
