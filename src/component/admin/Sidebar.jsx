'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiSettings } from 'react-icons/fi';
import { useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { CiBookmarkCheck } from 'react-icons/ci';
import { LuUserCheck } from 'react-icons/lu';

const menuItems = [
  {
    name: 'Dashboard',
    icon: <FiHome />,
    path: '/admin',
  },
  {
    name: 'Events',
    icon: <FiUsers />,
    path:'/admin/events'
  },
 
  {
    name: 'Settings',
    icon: <FiSettings />,
    path: '/admin/settings',
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const isActive = (path) => pathname === path;

  return (
    <aside className="w-full text-gray-700 bg-gray-100 h-screen p-0 py-6 pl-5 top-0 left-0">
      <h2 className="text-xl font-bold">Events Management</h2>
      <h2 className="mb-6">Admin</h2>

      <nav className="space-y-0 text-sm font-semibold">
        {menuItems.map((item) => {
          const hasSubMenu = !!item.subMenu;
          const isMenuOpen = openMenus[item.name];

          const menuItemClass = `flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-l-full transition ${
            isActive(item.path ?? '') ? 'bg-white text-blue-600' : 'text-gray-700 hover:text-blue-600'
          }`;

          return (
            <div key={item.name}>
              {hasSubMenu ? (
                // Menu with submenu — not a link
                <div
                  onClick={() => toggleMenu(item.name)}
                  className={menuItemClass}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                  <RiArrowDropDownLine />
                </div>
              ) : (
                // Menu without submenu — link
                <Link href={item.path} className={menuItemClass}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )}

              {/* Submenu */}
              {hasSubMenu && isMenuOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subMenu.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.path}
                      className={`block px-3 py-1 rounded transition ${
                        isActive(sub.path)
                          ? 'bg-white text-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
