import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { DarkModeSwitch } from "./components/ui/dark-mode-switch";
import "./App.css";

// Define province data type
interface ProvinceData {
  recentCutoffScore: string;
  jobOfferRequired: string;
  myTotalScore: string;
  stepsToApply: string[];
  otherInfo?: string;
}

// Define all provinces with their data
const provinceData: Record<string, ProvinceData> = {
  Manitoba: {
    recentCutoffScore: "673-712 points",
    jobOfferRequired: "Yes",
    myTotalScore: "675 points",
    stepsToApply: [
      "Submit an EOI on the MPNP Online portal",
      "Wait for an ITA (recent cut-offs for Skilled Worker in Manitoba around 673-712 points)",
      "Apply for Nomination if invited",
      "Apply for PR through IRCC once nominated"
    ],
    otherInfo: ""
  },
  Saskatchewan: {
    recentCutoffScore: "minimum 60 points required",
    jobOfferRequired: "Yes",
    myTotalScore: "50 points",
    stepsToApply: [
      "Consider applying through the Saskatchewan Students Stream",
      "Secure a permanent, full-time job offer in your field (TEER 0, 1, 2, or 3)",
      "Ensure you have at least 6 months of work experience in Saskatchewan",
      "Apply through the SINP Online Portal (no specific points score needed for this stream)"
    ],
    otherInfo: "You seem eligible for the Saskatchewan Students Stream, which doesn't use a points system but requires specific criteria, such as a skilled job offer in NOC TEER 0, 1, 2, or 3."
  },
  NewBrunswick: {
    recentCutoffScore: "minimum requirement of 67 points",
    jobOfferRequired: "No",
    myTotalScore: "78–88 points",
    stepsToApply: [
      "Submit an EOI through the New Brunswick Immigration portal (accepted from the 1st to the 15th of each month)",
      "Receive an ITA if your score is competitive",
      "Apply for Nomination if invited",
      "Apply for PR through IRCC once nominated"
    ]
  },
  Alberta: {
    recentCutoffScore: "60 or higher typically required",
    jobOfferRequired: "Yes",
    myTotalScore: "53 points",
    stepsToApply: [
      "Ensure eligibility under the Alberta Opportunity Stream",
      "Submit an EOI via the AAIP portal",
      "Wait for an invitation based on your score and other factors",
      "Submit application for nomination if invited",
      "Apply for PR through IRCC once nominated"
    ]
  },
  NovaScotia: {
    recentCutoffScore: "No total score required",
    jobOfferRequired: "Yes",
    myTotalScore: "You likely meet the criteria",
    stepsToApply: [
      "Ensure your current job is full-time and permanent",
      "Verify your IELTS score meets the requirement (it does at 6.5)",
      "Confirm you have the required 6 months of experience with your employer",
      "Gather necessary documents and apply online via the NSNP portal",
      "Apply for PR through IRCC once nominated"
    ],
    otherInfo: "Employment in a TEER 4 job in Nova Scotia, implying semi-skilled work."
  },
  Yukon: {
    recentCutoffScore: "minimum requirement of 67 points",
    jobOfferRequired: "Yes",
    myTotalScore: "80 points (estimated)",
    stepsToApply: [
      "Confirm your job is in a skilled occupation (NOC 0, A, B); if not, seek a skilled job offer",
      "Have your employer apply to the YNP to nominate you",
      "Meet language requirements (your IELTS 6.5 is sufficient)",
      "Submit application if nominated",
      "Apply for PR through IRCC once nominated"
    ],
    otherInfo: "The points calculation assumes your job is skilled (NOC 0, A, B). If not, you may not qualify under the Skilled Worker stream and need to explore other options."
  },
  Newfoundland: {
    recentCutoffScore: "minimum of 67",
    jobOfferRequired: "Yes",
    myTotalScore: "86 points (estimated)",
    stepsToApply: [
      "Confirm your job TEER Level using the NOC Search Tool",
      "Apply through the appropriate category based on your job's TEER level",
      "Submit an EOI through the NLPNP Immigration Accelerator Portal",
      "Submit a complete application within 60 days if you receive an ITA",
      "Apply for PR through IRCC once nominated"
    ],
    otherInfo: "The NLPNP includes several categories, with the most relevant for you being the NLPNP Express Entry Skilled Worker Category, NLPNP Skilled Worker Category, or NLPNP International Graduate Category."
  },
  Ontario: {
    recentCutoffScore: "54–85 points",
    jobOfferRequired: "Yes",
    myTotalScore: "66 points (estimated)",
    stepsToApply: [
      "Secure a skilled job offer in TEER 0, 1, 2, or 3 (if your current job is TEER 4, you'll need a new job)",
      "Register an EOI on the OINP website",
      "Wait for an invitation (your score of 66 may need improvement)",
      "Submit your application if invited",
      "Apply for PR through IRCC once nominated"
    ],
    otherInfo: "If securing a skilled job offer is challenging, consider other OINP streams like the Human Capital Priorities Stream, but note that you would need to improve your language scores and meet other requirements."
  },
  PrinceEdwardIsland: {
    recentCutoffScore: "at least 67 points",
    jobOfferRequired: "Yes",
    myTotalScore: "52 to 57 points",
    stepsToApply: [
      "Choose the right stream (likely Skilled Worker in PEI)",
      "Create a profile in the PEI PNP's Expression of Interest system",
      "Improve your score to reach at least 67 points",
      "Submit application if invited",
      "Apply for PR through IRCC once nominated"
    ]
  },
  BritishColumbia: {
    recentCutoffScore: "at least 90–110 points",
    jobOfferRequired: "Yes",
    myTotalScore: "67 points (estimated)",
    stepsToApply: [
      "Check eligibility based on your job's NOC category",
      "Register online using BCPNP Online",
      "Calculate your exact score using the BC PNP points calculator",
      "Monitor draws for invitations",
      "Submit your application within 30 days if invited",
      "Apply for PR through IRCC once nominated"
    ],
    otherInfo: "Your score is calculated using the Skills Immigration Registration System (SIRS), with a maximum of 200 points. To boost your score, consider a higher-paying job or relocating to a less populated area in B.C."
  }
};

