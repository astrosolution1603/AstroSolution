import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const totalChats = await prisma.chatSession.count();
  const totalMessages = await prisma.chatMessage.count();
  const poojaBookings = await prisma.poojaBooking.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2 text-lg">Welcome to the Astro Admin Control Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Users</h3>
          <p className="text-4xl font-black text-slate-900">{totalUsers}</p>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Chat Sessions</h3>
          <p className="text-4xl font-black text-slate-900">{totalChats}</p>
        </div>
        
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total AI Messages</h3>
          <p className="text-4xl font-black text-slate-900">{totalMessages}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Pooja Bookings</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Pooja Details</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {poojaBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                      No pooja bookings yet.
                    </td>
                  </tr>
                ) : (
                  poojaBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{booking.user.name}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700">{booking.user.phone || "No phone"}</div>
                        <div className="text-xs text-slate-400">{booking.user.email || ""}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{booking.poojaTitle}</td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">₹{booking.price.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs rounded-full uppercase tracking-wider font-bold border border-amber-200">
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {booking.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
