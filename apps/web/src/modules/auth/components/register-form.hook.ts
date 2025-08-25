import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signUp } from "@/web/lib/auth";
import { type RegisterFormData, registerSchema } from "@/web/modules/auth/validators/register.validation";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);

    const { error } = await signUp.email({
      email: formData.email,
      name: formData.name,
      password: formData.password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    reset();
    navigate({ to: "/auth/sign-in" });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return {
    errors,
    handleSubmit,
    isLoading,
    isValid,
    onSubmit,
    register,
    showConfirmPassword,
    showPassword,
    toggleConfirmPasswordVisibility,
    togglePasswordVisibility,
  };
};
