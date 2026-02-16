import { StorageOverviewPage } from '@/components/Dashboard/Storage/StorageOverviewPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Storage Overview | Focura',
  description: 'Monitor and manage your file storage across workspaces',
};

export default function StoragePage() {
  return <StorageOverviewPage />;
}