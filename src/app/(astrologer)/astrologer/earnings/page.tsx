import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";
import { BankDetailsForm } from "@/components/astrologer/BankDetailsForm";

export default async function AstrologerEarningsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      wallet: true,
    }
  });

  if (!user || user.role !== "ASTROLOGER") {
    redirect("/chat");
  }

  const wallet = user.wallet;
  
  const transactions = await prisma.transaction.findMany({
    where: { astrologerId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  
  const totalEarned = transactions.reduce((sum, tx) => sum + tx.astrologerCut, 0);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-amber-500" />
            Earnings & Wallet
          </h1>
          <p className="text-white/60">Track your 50% revenue share from Gurudakshina and Poojas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Wallet className="w-24 h-24 text-amber-500" />
            </div>
            <h3 className="text-amber-500 font-semibold mb-2">Available Balance</h3>
            <div className="text-5xl font-black text-white mb-2">
              ₹{wallet?.availableBalance || 0}
            </div>
            <p className="text-white/50 text-sm">Ready to be withdrawn</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-white/60 font-semibold mb-2">Lifetime Earnings</h3>
            <div className="text-5xl font-black text-white mb-2">
              ₹{totalEarned}
            </div>
            <p className="text-white/50 text-sm">Total 50% split earned</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold">Transaction History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/60 font-medium">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Total Paid by User</th>
                  <th className="px-6 py-4">Your 50% Cut</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                      No earnings yet. Start chatting with users to earn Gurudakshina!
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white/80">
                        {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded text-xs">
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">₹{tx.amount}</td>
                      <td className="px-6 py-4 font-bold text-green-400 flex items-center gap-1">
                        <ArrowDownLeft className="w-4 h-4" />
                        +₹{tx.astrologerCut}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 text-xs font-semibold">{tx.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <BankDetailsForm initialDetails={{
          bankAccountHolder: user.bankAccountHolder || "",
          bankAccountNumber: user.bankAccountNumber || "",
          bankIfscCode: user.bankIfscCode || "",
          bankName: user.bankName || ""
        }} />

      </div>
    </div>
  );
}
