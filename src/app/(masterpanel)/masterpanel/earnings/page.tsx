import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DollarSign, ArrowUpRight, Wallet, Users } from "lucide-react";

import { MarkPaidButton } from "@/components/masterpanel/MarkPaidButton";

export default async function MasterPanelEarningsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch all transactions and wallets
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, phone: true } }, // the astrologer who got paid
    }
  });

  const wallets = await prisma.wallet.findMany({
    include: {
      user: { select: { name: true, phone: true, image: true, bankAccountHolder: true, bankAccountNumber: true, bankIfscCode: true, bankName: true } }
    },
    orderBy: { availableBalance: 'desc' }
  });

  const allAstros = await prisma.user.findMany({ where: { role: 'ASTROLOGER' } });
  const astroMap = Object.fromEntries(allAstros.map(a => [a.id, a.name]));

  // Calculate platform totals
  const platformEarningsFromTransactions = transactions.reduce((sum, tx) => sum + tx.platformCut, 0);
  
  // Get subscription earnings (simplistic calc based on active subscriptions)
  const subscribers = await prisma.user.findMany({
    where: { subscriptionStatus: "ACTIVE" }
  });
  const platformEarningsFromSubscriptions = subscribers.length * 1499;

  const totalPlatformRevenue = platformEarningsFromTransactions + platformEarningsFromSubscriptions;
  const totalPendingAstrologerPayouts = wallets.reduce((sum, w) => sum + w.availableBalance, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-emerald-500" />
          Revenue & Payouts
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Track 50/50 splits, platform revenue, and astrologer wallet balances.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-24 h-24 text-emerald-500" />
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            Total Platform Revenue
          </h3>
          <div className="text-4xl font-black text-slate-900 mb-2">
            ₹{totalPlatformRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-sm font-medium text-slate-500">
            From Splits: <span className="text-slate-900">₹{platformEarningsFromTransactions.toLocaleString('en-IN')}</span> <br/>
            From Subs: <span className="text-slate-900">₹{platformEarningsFromSubscriptions.toLocaleString('en-IN')}</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24 text-amber-500" />
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
            Owed to Astrologers
          </h3>
          <div className="text-4xl font-black text-slate-900 mb-2">
            ₹{totalPendingAstrologerPayouts.toLocaleString('en-IN')}
          </div>
          <p className="text-sm font-medium text-slate-500">
            Total available balances across all astrologers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Astrologer Wallets */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <h2 className="font-bold text-slate-900">Astrologer Wallets</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Astrologer</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {wallets.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400 font-medium">No astrologer wallets found.</td>
                  </tr>
                ) : (
                  wallets.map(wallet => (
                    <tr key={wallet.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{wallet.user.name}</div>
                        <div className="text-xs text-slate-500 font-medium mb-1">{wallet.user.phone}</div>
                        {wallet.user.bankAccountNumber && (
                          <div className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded-lg inline-block mt-1 border border-slate-200">
                            <span className="font-bold text-slate-700">🏦 {wallet.user.bankName}</span><br/>
                            A/C: <span className="font-mono">{wallet.user.bankAccountNumber}</span><br/>
                            IFSC: <span className="font-mono">{wallet.user.bankIfscCode}</span><br/>
                            Name: {wallet.user.bankAccountHolder}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-emerald-600">₹{wallet.availableBalance.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-6 py-4">
                        {wallet.availableBalance > 0 ? (
                          <MarkPaidButton astrologerId={wallet.astrologerId} disabled={false} />
                        ) : (
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-slate-900">Recent Split Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Astrologer</th>
                  <th className="px-6 py-4">Split (Admin / Astro)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400 font-medium">No transactions yet.</td>
                  </tr>
                ) : (
                  transactions.slice(0, 10).map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {tx.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {tx.type === "PAYOUT" ? (
                          <span className="text-blue-700">
                            Paid to {astroMap[tx.astrologerId] || 'Astrologer'} 
                            <span className="block text-[10px] text-slate-400 font-normal">Auth by: {tx.user?.name || 'Admin'}</span>
                          </span>
                        ) : tx.user?.name}
                      </td>
                      <td className="px-6 py-4">
                        {tx.type === "PAYOUT" ? (
                          <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-bold text-xs">
                            Payout: -₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <div className="flex items-center gap-3 font-bold text-xs">
                            <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              +₹{tx.platformCut.toLocaleString('en-IN')}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              +₹{tx.astrologerCut.toLocaleString('en-IN')}
                            </span>
                          </div>
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
    </div>
  );
}
