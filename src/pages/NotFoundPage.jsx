import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#FAF8F2] flex flex-col items-center justify-center p-6 text-center">
    <div className="max-w-md">
      <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
      <h1 className="font-display text-2xl font-bold text-primary mb-3">Page Not Found</h1>
      <p className="text-[#6B7280] mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/" className="btn-primary">
          <Home className="w-4 h-4" /> Go Home
        </Link>
        <button onClick={() => window.history.back()} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
