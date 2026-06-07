import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowUpRight, ArrowDownLeft, RefreshCcw, Search, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'funding';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  party: string;
  reference: string;
}

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.role === 'investor' ? 1250000 : 45000);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-1004',
      type: 'funding',
      amount: 50000,
      date: '2024-03-01',
      status: 'completed',
      party: 'TechNova Solutions',
      reference: 'Seed Round A'
    },
    {
      id: 'TXN-1003',
      type: 'deposit',
      amount: 100000,
      date: '2024-02-28',
      status: 'completed',
      party: 'Bank Account ****4556',
      reference: 'Wire Transfer'
    },
    {
      id: 'TXN-1002',
      type: 'transfer',
      amount: 2500,
      date: '2024-02-15',
      status: 'pending',
      party: 'Legal Services LLC',
      reference: 'Consulting Fee'
    }
  ]);

  const handleTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (activeTab !== 'deposit' && val > balance) {
      toast.error('Insufficient funds');
      return;
    }

    // Process transaction
    if (activeTab === 'deposit') setBalance(b => b + val);
    else setBalance(b => b - val);

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(Math.random() * 10000) + 2000}`,
      type: activeTab,
      amount: val,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      party: activeTab === 'deposit' ? 'Bank Account ****4556' : (activeTab === 'withdraw' ? 'Bank Account ****4556' : 'External Wallet'),
      reference: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} via Nexus`
    };

    setTransactions([newTxn, ...transactions]);
    setAmount('');
    toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} of $${val.toLocaleString()} successful!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'gray';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="text-success-600" size={20} />;
      case 'withdrawal': return <ArrowUpRight className="text-error-600" size={20} />;
      case 'transfer': return <RefreshCcw className="text-primary-600" size={20} />;
      case 'funding': return <ShieldCheck className="text-accent-600" size={20} />;
      default: return <DollarSign className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet & Payments</h1>
          <p className="text-gray-600">Manage your funds and transactions</p>
        </div>
        <Button leftIcon={<RefreshCcw size={16} />} variant="outline">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-primary-900 to-primary-800 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <CreditCard size={100} />
            </div>
            <CardBody className="p-6 relative z-10">
              <p className="text-primary-200 font-medium mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${activeTab === 'deposit' ? 'bg-white text-primary-900' : 'bg-primary-800 hover:bg-primary-700'}`}
                >
                  Deposit
                </button>
                <button 
                  onClick={() => setActiveTab('withdraw')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${activeTab === 'withdraw' ? 'bg-white text-primary-900' : 'bg-primary-800 hover:bg-primary-700'}`}
                >
                  Withdraw
                </button>
                <button 
                  onClick={() => setActiveTab('transfer')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${activeTab === 'transfer' ? 'bg-white text-primary-900' : 'bg-primary-800 hover:bg-primary-700'}`}
                >
                  Transfer
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Action Form */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900 capitalize">{activeTab} Funds</h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 py-2 border"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'deposit' ? 'From' : 'To'}
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border">
                    <option>Bank Account ending in 4556</option>
                    <option>Debit Card ending in 1234</option>
                    {activeTab === 'transfer' && <option>Startup Escrow Account</option>}
                  </select>
                </div>

                <Button type="submit" fullWidth className="mt-4">
                  Confirm {activeTab}
                </Button>
              </form>
            </CardBody>
          </Card>

          {user?.role === 'investor' && (
            <Card className="bg-accent-50 border-accent-100">
              <CardBody className="p-4 flex items-start space-x-3">
                <ShieldCheck className="text-accent-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Funding Deals</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    You can directly fund startups via the Deals page. Escrow services are automatically provided.
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              txn.type === 'deposit' ? 'bg-success-100' :
                              txn.type === 'withdrawal' ? 'bg-error-100' :
                              txn.type === 'funding' ? 'bg-accent-100' : 'bg-primary-100'
                            }`}>
                              {getTransactionIcon(txn.type)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{txn.party}</div>
                              <div className="text-sm text-gray-500">{txn.reference} • {txn.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {txn.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-semibold ${
                            txn.type === 'deposit' ? 'text-success-600' :
                            txn.type === 'withdrawal' || txn.type === 'transfer' || txn.type === 'funding' ? 'text-gray-900' : 'text-gray-900'
                          }`}>
                            {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadge(txn.status)} size="sm" className="capitalize">
                            {txn.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
