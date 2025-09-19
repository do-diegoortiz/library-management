import React from 'react';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Books', value: '150' },
    { name: 'Active Borrowings', value: '25' },
    { name: 'Available Copies', value: '120' },
  ];

  const navItems = [
    { name: 'Dashboard', href: '#' },
    { name: 'Books', href: '#' },
    { name: 'Borrowings', href: '#' },
    { name: 'Profile', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Library Management</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col lg:flex-row">
        <aside className="bg-white shadow-md lg:w-64 lg:flex-shrink-0">
          <div className="py-6 px-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <p className="text-gray-600 text-sm font-medium">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <p className="text-gray-500">Placeholder for recent borrowings and returns.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;