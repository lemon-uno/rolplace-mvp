import { VehicleDetail } from '@/features/inventory/components/VehicleDetail';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `Vehículo | Rolplace`,
    description: 'Detalles del vehículo',
  };
}

export default function VehicleDetailPage() {
  return <VehicleDetail />;
}
