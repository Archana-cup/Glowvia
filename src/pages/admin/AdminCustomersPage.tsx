import React from 'react'
import { AdminNav } from '../../components/layout/AdminNav'

export const AdminCustomersPage: React.FC = () => {
  // Demonstration registered customer accounts
  const registeredAccounts = [
    {
      id: 'cust-001',
      fullName: 'Aditi Sharma',
      email: 'customer@glowvia.com',
      phone: '+91 98765 43210',
      role: 'customer',
      ordersCount: 2,
      joined: '2026-01-15',
    },
    {
      id: 'cust-002',
      fullName: 'Glowvia Store Administrator',
      email: 'admin@glowvia.com',
      phone: '+91 99999 88888',
      role: 'admin',
      ordersCount: 5,
      joined: '2026-01-01',
    },
    {
      id: 'cust-003',
      fullName: 'Pooja Mehta',
      email: 'pooja.mehta@example.com',
      phone: '+91 98111 22334',
      role: 'customer',
      ordersCount: 1,
      joined: '2026-02-10',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <AdminNav />

      <div className="mb-6">
        <h2 className="text-xl font-serif font-semibold text-[#29212A]">
          Registered Customers ({registeredAccounts.length})
        </h2>
        <p className="text-xs text-[#71676D] mt-0.5">
          Privacy-protected view of registered store members.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3E5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F7] border-b border-[#EAE3E5] text-[#71676D] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF8F7]">
              {registeredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-[#FAF8F7]/60">
                  <td className="py-3 px-4 font-semibold text-[#29212A]">
                    {account.fullName}
                  </td>
                  <td className="py-3 px-4 text-[#71676D]">{account.email}</td>
                  <td className="py-3 px-4 text-[#71676D]">{account.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        account.role === 'admin'
                          ? 'bg-[#267A50] text-white'
                          : 'bg-[#FFF0F5] text-[#267A50]'
                      }`}
                    >
                      {account.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#71676D]">{account.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
