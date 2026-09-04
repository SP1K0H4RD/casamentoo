import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../services/auth';
import AdminLogin from '../components/admin/AdminLogin';
import Dashboard from '../components/admin/Dashboard';
import GuestManagement from '../components/admin/GuestManagement';
import GiftManagement from '../components/admin/GiftManagement';
import PaymentManagement from '../components/admin/PaymentManagement';
import MessageManagement from '../components/admin/MessageManagement';
import Charts from '../components/admin/Charts';
import { LayoutDashboard, Users, Gift, Wallet, MessageSquareHeart, BarChart3, LogOut, Menu, X } from 'lucide-react';

type Tab = 'dashboard' | 'guests' | 'gifts' | 'payments' | 'messages' | 'charts';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'guests', label: 'Convidados', icon: Users },
  { id: 'gifts', label: 'Presentes', icon: Gift },
  { id: 'payments', label: 'Arrecadações', icon: Wallet },
  { id: 'messages', label: 'Recados', icon: MessageSquareHeart },
  { id: 'charts', label: 'Gráficos', icon: BarChart3 },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (authService.isAdminAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'guests': return <GuestManagement />;
      case 'gifts': return <GiftManagement />;
      case 'payments': return <PaymentManagement />;
      case 'messages': return <MessageManagement />;
      case 'charts': return <Charts />;
    }
  };

  return (
    <div className="min-h-screen bg-wedding-cream flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-wedding-gold/10 fixed h-screen">
        <div className="p-6 border-b border-wedding-gold/10">
          <h1 className="font-serif text-xl text-wedding-charcoal">
            M <span className="text-wedding-gold">&</span> Â
          </h1>
          <p className="text-wedding-warmgray text-xs mt-1">Painel dos Noivos</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-wedding-charcoal text-white'
                  : 'text-wedding-charcoal hover:bg-wedding-cream'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-wedding-gold/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-wedding-gold/10 px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif text-lg text-wedding-charcoal">Painel Administrativo</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden fixed top-14 left-0 right-0 z-30 bg-white border-b border-wedding-gold/10 p-4 space-y-1 shadow-lg"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-wedding-charcoal text-white'
                  : 'text-wedding-charcoal hover:bg-wedding-cream'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-16 lg:pt-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-serif text-2xl text-wedding-charcoal mb-6">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}
