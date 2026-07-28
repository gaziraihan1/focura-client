'use client';

import { useState } from 'react';
import { Smartphone, Loader2, Copy, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  useSecuritySettings,
  useSetupTwoFactor,
  useVerifyTwoFactor,
  useDisableTwoFactor,
} from '@/hooks/useSecurity';
import { announce } from '@/lib/a11y';

export function TwoFactorSection() {
  const { data: securitySettings, isLoading: settingsLoading } = useSecuritySettings();
  const setupTwoFactor = useSetupTwoFactor();
  const verifyTwoFactor = useVerifyTwoFactor();
  const disableTwoFactor = useDisableTwoFactor();

  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'verify' | 'disable'>('idle');
  const [setupData, setSetupData] = useState<{ secret: string; uri: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSetup2FA = async () => {
    const result = await setupTwoFactor.mutateAsync();
    setSetupData(result);
    setTwoFactorStep('verify');
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length < 6) return;
    await verifyTwoFactor.mutateAsync(verificationCode);
    setTwoFactorStep('idle');
    setSetupData(null);
    setVerificationCode('');
    announce('Two-factor authentication has been enabled');
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) return;
    await disableTwoFactor.mutateAsync(disablePassword);
    setTwoFactorStep('idle');
    setDisablePassword('');
    announce('Two-factor authentication has been disabled');
  };

  const handleCancel2FA = () => {
    setTwoFactorStep('idle');
    setSetupData(null);
    setVerificationCode('');
    setDisablePassword('');
  };

  const copySecretToClipboard = async () => {
    if (!setupData) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may not be available
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
          <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Two-Factor Authentication</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      {settingsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" aria-label="Loading security settings" />
        </div>
      ) : twoFactorStep === 'verify' && setupData ? (
        /* Step 2: Show QR Code + manual entry, then verify */
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* QR Code */}
            <div className="shrink-0 p-4 rounded-xl bg-white">
              <QRCodeSVG value={setupData.uri} size={180} level="M" />
            </div>

            {/* Manual setup info */}
            <div className="space-y-3 flex-1 min-w-0">
              <div>
                <p className="text-sm font-medium">Scan this QR code with your authenticator app</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Or enter the code manually if you can&apos;t scan the QR code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Setup Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-muted text-xs font-mono break-all select-all">
                    {setupData.secret}
                  </code>
                  <button
                    onClick={copySecretToClipboard}
                    className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
                    aria-label="Copy secret key"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verify Code */}
          <div className="max-w-sm space-y-3">
            <div>
              <label htmlFor="2fa-code" className="block text-xs font-medium text-muted-foreground mb-1.5">
                Enter the 6-digit code from your authenticator app
              </label>
              <input
                id="2fa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5  text-center tracking-widest text-lg font-mono"
                placeholder="000000"
                maxLength={6}
                aria-required="true"
                aria-describedby="2fa-code-hint"
              />
              <p id="2fa-code-hint" className="text-xs text-muted-foreground mt-1">
                Enter the code shown in your authenticator app
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleVerify2FA}
                disabled={verifyTwoFactor.isPending || verificationCode.length < 6}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {verifyTwoFactor.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {verifyTwoFactor.isPending ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button
                onClick={handleCancel2FA}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : twoFactorStep === 'disable' ? (
        /* Disable 2FA - requires password */
        <div className="space-y-4 max-w-md">
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Disable Two-Factor Authentication
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This will make your account less secure. You&apos;ll need to enter your current password to confirm.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="disable-2fa-password" className="block text-xs font-medium text-muted-foreground mb-1.5">
              Current Password
            </label>
            <input
              id="disable-2fa-password"
              type="password"
              value={disablePassword}
              onChange={(e) => setDisablePassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              placeholder="Enter your current password"
              aria-required="true"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDisable2FA}
              disabled={disableTwoFactor.isPending || !disablePassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {disableTwoFactor.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {disableTwoFactor.isPending ? 'Disabling...' : 'Disable 2FA'}
            </button>
            <button
              onClick={handleCancel2FA}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Idle state - show current 2FA status */
        <div className="flex items-center justify-between p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              securitySettings?.twoFactorEnabled ? 'bg-green-500/10' : 'bg-muted'
            }`}>
              {securitySettings?.twoFactorEnabled ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Smartphone className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {securitySettings?.twoFactorEnabled ? 'Enabled' : 'Not Configured'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {securitySettings?.twoFactorEnabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (securitySettings?.twoFactorEnabled) {
                setTwoFactorStep('disable');
              } else {
                handleSetup2FA();
              }
            }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ml-3 ${
              securitySettings?.twoFactorEnabled
                ? 'text-red-600 hover:bg-red-500/10 border border-red-500/20'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {securitySettings?.twoFactorEnabled ? 'Disable' : 'Set Up'}
          </button>
        </div>
      )}
    </div>
  );
}
