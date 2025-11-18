"use client"

import { useRouter } from "next/navigation"
import { Users, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {

  const router = useRouter()

  const handleNavigate = (path) => {
    router.push(path)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-4xl text-center border border-gray-700">

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          🚀 Platform Access Portal
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          Select the appropriate entry point for your role.
        </p>

        <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-5">

          <button
            onClick={() => handleNavigate('/user')}
            className="group flex flex-1 items-center p-6 bg-gray-700 rounded-xl border border-gray-600 hover:border-cyan-500 transition duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/50 transform hover:scale-[1.02] text-left ring-1 ring-transparent focus:ring-2 focus:ring-cyan-500"
          >
            <Users className="w-8 h-8 text-cyan-400 mr-4 flex-shrink-0" />
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-white">User Console</h2>
              <p className="text-sm text-gray-400 mt-1">Access the user want to see.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 ml-4 transition-all group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => handleNavigate('/admin')}
            className="group flex flex-1 items-center p-6 bg-gray-700 rounded-xl border border-gray-600 hover:border-purple-500 transition duration-300 ease-in-out shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02] text-left ring-1 ring-transparent focus:ring-2 focus:ring-purple-500"
          >
            <Shield className="w-8 h-8 text-purple-400 mr-4 flex-shrink-0" />
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1">Manage the data of currency.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 ml-4 transition-all group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Note: This portal is for demonstration purposes only. No real data is being processed.
          </p>
        </div>

      </div>
    </div>
  )
}