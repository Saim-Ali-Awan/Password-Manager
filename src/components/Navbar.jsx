// Navbar.tsx
import React from 'react';
import '../index.css';
import SliderAnimation from './ui/LoginAnimation';
const Navbar = () => {
  return (
<>
<nav className="bg-[var(--background)] text-[var(--foreground)] flex  shadow-xl shadow-var[(--secondary)] items-center justify-between px-4 h-auto">
      {/* Logo / Title */}
      <h2 className="text-xl font-light tracking-tight bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-transparent mb-4 mt-4">PassWorld</h2>

      {/* Navigation links */}
      <ul className="flex items-center gap-6">
        <li className='mb-4 mt-4'>
          <button>

          <a
            href="#"
            className={`
              my-auto
              inline-block rounded-full py-2 px-2 text-sm font-medium
              transition duration-300 shadow-md shadow-[var(--secondary)]
              bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-transparent
              hover:shadow-md hover:shadow-[var(--primary)] hover:transition hover:duration-400
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]
              `}
              >
            <span className='flex align-center'>

              <SliderAnimation width={20} height={24} />
              <p className='mx-1'>Login</p>
            </span>
          </a>
            </button>
        </li>

        {/* Add more items here */}
        {/* <li>…</li> */}
      </ul>
    </nav>
              <div className="flex w-full justify-center bg-[var(--border)] h-[0.4px]"></div>
                </>
  );
};

export default Navbar;