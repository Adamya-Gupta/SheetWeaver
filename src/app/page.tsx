import PortfolioFormatter from '@/components/PortfolioFormatter';

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Portfolio Formatter</h1>
        <p className="text-gray-600">Automate Google Finance formulas and formatting</p>
      </div>
      
      <PortfolioFormatter />
    </main>
  );
}