export default function StudentPortal() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Student Portal</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose">Name</label>
                  <input type="text" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Student name" />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Email</label>
                  <input type="email" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Student email" />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Date of Birth</label>
                  <input type="date" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">State</label>
                  <input type="text" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="State" />
                </div>
                <div className="flex flex-col">
                  <label className="leading-loose">Country</label>
                  <input type="text" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Country" />
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none">Register</button>
              </div>
            </div>
            <div className="pt-8">
              <div className="flex flex-col">
                <label className="leading-loose">Student ID</label>
                <input type="number" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600" placeholder="Enter Student ID" />
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button className="bg-yellow-500 flex justify-center items-center w-1/2 text-white px-4 py-3 rounded-md focus:outline-none">Update</button>
                <button className="bg-red-500 flex justify-center items-center w-1/2 text-white px-4 py-3 rounded-md focus:outline-none">Delete</button>
              </div>
            </div>
            <div className="pt-8">
              <h2 className="text-lg font-semibold">Student Information</h2>
              <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <p><strong>Name:</strong> <span id="studentName"></span></p>
                <p><strong>Email:</strong> <span id="studentEmail"></span></p>
                <p><strong>Date of Birth:</strong> <span id="studentDOB"></span></p>
                <p><strong>State:</strong> <span id="studentState"></span></p>
                <p><strong>Country:</strong> <span id="studentCountry"></span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}