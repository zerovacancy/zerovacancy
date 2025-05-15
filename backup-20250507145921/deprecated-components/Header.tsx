import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from '@/components/ui/magnetic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const handleNavClick = (sectionId: string) => {
    // Only scroll if we're on the homepage
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const ResourcesDropdown = ({ className, onClick }: { className?: string, onClick?: () => void }) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="group">
        <span className={cn(
          "text-[15px] font-medium transition-colors relative py-1.5 inline-flex items-center gap-1.5",
          "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:scale-x-0 before:origin-right",
          "before:transition-transform before:duration-300 group-hover:before:scale-x-100 before:origin-left",
          "before:bg-[#9b87f5]",
          location.pathname.startsWith('/resources')
            ? "text-[#9b87f5] before:scale-x-100"
            : "text-black hover:text-[#9b87f5]"
        )}>
          Resources
          <ChevronDown className="h-4 w-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px] bg-white border border-border/40 shadow-lg">
        <DropdownMenuItem asChild onClick={onClick} className="hover:bg-accent focus:bg-accent">
          <Link to="/resources/blog" className="w-full cursor-pointer">Blog</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={onClick} className="hover:bg-accent focus:bg-accent">
          <Link to="/resources/learn" className="w-full cursor-pointer">Learn</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const NavLinks = ({ className, onClick }: { className?: string, onClick?: () => void }) => (
    <nav className={cn("flex items-center gap-10", className)}>
      {[
        { to: "/search", label: "Find Creators", sectionId: "search" },
        { to: "/how-it-works", label: "How It Works", sectionId: "how-it-works" },
        { to: "/pricing", label: "Pricing", sectionId: "pricing" },
      ].map((link) => (
        <Magnetic key={link.to} intensity={0.5}>
          <button
            onClick={() => {
              if (location.pathname === '/') {
                handleNavClick(link.sectionId);
              } else {
                // Navigate to homepage first, then scroll after a short delay
                window.location.href = `/#${link.sectionId}`;
              }
              if (onClick) onClick();
            }}
            className={cn(
              "text-[15px] font-medium transition-colors relative py-1.5",
              "before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:scale-x-0 before:origin-right",
              "before:transition-transform before:duration-300 hover:before:scale-x-100 hover:before:origin-left",
              "before:bg-[#9b87f5]",
              location.pathname === link.to 
                ? "text-[#9b87f5] before:scale-x-100" 
                : "text-black hover:text-[#9b87f5]"
            )}
          >
            {link.label}
          </button>
        </Magnetic>
      ))}
      <Magnetic intensity={0.5}>
        <ResourcesDropdown onClick={onClick} />
      </Magnetic>
    </nav>
  );

  const MobileResourcesLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="pl-4 flex flex-col gap-4">
      <Link 
        to="/resources/blog" 
        className="text-[15px] text-black hover:text-[#9b87f5] transition-colors"
        onClick={onClick}
      >
        Blog
      </Link>
      <Link 
        to="/resources/learn" 
        className="text-[15px] text-black hover:text-[#9b87f5] transition-colors"
        onClick={onClick}
      >
        Learn
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="container flex h-16 items-center justify-between lg:px-8 md:px-6 px-4">
        <Magnetic intensity={0.3}>
          <Link 
            to="/" 
            className="flex items-center transition-opacity active:opacity-80 -ml-1 md:ml-0"
          >
            <motion.img 
              src="/logo.png"
              alt="Haptik"
              initial={false}
              animate={{ scale: isOpen ? 0.95 : 1 }}
              className="h-7 w-auto"
            />
          </Link>
        </Magnetic>

        <NavLinks className="hidden md:flex" />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full hover:bg-accent active:scale-95 transition-all duration-200"
            >
              <Menu 
                className="h-5 w-5 transition-all duration-300" 
                style={{ 
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  opacity: isOpen ? 0.5 : 1
                }}
              />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-full sm:w-[380px] pr-0 border-l border-border/40"
          >
            <div className="flex flex-col gap-8 mt-8">
              <div className="flex flex-col gap-8">
                {[
                  { to: "/search", label: "Find Creators" },
                  { to: "/how-it-works", label: "How It Works" },
                  { to: "/pricing", label: "Pricing" },
                ].map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className={cn(
                      "text-[15px] font-medium transition-colors",
                      location.pathname === link.to 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/resources"
                    className={cn(
                      "text-[15px] font-medium transition-colors",
                      location.pathname.startsWith('/resources')
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Resources
                  </Link>
                  <MobileResourcesLinks onClick={() => setIsOpen(false)} />
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <Magnetic intensity={0.4}>
                      <Button 
                        variant="ghost" 
                        asChild 
                        onClick={() => setIsOpen(false)}
                        className="w-full justify-start text-[15px] font-medium h-11"
                      >
                        <Link to="/login">Log In</Link>
                      </Button>
                    </Magnetic>
                    <Magnetic intensity={0.4}>
                      <Button 
                        asChild 
                        onClick={() => setIsOpen(false)}
                        className="w-full justify-start text-[15px] font-medium h-11 bg-primary hover:bg-primary/90"
                      >
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </Magnetic>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-3">
          <Magnetic intensity={0.4}>
            <Button 
              variant="ghost" 
              asChild 
              className="h-11 px-5 text-[15px] font-medium hover:bg-accent/50"
            >
              <Link to="/login">Log In</Link>
            </Button>
          </Magnetic>
          <Magnetic intensity={0.4}>
            <Button 
              asChild 
              className="h-11 px-5 text-[15px] font-medium bg-primary hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </header>
  );
};

export default Header;
