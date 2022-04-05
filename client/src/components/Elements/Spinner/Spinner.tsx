export default function Spinner({ height=36, width=36 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className={`animate-spin h-${height} w-${width} stroke-indigo-600`} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" fill="none" strokeWidth="5" r="17" strokeDasharray="80.11061266653974 28.703537555513243" transform="matrix(1,0,0,1,0,0)"></circle>
    </svg>
  );
}