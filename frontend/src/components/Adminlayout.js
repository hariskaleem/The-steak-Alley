import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import MenuManagement from "./MenuManagement";
import StaffManagement from "./StaffManagement";
import AdminSettings from "./AdminSettings";
import NewsletterManagement from "./NewsletterManagement";
import "./Admin.css";
import { LayoutDashboard, Receipt, UtensilsCrossed, Users, Mail, Settings } from "lucide-react";

const getDateSubtitle = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

const PAGE_META = {
  dashboard: { title: "Dashboard", subtitle: getDateSubtitle() },
  orders: { title: "Orders", subtitle: "Live and past orders" },
  menu: { title: "Menu", subtitle: "Manage dishes and categories" },
  staff: { title: "Staff", subtitle: "Manage your team" },
  newsletter: { title: "Newsletter", subtitle: "Manage your subscriber audience" },
  settings: { title: "Settings", subtitle: "Restaurant preferences" },
};

const MOBILE_NAV_ITEMS = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "staff", label: "Staff", icon: Users },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const meta = PAGE_META[activePage];

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "orders":
        return <Orders />;
      case "menu":
        return <MenuManagement />;
      case "staff":
        return <StaffManagement />;
      case "newsletter":
        return <NewsletterManagement />;
      case "settings":
        return <AdminSettings />;
      default:
        return (
          <div className="admin-placeholder">
            <p>{meta.title} is coming together — nothing to show here yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-shell">
      <AdminSidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="admin-main">
        <AdminTopbar title={meta.title} subtitle={meta.subtitle} />
        <div className="admin-content">{renderPage()}</div>
      </div>

      {/* Mobile bottom navigation — shown only on ≤900px via CSS */}
      <nav className="admin-mobile-nav" aria-label="Admin mobile navigation">
        {MOBILE_NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`admin-mobile-nav__btn${activePage === key ? " active" : ""}`}
            onClick={() => setActivePage(key)}
            aria-label={label}>
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
