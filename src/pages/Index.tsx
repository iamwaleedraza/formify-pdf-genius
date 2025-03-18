
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPatients, getCurrentUser } from "@/lib/mockData";
import { Patient, User } from "@/types";
import { ClipboardList, Users, FileText, Clock } from "lucide-react";
import PatientCard from "@/components/PatientCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, userData] = await Promise.all([
          getPatients(),
          getCurrentUser()
        ]);
        
        setPatients(patientsData);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter patients based on user role and status
  const nurseActionRequired = patients.filter(p => p.status === "nurse-pending");
  const doctorActionRequired = patients.filter(p => p.status === "doctor-pending");
  const recentlyCompleted = patients.filter(p => p.status === "completed");
  
  // Stats for the cards
  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-100"
    },
    {
      title: currentUser?.role === "nurse" ? "Nurse Reviews" : "Doctor Reviews",
      value: currentUser?.role === "nurse" ? nurseActionRequired.length : doctorActionRequired.length,
      icon: ClipboardList,
      color: "text-purple-500",
      bg: "bg-purple-100"
    },
    {
      title: "Completed Forms",
      value: recentlyCompleted.length,
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-100"
    },
    {
      title: "Recent Updates",
      value: patients.length > 0 ? new Date(
        Math.max(...patients.map(p => new Date(p.lastUpdated).getTime()))
      ).toLocaleDateString() : "No updates",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-100",
      isDate: true
    }
  ];

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {currentUser?.name || "User"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="flex items-center p-6">
                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mr-4`}>
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h4 className={`text-2xl font-semibold mt-1 ${stat.isDate ? "text-base" : ""}`}>
                    {stat.value}
                  </h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Patient Tabs */}
        <Card className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader>
            <CardTitle>Patient Forms</CardTitle>
            <CardDescription>
              Manage and review patient forms based on their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="action-required">
              <TabsList className="mb-6">
                <TabsTrigger value="action-required">
                  Action Required
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="all">
                  All Patients
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="action-required" className="mt-0">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {currentUser?.role === "nurse" ? (
                    nurseActionRequired.length > 0 ? (
                      nurseActionRequired.map(patient => (
                        <PatientCard key={patient.id} patient={patient} />
                      ))
                    ) : (
                      <p className="text-muted-foreground col-span-full py-8 text-center">
                        No patients require nurse review at this time.
                      </p>
                    )
                  ) : doctorActionRequired.length > 0 ? (
                    doctorActionRequired.map(patient => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full py-8 text-center">
                      No patients require doctor review at this time.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {recentlyCompleted.length > 0 ? (
                    recentlyCompleted.map(patient => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full py-8 text-center">
                      No completed patient forms yet.
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {patients.length > 0 ? (
                    patients.map(patient => (
                      <PatientCard key={patient.id} patient={patient} />
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full py-8 text-center">
                      No patients available.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
