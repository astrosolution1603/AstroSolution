import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      profileComplete: true,
      createdAt: true,
      _count: {
        select: { chatSessions: true }
      }
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Users</h1>
        <p className="text-slate-500 mt-2 text-lg">View and manage all registered users.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone / Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Chats</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{user.phone || "No Phone"}</span>
                      <span className="text-xs text-slate-400">{user.email || "No Email"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-amber-100 text-amber-800 border-amber-200' : user.role === 'ASTROLOGER' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.profileComplete ? (
                      <span className="text-emerald-600 font-bold">Complete</span>
                    ) : (
                      <span className="text-amber-500 font-bold">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{user._count.chatSessions}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{user.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
