import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define gfiberPlans outside the component so it's not recreated on every render
const gfiberPlans = [
  { id: '1gig', speed: '1 Gig', cost: 70, speedValue: 1000 }, // Added speedValue for consistency with previous versions
  { id: '3gig', speed: '3 Gig', cost: 100, speedValue: 3000 },
  { id: '8gig', speed: '8 Gig', cost: 150, speedValue: 8000 },
];

const youtubeTVCost = 83.00;

const App = () => {
  const [step, setStep] = useState('welcome');
  const [currentISP, setCurrentISP] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState('');
  const [currentUploadSpeed, setCurrentUploadSpeed] = useState(''); // Added this back as it was in the previous version
  const [currentCost, setCurrentCost] = useState('');
  const [hasTVBundle, setHasTVBundle] = useState(false);
  const [selectedGfiberPlanId, setSelectedGfiberPlanId] = useState('1gig');
  const [recommendedGfiberPlan, setRecommendedGfiberPlan] = useState(null);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateAndSetSavings = useCallback(() => {
    setErrorMessage('');

    const currentGfiberPlan = gfiberPlans.find(p => p.id === selectedGfiberPlanId);
    if (!currentGfiberPlan) {
      setErrorMessage('Error: Selected Gfiber plan not found.');
      return;
    }

    const gfiberInternetCost = currentGfiberPlan.cost;
    const gfiberTotalCost = hasTVBundle ? gfiberInternetCost + youtubeTVCost : gfiberInternetCost;

    const parsedCurrentCost = parseFloat(currentCost);
    if (isNaN(parsedCurrentCost) || parsedCurrentCost <= 0) {
        setErrorMessage('Current monthly cost is invalid. Please go back and correct it.');
        return;
    }

    const calculatedMonthlySavings = parsedCurrentCost - gfiberTotalCost;
    const calculatedYearlySavings = calculatedMonthlySavings * 12;

    setRecommendedGfiberPlan(currentGfiberPlan);
    setMonthlySavings(calculatedMonthlySavings);
    setYearlySavings(calculatedYearlySavings);
  }, [selectedGfiberPlanId, hasTVBundle, currentCost, youtubeTVCost]); // gfiberPlans removed from dependencies as it's now outside

  useEffect(() => {
    if (step === 'results' && currentCost && selectedGfiberPlanId) {
      calculateAndSetSavings();
    }
  }, [step, currentCost, selectedGfiberPlanId, calculateAndSetSavings]);

  const handleISPDetailsSubmit = () => {
    setErrorMessage('');

    if (!currentISP || !currentSpeed || !currentUploadSpeed || !currentCost || !selectedGfiberPlanId) { // Added currentUploadSpeed check
      setErrorMessage('Please fill in all details and select a Gfiber plan.');
      return;
    }
    if (isNaN(parseInt(currentSpeed)) || parseInt(currentSpeed) <= 0) {
      setErrorMessage('Please enter a valid current download speed (e.g., 300).');
      return;
    }
    if (isNaN(parseInt(currentUploadSpeed)) || parseInt(currentUploadSpeed) <= 0) { // Added validation for upload speed
      setErrorMessage('Please enter a valid current upload speed (e.g., 20).');
      return;
    }
    const parsedCurrentCost = parseFloat(currentCost);
    if (isNaN(parsedCurrentCost) || parsedCurrentCost <= 0) {
      setErrorMessage('Please enter a valid current monthly cost (e.g., 75.00).');
      return;
    }

    calculateAndSetSavings();
    setStep('results');
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Welcome</h2>
      <p className="text-lg text-gray-700 text-center mb-6">
        Let's help your potential customers see the amazing benefits and savings of switching to Gfiber.
      </p>
      <button
        onClick={() => setStep('isp_details')}
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
      >
        Start Qualification
      </button>
    </div>
  );

  const renderISPDetailsStep = () => (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer's Current & Desired Gfiber Plan</h2>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 w-full" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
        </div>
      )}

      <div className="w-full mb-4">
        <label htmlFor="currentISP" className="block text-sm font-medium text-gray-700 mb-2">
          Customer's Current Internet Provider
        </label>
        <select
          id="currentISP"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={currentISP}
          onChange={(e) => setCurrentISP(e.target.value)}
        >
          <option value="">Select ISP</option>
          <option value="Spectrum">Spectrum</option>
          <option value="AT&T">AT&T</option>
          <option value="Astound (Grande)">Astound (Grande)</option>
          <option value="T-Mobile Home Internet">T-Mobile Home Internet</option>
        </select>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="currentSpeed" className="block text-sm font-medium text-gray-700 mb-2">
          Customer's Current Download Speed (e.g., 300 for 300 Mbps)
        </label>
        <input
          type="number"
          id="currentSpeed"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={currentSpeed}
          onChange={(e) => setCurrentSpeed(e.target.value)}
          placeholder="e.g., 300"
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="currentUploadSpeed" className="block text-sm font-medium text-gray-700 mb-2">
          Customer's Current Upload Speed (e.g., 20 for 20 Mbps)
        </label>
        <input
          type="number"
          id="currentUploadSpeed"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={currentUploadSpeed}
          onChange={(e) => setCurrentUploadSpeed(e.target.value)}
          placeholder="e.g., 20"
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="currentCost" className="block text-sm font-medium text-gray-700 mb-2">
          Customer's Current Monthly Cost ($) - Total (Internet + TV if bundled)
        </label>
        <input
          type="number"
          id="currentCost"
          step="0.01"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={currentCost}
          onChange={(e) => setCurrentCost(e.target.value)}
          placeholder="e.g., 75.00 or 150.00 for bundle"
        />
      </div>

      <div className="w-full mb-6 flex items-center">
        <input
          type="checkbox"
          id="hasTVBundle"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          checked={hasTVBundle}
          onChange={(e) => setHasTVBundle(e.target.checked)}
        />
        <label htmlFor="hasTVBundle" className="ml-2 block text-sm font-medium text-gray-700">
          Customer currently has a TV bundle (e.g., Cable TV with internet)
        </label>
      </div>

      <div className="w-full mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Gfiber Internet Plan:
        </label>
        <div className="mt-1 space-y-2">
          {gfiberPlans.map(plan => (
            <div key={plan.id} className="flex items-center">
              <input
                id={`gfiber-plan-${plan.id}`}
                name="gfiber-plan"
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                value={plan.id}
                checked={selectedGfiberPlanId === plan.id}
                onChange={(e) => setSelectedGfiberPlanId(e.target.value)}
              />
              <label htmlFor={`gfiber-plan-${plan.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                {plan.speed} (${plan.cost}/month)
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleISPDetailsSubmit}
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
      >
        Show Benefits & Savings
      </button>
      <button
        onClick={() => setStep('welcome')}
        className="mt-4 w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out"
      >
        Back to Welcome
      </button>
    </div>
  );

  const renderResults = () => {
    if (!recommendedGfiberPlan) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 w-full text-center">
          <p>Something went wrong. Please go back and ensure all details are entered correctly.</p>
          <button onClick={() => setStep('isp_details')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Go Back</button>
        </div>
      );
    }

    const gfiberInternetCost = recommendedGfiberPlan.cost;
    const gfiberTotalCostForChart = hasTVBundle ? gfiberInternetCost + youtubeTVCost : gfiberInternetCost;

    const chartData = [
      { name: 'Current Plan', cost: parseFloat(currentCost) },
      { name: `Gfiber${hasTVBundle ? ' + YouTube TV' : ''}`, cost: gfiberTotalCostForChart },
    ];

    // Data for speed comparison chart
    const speedChartData = [
      {
        category: 'Download',
        'Current Plan': parseInt(currentSpeed) || 0,
        'Gfiber Plan': recommendedGfiberPlan.speedValue || 0,
      },
      {
        category: 'Upload',
        'Current Plan': parseInt(currentUploadSpeed) || 0,
        'Gfiber Plan': recommendedGfiberPlan.speedValue || 0, // Assuming symmetrical for Gfiber
      },
    ];

    const handleGfiberPlanChange = (event) => {
      setSelectedGfiberPlanId(event.target.value);
    };

    const handleTVBundleToggle = (event) => {
      setHasTVBundle(event.target.value === 'yes');
    };

    return (
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Your Gfiber Savings!</h2>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 w-full" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{errorMessage}</span>
          </div>
        )}

        <div className="w-full mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-3 text-center">
            Adjust Gfiber Internet Plan:
          </label>
          <div className="flex justify-center space-x-4">
            {gfiberPlans.map(plan => (
              <div key={plan.id} className="flex items-center">
                <input
                  id={`results-gfiber-plan-${plan.id}`}
                  name="results-gfiber-plan"
                  type="radio"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  value={plan.id}
                  checked={selectedGfiberPlanId === plan.id}
                  onChange={handleGfiberPlanChange}
                />
                <label htmlFor={`results-gfiber-plan-${plan.id}`} className="ml-2 block text-base font-medium text-gray-700">
                  {plan.speed} (${plan.cost}/month)
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-3 text-center">
            Include YouTube TV in Gfiber Total:
          </label>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center">
              <input
                id="tv-toggle-yes"
                name="tv-toggle"
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                value="yes"
                checked={hasTVBundle === true}
                onChange={handleTVBundleToggle}
              />
              <label htmlFor="tv-toggle-yes" className="ml-2 block text-base font-medium text-gray-700">
                Yes (Add ${youtubeTVCost.toFixed(2)}/month)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="tv-toggle-no"
                name="tv-toggle"
                type="radio"
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                value="no"
                checked={hasTVBundle === false}
                onChange={handleTVBundleToggle}
              />
              <label htmlFor="tv-toggle-no" className="ml-2 block text-base font-medium text-gray-700">
                No
              </label>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg w-full mb-6 text-center">
          <p className="text-xl font-semibold text-blue-800">
            Selected Gfiber Internet Plan: <span className="text-blue-600">{recommendedGfiberPlan.speed}</span> for <span className="text-blue-600">${recommendedGfiberPlan.cost}/month</span>
          </p>
          {hasTVBundle && (
            <p className="text-lg text-gray-700 mt-2">
              (Paired with YouTube TV for <span className="text-blue-600">${youtubeTVCost.toFixed(2)}/month</span>)
            </p>
          )}
          <p className="text-lg text-gray-700 mt-2">
            Potential Monthly Savings: <span className="font-bold text-green-600">${monthlySavings.toFixed(2)}</span>
          </p>
          <p className="text-lg text-gray-700">
            Potential Yearly Savings: <span className="font-bold text-green-600">${yearlySavings.toFixed(2)}</span>
          </p>
          {monthlySavings < 0 && (
            <p className="text-red-600 text-sm mt-2">
              (Note: Gfiber cost is currently higher for this comparison. This configuration prioritizes high performance and benefits over pricing)
            </p>
          )}
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Cost Comparison</h3>
        <div className="w-full h-64 mb-8 bg-blue-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', offset: 15 }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="cost" fill="#4285F4" name="Monthly Cost" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Yearly Cost Comparison</h3>
        <div className="w-full h-64 mb-8 bg-blue-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.map(item => ({ name: item.name, cost: item.cost * 12 }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', offset: 15 }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="cost" fill="#34A853" name="Yearly Cost" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Speed Comparison (Mbps)</h3>
        <div className="w-full h-64 mb-8 bg-blue-50 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={speedChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis type="number" label={{ value: 'Speed (Mbps)', angle: 0, position: 'bottom', offset: 5 }} />
              <YAxis type="category" dataKey="category" />
              <Tooltip formatter={(value) => `${value.toLocaleString()} Mbps`} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="Gfiber Plan" fill="#34A853" name="Gfiber Plan" radius={[0, 10, 10, 0]} />
              <Bar dataKey="Current Plan" fill="#4285F4" name="Current Plan" radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Switch to Gfiber?</h3>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-8 w-full px-4">
          <li>
            <strong>Blazing Fast Uploads:</strong> Essential for flawless video conferencing, rapid cloud backups, smooth live streaming, and effortlessly sharing large files.
          </li>
          <li>
            <strong>True Symmetrical Performance:</strong> Experience equally fast download and upload speeds, providing a balanced and powerful internet connection for all your online activities, unlike typical cable.
          </li>
          <li>
            <strong>No Data Caps:</strong> Stream, game, and browse as much as you want without worrying about hidden fees or throttling.
          </li>
          <li>
            <strong>Reliability:</strong> Fiber optic internet is less susceptible to outages and slowdowns caused by weather or network congestion.
          </li>
          <li>
            <strong>Future-Proof Technology:</strong> Gfiber's network is built for tomorrow's internet demands, ensuring you're ready for new technologies.
          </li>
          <li>
            <strong>Transparent Pricing:</strong> Clear, straightforward pricing with no hidden fees or annual contracts.
          </li>
          <li>
            <strong>Dedicated Customer Support:</strong> Experience highly-rated customer service focused on your satisfaction.
          </li>
          {hasTVBundle && (
            <>
              <li className="mt-4">
                <strong>Benefits of Gfiber + YouTube TV:</strong>
              </li>
              <ul className="list-circle list-inside ml-4 space-y-1">
                <li>
                  <strong>Flexibility:</strong> No long-term contracts, cancel anytime.
                </li>
                <li>
                  <strong>Cloud DVR:</strong> Record your favorite shows and watch them anywhere.
                </li>
                <li>
                  <strong>No Equipment Fees:</strong> Say goodbye to costly cable box rentals.
                </li>
                <li>
                  <strong>Stream on Multiple Devices:</strong> Watch on your phone, tablet, smart TV, and more.
                </li>
                <li>
                  <strong>Comprehensive Channels:</strong> Access a wide array of live TV channels from major networks.
                </li>
              </ul>
            </>
          )}
        </ul>

        <p className="text-sm text-gray-500 mt-4 text-center">
          *All Gfiber, YouTube TV, and competitor plan prices are examples for demonstration purposes only and may vary based on location, promotions, and specific service agreements. Please verify current pricing with Gfiber and competitor representatives.
        </p>

        <button
          onClick={() => {
            setStep('welcome');
            setCurrentISP('');
            setCurrentSpeed('');
            setCurrentUploadSpeed('');
            setCurrentCost('');
            setHasTVBundle(false);
            setSelectedGfiberPlanId('1gig');
            setRecommendedGfiberPlan(null);
            setMonthlySavings(0);
            setYearlySavings(0);
            setErrorMessage('');
          }}
          className="mt-8 w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Start New Qualification
        </button>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'welcome':
        return renderWelcome();
      case 'isp_details':
        return renderISPDetailsStep();
      case 'results':
        return renderResults();
      default:
        return renderWelcome();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
      {renderCurrentStep()}
    </div>
  );
};

export default App;

