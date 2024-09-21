const DotPatternBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] opacity-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="text-gray-300"
      >
        <pattern
          id="pattern-circles"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle id="pattern-circle" cx="10" cy="10" r="1" fill="currentColor" />
        </pattern>

        <rect width="100%" height="100%" fill="url(#pattern-circles)" />
      </svg>
    </div>
  );
};

export default DotPatternBackground;