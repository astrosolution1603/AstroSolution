import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") redirect("/");

  const reports = await prisma.report.findMany({
    include: {
      user: { select: { name: true, email: true } },
      astrologer: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Reports</h1>
        <p className="text-slate-500 mt-2 text-lg">Review and manage reports against astrologers.</p>
      </div>

      <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Reported Astrologer</th>
                <th className="px-6 py-4">Reported By</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 w-1/3">Description</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <CheckCircle className="w-12 h-12 text-emerald-400" />
                      <p className="text-lg font-bold text-slate-700">All clear!</p>
                      <p>No reports found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{report.astrologer.name}</td>
                    <td className="px-6 py-4 text-slate-600">{report.user.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 break-words">{report.description}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {report.status === "OPEN" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          OPEN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          RESOLVED
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
