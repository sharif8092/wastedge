import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Home, ChevronRight } from 'lucide-react';

export function SubdomainsPage() {
  const [subdomain, setSubdomain] = useState('');
  const [domain, setDomain] = useState('wastedge.in');
  const [useCustomFolder, setUseCustomFolder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain) {
      setMessage({ type: 'error', text: 'Please enter a subdomain name.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('subdomains')
        .insert([
          {
            subdomain_name: subdomain,
            domain_name: domain,
            use_custom_folder: useCustomFolder,
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          setMessage({ type: 'error', text: 'This subdomain already exists.' });
        } else {
          setMessage({ type: 'error', text: error.message || 'Failed to create subdomain.' });
        }
      } else {
        setMessage({ type: 'success', text: `Subdomain ${subdomain}.${domain} created successfully!` });
        setSubdomain('');
        setUseCustomFolder(false);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
          <Home size={16} className="mr-2" />
          <ChevronRight size={16} className="mx-1" />
          <span>Websites</span>
          <ChevronRight size={16} className="mx-1" />
          <span>wastedge.in</span>
          <ChevronRight size={16} className="mx-1" />
          <span>Domains</span>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-gray-900 font-semibold">Subdomains</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 font-display">Subdomains</h1>

        {/* Create Subdomain Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Create a New Subdomain</h2>
          </div>
          
          <div className="p-6">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subdomain</label>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Enter subdomain"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Domains</label>
                  <div className="relative">
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="wastedge.in">wastedge.in</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex items-center">
                <input
                  id="custom-folder"
                  type="checkbox"
                  checked={useCustomFolder}
                  onChange={(e) => setUseCustomFolder(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="custom-folder" className="ml-3 block text-sm text-gray-700 cursor-pointer">
                  Custom folder for subdomain
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !subdomain}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all
                    ${(!subdomain || isSubmitting) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 cursor-pointer shadow-sm'
                    }
                  `}
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
