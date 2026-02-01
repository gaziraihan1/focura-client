"use client"
import { CheckCircle } from 'lucide-react'
import React from 'react'
import { motion } from "framer-motion"

export default function SuccessState() {
  return (
    <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3"
          >
            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
            <p className="text-green-500 text-sm">
              Password reset link sent! Check your email.
            </p>
          </motion.div>
  )
}
