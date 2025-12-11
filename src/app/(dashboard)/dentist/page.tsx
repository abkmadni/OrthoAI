export default function DentistDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground text-gray-500 mt-1">
          Welcome back, Dr. Smith. Here is your daily overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Card 1 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Total Patients</h3>
          </div>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-green-600 mt-1">+12% from last month</p>
        </div>

        {/* Stats Card 2 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Appointments</h3>
          </div>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-gray-500 mt-1">Scheduled for today</p>
        </div>

        {/* Stats Card 3 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Pending Lab Results</h3>
          </div>
          <div className="text-2xl font-bold">5</div>
          <p className="text-xs text-orange-600 mt-1">Requires attention</p>
        </div>

        {/* Stats Card 4 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Revenue (Month)</h3>
          </div>
          <div className="text-2xl font-bold">$45,231</div>
          <p className="text-xs text-green-600 mt-1">+8% from last month</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Appointments - Takes up 4 columns */}
        <div className="col-span-4 rounded-xl border bg-white shadow-sm">
          <div className="p-6 border-b">
             <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div className="p-6">
             <p className="text-sm text-gray-500 text-center py-10">No appointments scheduled for the rest of the day.</p>
          </div>
        </div>

        {/* Recent Activity / Notifications - Takes up 3 columns */}
        <div className="col-span-3 rounded-xl border bg-white shadow-sm">
          <div className="p-6 border-b">
             <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
             <ul className="space-y-4">
               <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">X-Ray uploaded for Patient #102</span>
                  <span className="text-xs text-gray-400">2m ago</span>
               </li>
               <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">New appointment: Sarah Connor</span>
                  <span className="text-xs text-gray-400">1h ago</span>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
