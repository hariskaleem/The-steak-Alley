import React from "react";
import { LayoutDashboard, Receipt, UtensilsCrossed, Users, Mail, Settings } from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "staff", label: "Staff", icon: Users },
  { key: "newsletter", label: "Newsletter", icon: Mail },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ activePage, onNavigate }) {
  return (
    <div className="admin-sidebar">
      <div className="admin-brand">The Steak Alley</div>

      <nav className="admin-nav">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`admin-nav-item${activePage === key ? " active" : ""}`}
            onClick={() => onNavigate(key)}>
            <Icon size={17} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
