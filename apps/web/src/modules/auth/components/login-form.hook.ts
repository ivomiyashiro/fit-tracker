import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signIn } from "@/web/lib/auth";
import { type LoginFormData, loginSchema } from "@/web/modules/auth/validators/login.validation";

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);

    const { error } = await signIn.email({
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    reset();
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return {
    errors,
    handleSubmit,
    isLoading,
    isValid,
    onSubmit,
    register,
    showPassword,
    togglePasswordVisibility,
  };
};
