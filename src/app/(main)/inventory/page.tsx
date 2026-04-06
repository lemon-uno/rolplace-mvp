import { InventoryList } from '@/features/inventory/components/InventoryList';

export const metadata = {
  title: 'Inventario de Autos | Rolplace',
  description: 'Encuentra el auto perfecto para ti. Autos seminuevos de calidad con la mejor garantía del mercado.',
};

export default function InventoryPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <InventoryList />
    </main>
  );
}
