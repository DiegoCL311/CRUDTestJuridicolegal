import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { roles, findBreadcrumbs } from './lib/utils'

//Components
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { ModeToggle } from "./components/ModeToggle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Toaster } from "@/components/ui/sonner";

//Hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRefreshToken } from '@/hooks/useRefreshToken';
import { useAxios } from "./hooks/usePrivateAxios";

//Pages
import { Login } from "@/pages/Login";
import { LandingPage } from "./pages/LandingPage";
import { SolicitudReserva } from "./pages/SolicitudReserva";

import '@ant-design/v5-patch-for-react-19';


const data = [
  {
    title: "Reservas",
    url: "",
    items: [
      {
        title: "Registro de Reservas",
        url: "/reservas/solicitud",
      },
      {
        title: "Consultar mis Reservas",
        url: "/reservas/consultar",
      },
    ],
  }
]

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { refreshToken } = useRefreshToken();
  const { auth } = useAuth();
  useAxios();


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
            <Route index={true} element={<LandingPage />} />
            <Route path="reservas" element={<LandingPage />} />
            <Route path="reservas/consultar" element={<LandingPage />} />
            <Route path="reservas/solicitud" element={<SolicitudReserva />} />
            <Route path="abc/:id" element={<></>} />

          </Route>

          <Route path="*" element={<NoMatch />} />
        </Routes>);

    case roles.employeeUser:
      return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index={true} element={<LandingPage />} />
            <Route path="reservas" element={<LandingPage />} />
            <Route path="reservas/solicitud" element={<SolicitudReserva />} />
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




export function Layout() {
  const location = useLocation();
  const crumbs = findBreadcrumbs(data, location.pathname) || [];
  const navigate = useNavigate();

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
                {crumbs.map((crumb, index) => {
                  const isLast = index === crumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.url}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="hover:cursor-pointer">{crumb.title}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink className="hover:cursor-pointer" onClick={() => { navigate(crumb.url) }}>{crumb.title}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="ml-auto flex items-center gap-2 px-3">
            <ModeToggle />
            <LogoutButton />
          </div>
        </header>
        <Outlet />
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
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
      <Toaster />
    </div>
  );
}
