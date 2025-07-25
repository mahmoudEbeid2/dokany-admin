import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoaderSpinner from '../ui/Loader';

const BaseURL = import.meta.env.VITE_API;

interface Payout {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending';
  payout_method: string;
  date: string;
  seller: {
    user_name: string;
    email: string;
  };
  isPaid?: boolean;
}

const PayoutsList: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await axios.get(`${BaseURL}/api/payouts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = res.data.map((p: Payout) => ({
          ...p,
          isPaid: p.status === 'Paid',
        }));

        setPayouts(transformed);
      } catch (err) {
        console.error('Failed to fetch payouts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, []);

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    const newStatus = currentStatus ? 'Pending' : 'Paid';

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BaseURL}/api/payouts/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayouts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isPaid: !currentStatus, status: newStatus } : p
        )
      );
    } catch (err) {
      console.error('Failed to update payout status:', err);
      alert('Failed to update payout. Please try again.');
    }
  };

  if (loading) return <LoaderSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payout Requests</h1>
        <p className="text-gray-600 mt-2">Manage withdrawal requests from sellers</p>
      </div>

      {/* Mobile view */}
      <div className="space-y-4 lg:hidden">
        {payouts.map((payout) => (
          <div key={payout.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-base font-semibold text-gray-900">{payout.seller.user_name}</div>
                <div className="text-sm text-gray-500">{payout.payout_method}</div>
              </div>
              <span className="text-blue-700 font-bold">{payout.amount} $</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleTogglePaid(payout.id, payout.isPaid ?? false)}
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

      {/* Desktop view */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden lg:block">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Payout Requests ({payouts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paypal Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.seller.user_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.payout_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-700 font-bold">$ {payout.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                    <button
                      onClick={() => handleTogglePaid(payout.id, payout.isPaid ?? false)}
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