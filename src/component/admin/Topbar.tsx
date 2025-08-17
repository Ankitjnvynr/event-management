"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"

const Topbar = () => {
  const router = useRouter()
  const [user, setUser] = useState<{ id: number; name: string; email: string; avatar: string | null; role: string } | null>(null)
  const [open, setOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  return (
    <header className="h-16 bg-white border-b px-6 flex justify-between items-center fixed left-64 right-0 top-0 z-10 shadow-sm">
      {/* Left side - Logo / Title */}
      <div className="font-semibold text-lg tracking-wide text-gray-700">
        Admin Dashboard
      </div>

      {/* Right side - User info */}
      <div className="relative">
        {user && (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
          >
            <img
              src={user.avatar || "/avatar.png"}
              alt="Profile"
              className="w-9 h-9 rounded-full border object-cover hover:ring-2 hover:ring-gray-300 transition"
            />
          </button>
        )}

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 animate-fade-in">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              className="flex w-full items-center px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Profile page")}
            >
              <User size={16} className="mr-2" /> Profile
            </button>
            <button
              className="flex w-full items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Settings page")}
            >
              <Settings size={16} className="mr-2" /> Settings
            </button>
            <button
              className="flex w-full items-center px-4 cursor-pointer py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => {
                setOpen(false)
                setConfirmLogout(true)
              }}
            >
              <LogOut size={16} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirm Dialog */}
      {confirmLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="px-4 py-2 text-sm cursor-pointer rounded-md border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm cursor-pointer rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Topbar
