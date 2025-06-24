import '@fontsource-variable/inter';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Health Blog',
  description: 'Your guide to a healthier lifestyle',
};

// This function helps remove the data-testim attribute warning
function removeDataTestimAttributes() {
  if (typeof window !== 'undefined') {
    // Run after component mounts
    setTimeout(() => {
      try {
        const bodyElement = document.querySelector('body');
        if (bodyElement && bodyElement.hasAttribute('data-testim-main-word-scripts-loaded')) {
          bodyElement.removeAttribute('data-testim-main-word-scripts-loaded');
        }
      } catch (error) {
        console.error('Error removing data-testim attribute:', error);
      }
    }, 100);
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        {/* Background Pattern */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
        
        <Header />
        
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
} 