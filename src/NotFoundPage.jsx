
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">

        <h1 className="text-8xl sm:text-9xl font-extrabold text-emerald-400">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-4">
          Page not found
        </h2>

        <p className="text-slate-400 mt-3 text-sm sm:text-base">
          Oops! The page you're looking for doesn't exist
          or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-8 bg-emerald-500 hover:bg-emerald-600
          text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Back to Home
        </Link>

      </div>
    </div>
  );
};

export default NotFound;
