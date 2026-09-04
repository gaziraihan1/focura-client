import { StorageOverviewPage } from '@/components/dashboard/storage/overview/StorageOverviewPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Storage Overview | Gablura',
  description: 'Monitor and manage your file storage across workspaces',
};

export default function StoragePage() {
  return <StorageOverviewPage />;
}