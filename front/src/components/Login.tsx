import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Label } from "@/components/ui/label";
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LoadingSpinner } from "./LoadingSpinner"
import { useEffect, useState } from "react"
import { toast } from "sonner"



import { useAuth } from "@/hooks/useAuth";

import { apiInstance } from "@/lib/api"


const LoginSchema = z.object({
  cUsuario: z.string({ message: "Solo texto permitido" }).min(1, { message: "Campo requerido, debe contener al menos 1 caracter" }),
  cPassword: z.string({ message: "Solo texto permitido" }).min(1, { message: "Campo requerido, debe contener al menos 1 caracter" }),
});

type LoginData = z.infer<typeof LoginSchema>;


export function Login({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  useEffect(() => {
    if (loading) {
      const toastId = toast.loading('', {
        position: 'top-right',
        duration: Infinity,
        style: { backgroundColor: 'transparent', width: 'fit-content' },
      });
    } else {
      // Dismiss toast when loading is false
      toast.dismiss();
    }

    // Optional: Clean up the toast on component unmount
    return () => {
      toast.dismiss();
    };
  }, [loading]);



  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    setLoading(true);
    const response = (await apiInstance.post('/auth/login', data));
    const responseData = response.data.data;

    if (response.status !== 200)
      return;

    setAuth({
      usuario: responseData.usuario,
      rol: responseData.rol,
      accessToken: responseData.accessToken,
    });

    setLoading(false);
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Introduce tu usuario y contraseña para acceder a tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="Usuario">Usuario</Label>
                      {errors.cUsuario?.message &&
                        (
                          <Tooltip>
                            <TooltipTrigger>
                              <InfoIcon className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>

                              {
                                Object.entries(errors).map(([field, fieldError]) => {
                                  if (field === "cUsuario" && fieldError?.message) {
                                    return (<p className="text-sm ">{fieldError.message}</p>)
                                  }
                                }
                                )
                              }
                            </TooltipContent>
                          </Tooltip>
                        )}
                    </div>

                    <Input
                      id="Usuario"
                      type="text"
                      placeholder="Usuario"
                      {...register("cUsuario", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="Contraseña">Contraseña</Label>
                        {errors.cPassword?.message &&
                          (
                            <Tooltip>
                              <TooltipTrigger>
                                <InfoIcon className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm ">{errors.cPassword?.message}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                      </div>

                    </div>
                    <Input id="Contraseña" type="password"
                      placeholder="Contraseña"
                      {...register("cPassword", {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Iniciar Sesión
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  )
}
