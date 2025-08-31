import { useState } from "react";
import { TwitterIcon, Link as Brain, Youtube, Linkedin, Menu } from "lucide-react";

type NavItem = {
  name: string;
  icon: any;
  type: string;
};

const navItems: NavItem[] = [
  { name: "All", icon: <Brain className="w-5 h-5" />, type: "all" },
  { name: "Tweets", icon: <TwitterIcon className="w-5 h-5" />, type: "twitter" },
  { name: "Youtube", icon: <Youtube className="w-5 h-5" />, type: "youtube" },
  { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, type: "linkedin" },
];

export default function Sidebar({ 
  activeType, 
  setActiveType 
}: { 
  activeType: string; 
  setActiveType: (t: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`h-screen bg-card border-r border-border transition-all duration-300 flex flex-col w-16 ${
        isOpen ? "md:w-56" : "md:w-16"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary shrink-0" />
          <span className={`font-semibold text-foreground transition-opacity duration-200 ${
            isOpen ? "hidden md:inline" : "hidden"
          }`}>Quick-Log</span>
        </div>
        <button
         type="button"
          title="menu-btn"
          className="text-muted-foreground hover:text-foreground transition-colors hidden md:block"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveType(item.type)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group justify-center ${
              isOpen ? "md:justify-start" : "md:justify-center"
            } ${
              activeType === item.type 
                ? "bg-sidebar-active text-sidebar-active-text font-semibold" 
                : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
            }`}
            title={item.name}
          >
            <div className="shrink-0">
              {item.icon}
            </div>
            <span className={`transition-opacity duration-200 ${
              isOpen ? "hidden md:inline" : "hidden"
            }`}>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}