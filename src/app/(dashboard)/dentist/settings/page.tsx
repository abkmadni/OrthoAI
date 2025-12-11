"use client"

import { useState } from "react"
import { Building2, Clock, CreditCard, Save } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
               <h3 className="text-lg font-medium text-gray-900">Clinic Profile</h3>
               <p className="text-sm text-gray-500">Manage your public facing information.</p>
            </div>
            <div className="grid gap-6 max-w-2xl">
               <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Clinic Name</label>
                  <input type="text" defaultValue="Bright Smile Dental" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" defaultValue="+1 555 000 0000" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" defaultValue="contact@brightsmile.com" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
               </div>
               <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <textarea rows={3} defaultValue="123 Dental Avenue, Suite 400, New York, NY" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>
            </div>
          </div>
        )
      case "hours":
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
               <h3 className="text-lg font-medium text-gray-900">Operating Hours</h3>
               <p className="text-sm text-gray-500">Set your weekly availability for appointments.</p>
            </div>
            <div className="space-y-4 max-w-2xl">
               {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                 <div key={day} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center gap-3">
                       <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                       <span className="font-medium text-sm w-24">{day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                       <input type="time" defaultValue="09:00" className="border rounded px-2 py-1" />
                       <span className="text-gray-400">-</span>
                       <input type="time" defaultValue="17:00" className="border rounded px-2 py-1" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )
      case "pricing":
         return (
            <div className="space-y-6 animate-in fade-in duration-200">
               <div>
                  <h3 className="text-lg font-medium text-gray-900">Service Pricing</h3>
                  <p className="text-sm text-gray-500">Manage your standard procedure rates.</p>
               </div>
               <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                           <th className="px-4 py-3">Service Name</th>
                           <th className="px-4 py-3">Code</th>
                           <th className="px-4 py-3 text-right">Price ($)</th>
                           <th className="px-4 py-3 w-10"></th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 bg-white">
                        {[
                           { name: "General Consultation", code: "GC001", price: "50.00" },
                           { name: "X-Ray Panoramic", code: "XR002", price: "120.00" },
                           { name: "Root Canal (Molar)", code: "RC101", price: "800.00" },
                           { name: "Teeth Whitening", code: "TW005", price: "350.00" },
                        ].map((service, i) => (
                           <tr key={i}>
                              <td className="px-4 py-3 font-medium">{service.name}</td>
                              <td className="px-4 py-3 text-gray-500">{service.code}</td>
                              <td className="px-4 py-3 text-right font-mono">{service.price}</td>
                              <td className="px-4 py-3 text-right text-blue-600 cursor-pointer hover:underline">Edit</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
                  <div className="p-3 bg-gray-50 border-t text-center">
                     <button className="text-sm text-blue-600 font-medium hover:underline">+ Add New Service</button>
                  </div>
               </div>
            </div>
         )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your clinic preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
         {/* Settings Navigation */}
         <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
            <button 
               onClick={() => setActiveTab("profile")}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
               <Building2 className="w-4 h-4" />
               Clinic Profile
            </button>
            <button 
               onClick={() => setActiveTab("hours")}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'hours' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
               <Clock className="w-4 h-4" />
               Availability
            </button>
            <button 
               onClick={() => setActiveTab("pricing")}
               className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pricing' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
               <CreditCard className="w-4 h-4" />
               Pricing & Services
            </button>
         </nav>

         {/* Content Area */}
         <div className="flex-1 min-w-0 bg-white rounded-xl border shadow-sm p-6">
            {renderTabContent()}
            
            <div className="mt-8 pt-6 border-t flex justify-end">
               <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">
                  <Save className="w-4 h-4" />
                  Save Changes
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}