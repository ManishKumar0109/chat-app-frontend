
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServerWakeUp = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(90);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/", { replace: true });
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center">

        {/* Loading animation */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <div className="w-9 h-9 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Warming up the server
        </h1>

        <p className="text-slate-400 mt-3 text-sm sm:text-base">
          The server is waking up from a cold start.
          Please wait while we get things ready.
        </p>

        {/* Countdown */}
        <div className="mt-8">
          <p className="text-5xl font-bold text-emerald-400 tabular-nums">
            {String(minutes).padStart(2, "0")}:
            {String(remainingSeconds).padStart(2, "0")}
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Please wait...
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${((90 - seconds) / 90) * 100}%` }}
          />
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Server is starting...
        </div>

      </div>
    </div>
  );
};

export default ServerWakeUp;