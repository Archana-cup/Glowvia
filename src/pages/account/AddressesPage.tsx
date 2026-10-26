import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

interface SavedAddress {
  id: string
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  pinCode: string
  isDefault: boolean
}

export const AddressesPage: React.FC = () => {
  const { user } = useAuth()
  const { success } = useToast()

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-001',
      fullName: user?.fullName || 'Aditi Sharma',
      phone: user?.phone || '+91 98765 43210',
      addressLine: 'Flat 402, Bloom Heights, Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400050',
      isDefault: true,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newFullName, setNewFullName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddressLine, setNewAddressLine] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newState, setNewState] = useState('')
  const [newPinCode, setNewPinCode] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFullName || !newAddressLine || !newCity || !newPinCode) return

    const newAddr: SavedAddress = {
      id: 'addr-' + Date.now(),
      fullName: newFullName,
      phone: newPhone,
      addressLine: newAddressLine,
      city: newCity,
      state: newState,
      pinCode: newPinCode,
      isDefault: addresses.length === 0,
    }

    setAddresses([...addresses, newAddr])
    setShowAddForm(false)
    success('Address added successfully!')

    // Reset fields
    setNewFullName('')
    setNewPhone('')
    setNewAddressLine('')
    setNewCity('')
    setNewState('')
    setNewPinCode('')
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id))
    success('Address removed')
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
    success('Default address updated')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between border-b border-[#EAE3E5] pb-4">
        <div>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-xs text-[#71676D] hover:text-[#267A50]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Account</span>
          </Link>
          <h1 className="text-3xl font-serif font-semibold text-[#29212A] mt-2">
            Delivery Addresses
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-full bg-[#267A50] hover:bg-[#185C3A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mb-8 p-6 bg-white rounded-3xl border border-[#267A50]/30 shadow-md space-y-4 text-xs"
        >
          <h3 className="font-serif font-semibold text-base text-[#29212A]">
            Add New Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase font-semibold text-[#29212A] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-[#29212A] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block uppercase font-semibold text-[#29212A] mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={newAddressLine}
                onChange={(e) => setNewAddressLine(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-[#29212A] mb-1">City</label>
              <input
                type="text"
                required
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-[#29212A] mb-1">State</label>
              <input
                type="text"
                required
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
              />
            </div>
            <div>
              <label className="block uppercase font-semibold text-[#29212A] mb-1">
                PIN Code
              </label>
              <input
                type="text"
                required
                value={newPinCode}
                onChange={(e) => setNewPinCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EAE3E5] focus:outline-none focus:border-[#267A50]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#267A50] text-white font-semibold text-xs uppercase tracking-wider"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-full border border-[#EAE3E5] text-xs font-semibold text-[#71676D]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl bg-white border flex flex-col justify-between text-xs space-y-4 ${
              addr.isDefault ? 'border-[#267A50] ring-1 ring-[#267A50]/20' : 'border-[#EAE3E5]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[#29212A]">{addr.fullName}</span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFF0F5] text-[#267A50] font-semibold text-[10px]">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[#71676D] leading-relaxed">{addr.addressLine}</p>
              <p className="text-[#71676D]">
                {addr.city}, {addr.state} - {addr.pinCode}
              </p>
              <p className="text-[#71676D] mt-1">Phone: {addr.phone}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#FAF8F7]">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs text-[#267A50] font-medium hover:underline"
                >
                  Set as default
                </button>
              ) : (
                <span className="text-[11px] text-[#267A50] font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Primary address
                </span>
              )}

              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-[#71676D] hover:text-red-600 p-1"
                aria-label="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
