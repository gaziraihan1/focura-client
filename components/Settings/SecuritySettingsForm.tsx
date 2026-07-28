'use client';

import { ChangePasswordSection } from './Security/ChangePasswordSection';
import { TwoFactorSection } from './Security/TwoFactorSection';
import { ActiveSessionsSection } from './Security/ActiveSessionsSection';

export function SecuritySettingsForm() {
  return (
    <div className="space-y-8">
      <ChangePasswordSection />
      <TwoFactorSection />
      <ActiveSessionsSection />
    </div>
  );
}
