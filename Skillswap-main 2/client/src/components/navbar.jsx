import { useLocation, useNavigate } from "react-router-dom";
import homeIcon from "../assets/icons/home.png";
import swapIcon from "../assets/icons/swap.png";
import userIcon from "../assets/icons/user.png";
import commentIcon from "../assets/icons/comment.png";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

 
   const navItems = [
  { label: "Home", href: "/home", icon: homeIcon },
  { label: "Swap", href: "/Requests", icon: swapIcon },
  { label: "Profile", href: "/profile", icon: userIcon },
  { label: "Messages", href: "/messages", icon: commentIcon },
];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-[#edeaef] border-t border-[#3b2d47] shadow-inner z-50">
      <div className="flex justify-around items-center h-14 relative">
        {navItems.map(({ label, href, icon }) => {
          const isActive = location.pathname === href;
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className={`flex flex-col items-center justify-center text-xs ${
                 "text-gray-400 hover:text-blue-500"
              }`}
            >
              <img src={icon} alt={`${label} icon`} width={20} height={20} className="mb-1" />
              {label}
            </button>
          );
        })}

      
      </div>
    </nav>
  );
}
