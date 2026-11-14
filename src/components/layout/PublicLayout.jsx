import Navbar from '../navigation/Navbar';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout min-h-screen flex flex-col bg-[#FAF8F2] dark:bg-[#0D1527] text-[#252525] dark:text-[#FAF8F2]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
