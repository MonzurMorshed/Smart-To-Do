import { FaGithub, FaGlobe } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { SiReact, SiFirebase, SiOpenai } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--border)] bg-light-primary">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Name */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="TodoAI Logo" className="w-20 h-16" />
          <span className="font-semibold text-lg text-white">
            TodoAI – Smart Task Assistant
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-white">
          <a href="https://example.com" target="_blank" rel="noopener noreferrer" 
             className="hover:text-[var(--primary)] flex items-center gap-1">
            <FaGlobe /> Website
          </a>
          <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" 
             className="hover:text-[var(--primary)] flex items-center gap-1">
            <FaGithub /> GitHub
          </a>
          <a href="mailto:support@example.com" 
             className="hover:text-[var(--primary)] flex items-center gap-1">
            <MdEmail /> Contact
          </a>
        </div>
      </div>

      {/* Made with Love */}
      <div className="bg-[var(--card)] text-center py-3 text-sm text-[var(--muted)] border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-center gap-2">
        <span>
          Made with <span className="text-red-500">❤️</span> using
        </span>
        <div className="flex items-center gap-3">
          <SiReact className="text-sky-500 text-lg" title="React" />
          <SiFirebase className="text-yellow-500 text-lg" title="Firebase" />
          <SiOpenai className="text-purple-500 text-lg" title="OpenAI" />
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center py-3 text-xs text-white">
        © {new Date().getFullYear()} TodoAI. All rights reserved.
      </div>
    </footer>
  );
}
