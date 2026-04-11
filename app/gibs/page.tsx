import type { Metadata } from 'next';
import GibsClient from './GibsClient';

export const metadata: Metadata = {
  title: 'Earth Map (GIBS) - SpaceExplorer',
  description: 'View NASA Global Imagery Browse Services (GIBS) layers interactively.',
};

export default function GibsPage() {
  return <GibsClient />;
}