function App() {
  // Store which province is selected
  const [selectedProvince, setSelectedProvince] = useState<string>("Ontario");
  // Store dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    // Function to get the current mode preference
    const getInitialMode = (): boolean => {
      // Check if there's a stored preference in localStorage
      const savedDarkMode = localStorage.getItem('darkMode');
      
      if (savedDarkMode !== null) {
        // User has explicitly set a preference
        return savedDarkMode === 'true';
      } else {
        // No saved preference, use system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    };
    
    // Set the initial dark mode
    setDarkMode(getInitialMode());

    // Set up listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(event.matches);
      }
    };
    
    // Add event listener for system preference changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Update class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save the user's preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Toggle dark mode with user preference
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Reset to system preference
  const resetToSystemPreference = () => {
    localStorage.removeItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(systemPrefersDark);
  };

  // Handle eligibility status display based on scores
  const getEligibilityStatus = (province: string) => {
    const data = provinceData[province];
    const cutoff = data.recentCutoffScore.match(/\d+/g);
    const myScore = data.myTotalScore.match(/\d+/g);
    
    if (!cutoff || !myScore) {
      return "Undetermined";
    }

    const minCutoff = parseInt(cutoff[0]);
    const minScore = parseInt(myScore[0]);
    
    if (minScore >= minCutoff) {
      return "Likely Eligible";
    } else if (minScore >= minCutoff - 10) {
      return "Borderline";
    } else {
      return "Likely Ineligible";
    }
  };

  // Get the color based on eligibility
  const getEligibilityColor = (status: string) => {
    switch (status) {
      case "Likely Eligible":
        return "bg-green-100 text-green-800 border-green-200";
      case "Borderline":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Likely Ineligible":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Canadian PR Guide</h1>
          <DarkModeSwitch 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            resetToSystemPreference={resetToSystemPreference} 
          />
        </div>
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Canadian Permanent Residency Guide</h2>
          <p className="text-lg text-muted-foreground">
            Compare your eligibility across Canadian provinces and territories
          </p>
        </div>
        
        <div className="bg-card rounded-xl shadow-md p-6 mb-8 border">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Education:</span> 2-year diploma in Toronto, 4-year BSc in Bangladesh (ECA completed)
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Language:</span> IELTS overall 6.5 (general)
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Work Permit:</span> 3-year PGWP
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Employment:</span> TEER 4 job in Ontario
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <span className="font-medium">Age:</span> 30
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Province Comparison</h2>
          
          <Tabs defaultValue={selectedProvince} onValueChange={setSelectedProvince}>
            <div className="mb-4 overflow-x-auto">
              <TabsList className="w-auto inline-flex space-x-1">
                {Object.keys(provinceData).map((province) => (
                  <TabsTrigger key={province} value={province} className="px-4 py-2">
                    {province.replace(/([A-Z])/g, ' $1').trim()}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {Object.keys(provinceData).map((province) => (
              <TabsContent key={province} value={province}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>{province.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={`text-sm px-3 py-1 rounded-full border ${getEligibilityColor(getEligibilityStatus(province))}`}>
                        {getEligibilityStatus(province)}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Provincial Nominee Program details and requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium text-foreground mb-1">Recent Cutoff Score</h3>
                        <p className="text-muted-foreground">{provinceData[province].recentCutoffScore}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium text-foreground mb-1">Job Offer Required</h3>
                        <p className="text-muted-foreground">{provinceData[province].jobOfferRequired}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-medium text-foreground mb-1">Your Total Score</h3>
                        <p className="text-muted-foreground">{provinceData[province].myTotalScore}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-foreground text-lg mb-3">Steps to Apply for PR</h3>
                      <ol className="list-decimal list-inside space-y-2 pl-4">
                        {provinceData[province].stepsToApply.map((step, index) => (
                          <li key={index} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    {provinceData[province].otherInfo && (
                      <div className="mt-4 p-4 bg-accent text-accent-foreground rounded-lg">
                        <h3 className="font-medium mb-1">Additional Information</h3>
                        <p>{provinceData[province].otherInfo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Last updated: July 16, 2025. Always check official immigration websites for the most current information.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
