// app/components/Topbar.tsx
const Topbar = () => {
  return (
    <header className="h-16 bg-white border-b px-6 flex justify-end items-center fixed left-64 right-0 top-0 z-10">
      <div className="flex items-center space-x-4">
        <span className="text-sm">Admin</span>
        <img
          src="/avatar.png"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </div>
    </header>
  )
}

export default Topbar
