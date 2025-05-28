import React, {  useState, useEffect, useCallback, useMemo } from 'react'; // <--- Make sure to import useMemo
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Main App component
const App = () => {
  // State variables for the application flow and data
  const [step, setStep] = useState('welcome'); // 'welcome', 'isp_details', 'results'
  const [currentISP, setCurrentISP] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState('');
  const [currentCost, setCurrentCost] = useState(''); // This will be total monthly cost (internet + TV if bundled)
  const [hasTVBundle, setHasTVBundle] = useState(false);
  const [selectedGfiberPlanId, setSelectedGfiberPlanId] = useState('1gig'); // Default to 1 Gig
  const [recommendedGfiberPlan, setRecommendedGfiberPlan] = useState(null); // Now derived from selectedGfiberPlanId
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Hardcoded Gfiber plans - NOW MEMOIZED
const gfiberPlans = useMemo(() => [ // <--- This line is correct
  { id: '1gig', speed: '1 Gig', cost: 70 },
  { id: '3gig', speed: '3 Gig', cost: 100 },
  { id: '8gig', speed: '8 Gig', cost: 150 },
], []); // <--- THIS IS THE CRITICAL PART: the closing ], []);

  // YouTube TV cost
  const youtubeTVCost = 83.00;

  // Function to calculate and update savings based on current selections
  // Using useCallback to memoize for performance, especially when passed to children
  const calculateAndSetSavings = useCallback(() => {
    setErrorMessage(''); // Clear previous errors

    const currentGfiberPlan = gfiberPlans.find(p => p.id === selectedGfiberPlanId);
    if (!currentGfiberPlan) {
      setErrorMessage('Error: Selected Gfiber plan not found.');
      return;
    }

    const gfiberInternetCost = currentGfiberPlan.cost;
    const gfiberTotalCost = hasTVBundle ? gfiberInternetCost + youtubeTVCost : gfiberInternetCost;

    const parsedCurrentCost = parseFloat(currentCost);
    if (isNaN(parsedCurrentCost) || parsedCurrentCost <= 0) {
        // This error should ideally be caught before reaching results, but as a fallback
        setErrorMessage('Current monthly cost is invalid. Please go back and correct it.');
        return;
    }

    const calculatedMonthlySavings = parsedCurrentCost - gfiberTotalCost;
    const calculatedYearlySavings = calculatedMonthlySavings * 12;

    setRecommendedGfiberPlan(currentGfiberPlan);
    setMonthlySavings(calculatedMonthlySavings);
    setYearlySavings(calculatedYearlySavings);
  }, [selectedGfiberPlanId, hasTVBundle, currentCost, gfiberPlans, youtubeTVCost]); // Dependencies

  // Recalculate savings whenever a relevant state changes (especially useful on results page)
  useEffect(() => {
    if (step === 'results' && currentCost && selectedGfiberPlanId) {
      calculateAndSetSavings();
    }
  }, [step, currentCost, selectedGfiberPlanId, calculateAndSetSavings]);

  /**
   * Handles the submission of current ISP details.
   */
  const handleISPDetailsSubmit = () => {
    setErrorMessage(''); // Clear previous errors

    // Input validation
    if (!currentISP || !currentSpeed || !currentCost || !selectedGfiberPlanId) {
      setErrorMessage('Please fill in all details and select a Gfiber plan.');
      return;
    }
    if (isNaN(parseInt(currentSpeed)) || parseInt(currentSpeed) <= 0) {
      setErrorMessage('Please enter a valid current speed (e.g., 300).');
      return;
    }
    const parsedCurrentCost = parseFloat(currentCost);
    if (isNaN(parsedCurrentCost) || parsedCurrentCost <= 0) {
      setErrorMessage('Please enter a valid current monthly cost (e.g., 75.00).');
      return;
    }

    // Perform initial calculation and move to results
    calculateAndSetSavings();
    setStep('results');
  };

  /**
   * Renders the welcome screen.
   */
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

  /**
   * Renders the ISP details input step.
   */
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

      {/* Gfiber Plan Selection Radio Buttons */}
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

  /**
   * Renders the results screen with graphs and benefits.
   */
  const renderResults = () => {
    if (!recommendedGfiberPlan) {
      // This case should ideally not be reached if validation works correctly before setting step to 'results'
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 w-full text-center">
          <p>Something went wrong. Please go back and ensure all details are entered correctly.</p>
          <button onClick={() => setStep('isp_details')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Go Back</button>
        </div>
      );
    }

    // Recalculate based on current selectedGfiberPlanId and other states
    const gfiberInternetCost = recommendedGfiberPlan.cost; // recommendedGfiberPlan is always based on current selectedGfiberPlanId
    const gfiberTotalCostForChart = hasTVBundle ? gfiberInternetCost + youtubeTVCost : gfiberInternetCost;

    const chartData = [
      { name: 'Current Plan', cost: parseFloat(currentCost) },
      { name: `Gfiber${hasTVBundle ? ' + YouTube TV' : ''}`, cost: gfiberTotalCostForChart },
    ];

    const handleGfiberPlanChange = (event) => {
      setSelectedGfiberPlanId(event.target.value);
      // calculateAndSetSavings will be called via useEffect due to selectedGfiberPlanId change
    };

    // Handler for YouTube TV toggle
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

        {/* Gfiber Plan Selection Radio Buttons on Results Page */}
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

        {/* YouTube TV Toggle Radio Buttons on Results Page */}
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
              (Note: Gfiber cost is currently higher for this comparison. Focus on other benefits!)
            </p>
          )}
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Cost Comparison</h3>
        <div className="w-full h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="cost" fill="#4285F4" name="Monthly Cost" radius={[10, 10, 0, 0]} /> {/* Standard Blue */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Yearly Cost Comparison</h3>
        <div className="w-full h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.map(item => ({ name: item.name, cost: item.cost * 12 }))} // Multiply by 12 for yearly
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="cost" fill="#34A853" name="Yearly Cost" radius={[10, 10, 0, 0]} /> {/* Standard Green */}
            </BarChart>
          </ResponsiveContainer>
        </div>


        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Why Switch to Gfiber?</h3>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 mb-8 w-full px-4">
          <li>
            <strong>Symmetrical Speeds:</strong> Enjoy equally fast upload and download speeds, perfect for video calls, gaming, and large file sharing. (Unlike most cable providers).
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
            setStep('welcome'); // Reset to welcome screen
            setCurrentISP('');
            setCurrentSpeed('');
            setCurrentCost('');
            setHasTVBundle(false);
            setSelectedGfiberPlanId('1gig'); // Reset to default 1 Gig
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

  // Render the appropriate step based on the 'step' state
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

