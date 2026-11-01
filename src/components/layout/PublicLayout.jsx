import Navbar from '../navigation/Navbar';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09080e] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
