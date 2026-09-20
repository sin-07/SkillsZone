import React from 'react';
import RegistrationWizard from '@/components/registration/RegistrationWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Family & Athletes | ColonyGames 2026',
  description:
    'Join ColonyGames 2026 Society Sports Fest. Multi-step registration for all 50+ families across 9 sports categories.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] py-6 sm:py-12">
      <RegistrationWizard />
    </div>
  );
}
