import { useEffect, useState } from "react";
import { Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";
import { roles } from './lib/utils'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Toaster } from "@/components/ui/sonner";


import useRefreshToken from '@/hooks/useRefreshToken';
import { useAuth } from "@/hooks/useAuth";
import { Login } from "@/components/Login";
import { ModeToggle } from "./components/ModeToggle";
import { LogoutButton } from "@/components/LogoutButton";

const data = [
  {
    title: "Getting Started",
    url: "#",
    items: [
      {
        title: "Installation",
        url: "#",
      },
      {
        title: "Project Structure",
        url: "#",
      },
    ],
  },
  {
    title: "Building Your Application",
    url: "#",
    items: [
      {
        title: "Routing",
        url: "#",
      },
      {
        title: "Data Fetching",
        url: "#",
        isActive: true,
      }
    ],
  }
]

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { refreshToken } = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refreshToken();
      }
      catch (err) {
        console.error(err);
      }
      finally {
        isMounted && setIsLoading(false);
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => { isMounted = false };
  }, [])

  if (isLoading) return (<LoadingSpinner />)


  switch (auth.rol?.cRol) {
    case roles.adminUser:
      return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index={true} element={<></>} />
            <Route path="abc/:id" element={<></>} />

          </Route>

          <Route path="*" element={<NoMatch />} />
        </Routes>);

    case roles.employeeUser:
      return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index={true} element={<></>} />
          </Route>

          <Route path="*" element={<NoMatch />} />
        </Routes>);


    default:
      return (
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
          </Route>

          <Route path="*" element={<NoMatch />} />
        </Routes>);
  }
}

/*
function AdminLayout() {
  return (
    <div>
      <Header />

      <Menu />

      <div className="py-12">
        <Outlet />
      </div>

      <Cintillo />
      <Footer />
    </div>
  );
}

function UnloggedLayout() {
  return (
    <div>
      <Header />
      <div className="py-12">
        <Outlet />
      </div>
      <Cintillo />
      <Footer />
    </div>
  );
}
  */

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar menu={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="ml-auto flex items-center gap-2 px-3  ">
            <ModeToggle />
            <LogoutButton />
          </div>
        </header>
        <Outlet />
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  )
}

function BasicLayout() {
  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        {/*ModeToggle al Lado derecho */}
        <div className="ml-auto flex items-center gap-2 px-3">
          <ModeToggle />
        </div>
      </header>
      <Outlet />
      <Toaster />

    </div>
  )
}

function NoMatch() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, []);

  return (
    <div>
      <h2>Nothing to see here! WIP</h2>
      <p>
        <Link to="/">Go to the < h1 className={"text-blue-600 underline"}> home page</h1></Link>
      </p>
    </div>
  );
}
