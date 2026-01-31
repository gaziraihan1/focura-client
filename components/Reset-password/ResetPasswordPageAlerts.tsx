import { motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";

interface ResetPasswordPageAlertsProps {
  error: string;
  success: boolean;
}

export function ResetPasswordPageAlerts({
  error,
  success,
}: ResetPasswordPageAlertsProps) {
  return (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
        >
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <p className="text-red-500 text-sm">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3"
        >
          <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-green-500 text-sm font-medium">
              Password reset successfully!
            </p>
            <p className="text-green-500/80 text-xs mt-1">
              Redirecting to login...
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
}