import React, { useState } from 'react'

const AUTH_STORAGE_KEY = 'echo_auth'

export function OtpLogin({ apiBase = '', onSuccess }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleRequestCode = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${apiBase}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || '無法寄送驗證碼')
      }

      setStep('code')
      setMessage('驗證碼已寄出，請查看信箱')
    } catch (err) {
      setError(err?.message || '寄送失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${apiBase}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || '驗證失敗')
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.account))
      onSuccess?.(data.account)
    } catch (err) {
      setError(err?.message || '驗證失敗')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/40 to-cyber-green/30 blur-3xl rounded-full" />

        <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] rounded-xl border-2 border-neon-purple/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>🔐</span>
              <span className="text-white font-bold text-sm">OTP 登入</span>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="text-center">
              <h2 className="text-cyber-green font-y2k text-lg neon-text-green">FROM DA ECHO</h2>
              <p className="text-metal-silver text-xs mt-1">輸入 Email 取得 6 碼驗證碼</p>
            </div>

            {error && (
              <div className="text-center text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                {error}
              </div>
            )}
            {message && (
              <div className="text-center text-cyber-green text-xs bg-cyber-green/10 border border-cyber-green/20 rounded px-3 py-2">
                {message}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleRequestCode} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-3 py-2 rounded bg-black/40 border border-metal-silver/30 text-white text-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-sm disabled:opacity-50"
                >
                  {isLoading ? '寄送中...' : '寄送驗證碼'}
                </button>
              </form>
            )}

            {step === 'code' && (
              <form onSubmit={handleVerifyCode} className="space-y-3">
                <div className="text-xs text-metal-silver">
                  Email：<span className="text-white">{email}</span>
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="輸入 6 碼"
                  maxLength={6}
                  required
                  className="w-full px-3 py-2 rounded bg-black/40 border border-metal-silver/30 text-white text-sm tracking-[0.4em] text-center"
                />
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="w-full py-2.5 rounded bg-gradient-to-r from-cyber-green to-neon-purple text-white font-bold text-sm disabled:opacity-50"
                >
                  {isLoading ? '驗證中...' : '登入'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setCode('')
                  }}
                  className="w-full py-2 text-xs text-metal-silver/70 hover:text-metal-silver"
                >
                  重新輸入 Email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpLogin
