import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast, { useToast } from '../components/Toast';

export default function MainLayout() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
