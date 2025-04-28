import React from 'react';
import { Link } from 'react-router-dom';
import { navData } from '../../static/data';

const Navbar = ({ active }) => {
  return (
    <nav className="w-full flex flex-col lg:flex-row items-center justify-between p-4">
      {/* Mobile Navbar (block position for small screens) */}
      <div className="lg:hidden w-full">
        <div className="flex flex-col items-center gap-4">
          {navData.map((item, index) => (
            <Link
              key={index}
              to={item.url}
              className={`block px-6 py-3 font-semibold text-black transition-colors duration-300 ease-in-out 
                ${active === index + 1
                  ? 'text-blue-900 underline underline-offset-4'
                  : 'hover:text-blue-900 hover:underline hover:underline-offset-4'}`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Navbar (horizontal layout for larger screens) */}
      <div className="hidden lg:flex w-full justify-center gap-6">
        {navData.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            className={`px-2 py-2 font-semibold text-blacktransition-colors duration-300 ease-in-out 
              ${active === index + 1
                ? 'text-blue-900 underline underline-offset-4'
                : 'hover:text-blue-300 hover:underline hover:underline-offset-4'}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
