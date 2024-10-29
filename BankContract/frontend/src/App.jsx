import { useState, useMemo } from 'react';
import WalletBar from './WalletBar';
import { useAccount, useContract, useSendTransaction, useReadContract } from "@starknet-react/core";
import { shortString } from "starknet";
import abi from "../abi/abi.json";

export default function App() {
  const [activeTab, setActiveTab] = useState('account');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  const contractAddress = "0x3bc9d8dc47cdc280d9b860b3ea2ada99fa0ac22171c795000bd5fef2fb1ff3";
  const { address: userAddress } = useAccount();

  const { contract } = useContract({
    abi,
    address: contractAddress,
  });

  // Convert string name to felt array (ByteArray in Starknet)
  const nameToFelt = (str) => {
    return shortString.encodeShortString(str);
  };

  // Read user balance
  const { data: userBalance } = useReadContract({
    functionName: "get_balance",
    args: [],
    contract: contract,
    watch: true,
  });

  // Create Account Transaction
  const createAccountCalls = useMemo(() => {
    if (!contract || !name || !age) return [];
    return [contract.populate("createAccount", [nameToFelt(name), BigInt(age)])];
  }, [contract, name, age]);

  const { send: createAccount } = useSendTransaction({
    calls: createAccountCalls,
  });

  // Deposit Transaction
  const depositCalls = useMemo(() => {
    if (!contract || !depositAmount) return [];
    return [contract.populate("deposit", [BigInt(depositAmount)])];
  }, [contract, depositAmount]);

  const { send: deposit } = useSendTransaction({
    calls: depositCalls,
  });

  // Withdraw Transaction
  const withdrawCalls = useMemo(() => {
    if (!contract || !withdrawAmount) return [];
    return [contract.populate("withdraw", [BigInt(withdrawAmount)])];
  }, [contract, withdrawAmount]);

  const { send: withdraw } = useSendTransaction({
    calls: withdrawCalls,
  });

  // Transfer Transaction
  const transferCalls = useMemo(() => {
    if (!contract || !transferAmount || !recipientAddress) return [];
    return [contract.populate("transfer", [recipientAddress, BigInt(transferAmount)])];
  }, [contract, transferAmount, recipientAddress]);

  const { send: transfer } = useSendTransaction({
    calls: transferCalls,
  });

  // Form submission handlers
  const handleCreateAccount = async (event) => {
    event.preventDefault();
    if (createAccount) {
      try {
        await createAccount();
        setName('');
        setAge('');
      } catch (error) {
        console.error("Error creating account:", error);
      }
    }
  };

  const handleDeposit = async (event) => {
    event.preventDefault();
    if (deposit) {
      try {
        await deposit();
        setDepositAmount('');
      } catch (error) {
        console.error("Error depositing:", error);
      }
    }
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    if (withdraw) {
      try {
        await withdraw();
        setWithdrawAmount('');
      } catch (error) {
        console.error("Error withdrawing:", error);
      }
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();
    if (transfer) {
      try {
        await transfer();
        setTransferAmount('');
        setRecipientAddress('');
      } catch (error) {
        console.error("Error transferring:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800 drop-shadow-md">
          DBank - Decentralized Banking
        </h1>
        <WalletBar />
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="flex bg-indigo-600 text-white">
            {['account', 'deposit', 'withdraw', 'transfer', 'balance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-center capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-800 font-semibold'
                    : 'hover:bg-indigo-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'account' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Create Account</h2>
                <p className="text-gray-600 mb-4">Set up your new bank account here.</p>
                <form onSubmit={handleCreateAccount} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1 text-indigo-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium mb-1 text-indigo-700">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="18"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      min="1"
                      max="150"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Create Account
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'deposit' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Deposit Funds</h2>
                <p className="text-gray-600 mb-4">Add money to your account.</p>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <label htmlFor="deposit-amount" className="block text-sm font-medium mb-1 text-indigo-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      id="deposit-amount"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Deposit
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Withdraw Funds</h2>
                <p className="text-gray-600 mb-4">Withdraw money from your account.</p>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label htmlFor="withdraw-amount" className="block text-sm font-medium mb-1 text-indigo-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      id="withdraw-amount"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Withdraw
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'transfer' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Transfer Funds</h2>
                <p className="text-gray-600 mb-4">Send money to another account.</p>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div>
                    <label htmlFor="recipient" className="block text-sm font-medium mb-1 text-indigo-700">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="transfer-amount" className="block text-sm font-medium mb-1 text-indigo-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      id="transfer-amount"
                      className="w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      required
                      min="0"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Transfer
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'balance' && (
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Account Balance</h2>
                <p className="text-gray-600 mb-4">View your current balance.</p>
                <p className="text-4xl font-bold mb-4 text-indigo-600">
                  {userBalance ? userBalance.toString() : '0.00'} ETH
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}