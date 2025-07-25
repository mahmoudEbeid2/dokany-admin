import React, { useState } from 'react';
// يمكنك استبدال البيانات الوهمية بربطها بالستيت أو الريدوكس لاحقًا
const dummyPayouts = [
  { id: '1', sellerName: 'Ahmed Ali', paypalEmail: 'ahmed@example.com', amount: 120, isPaid: false },
  { id: '2', sellerName: 'Sara Mostafa', paypalEmail: 'sara@example.com', amount: 250, isPaid: true },
];

const PayoutsList: React.FC = () => {
  const [payouts, setPayouts] = useState(dummyPayouts);

  const handleTogglePaid = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, isPaid: !p.isPaid } : p));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-gray-600 mt-2">Manage withdrawal requests from sellers</p>
      </div>
      {/* Cards for mobile */}
      <div className="space-y-4 md:hidden">
        {payouts.map((payout) => (
          <div key={payout.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-base font-semibold text-gray-900">{payout.sellerName}</div>
                <div className="text-sm text-gray-500">{payout.paypalEmail}</div>
              </div>
              <span className="text-blue-700 font-bold">${payout.amount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTogglePaid(payout.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  payout.isPaid ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    payout.isPaid ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${
                payout.isPaid ? 'text-green-700' : 'text-red-700'
              }`}>
                {payout.isPaid ? 'Paid' : 'Not Paid'}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Table for desktop */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden md:block">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Payout Requests ({payouts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PayPal Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payout.sellerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{payout.paypalEmail}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-blue-700 font-bold">${payout.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePaid(payout.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        payout.isPaid ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          payout.isPaid ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`ml-3 text-sm font-medium ${
                      payout.isPaid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {payout.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayoutsList; 