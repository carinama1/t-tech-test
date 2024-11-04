"use client";

import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { AuthError } from "@supabase/supabase-js";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

import { getRandomName } from "@/utils/randomName";

import { signIn, signUp } from "./actions";

const LoginPage = () => {
  const hydrated = useRef<boolean>(false);

  const trySupabaseSignIn = async (fingerprintId: string): Promise<boolean> => {
    const { data, errorMessage } = await signIn({ fingerprintId });

    if (errorMessage) {
      toast("Creating Anonymous account...");
    } else if (data && data.session) {
      toast.success("Magic!");
      return true;
    } else {
      toast.error("Something went wrong");
    }

    return false;
  };

  const supabaseSignUp = useCallback(async (fingerprintId: string) => {
    const randomName = getRandomName();

    const { error } = await signUp({ fingerprintId, name: randomName });

    if (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    } else {
      toast.success("Magic!");
    }
  }, []);

  const getFingerPrintID = useCallback(async () => {
    const loadingToastID = toast.loading("Loading...");
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    const isLoggedIn = await trySupabaseSignIn(visitorId);

    if (!isLoggedIn) {
      await supabaseSignUp(visitorId);
    }

    window.location.href = "/";
    toast.dismiss(loadingToastID);
  }, [supabaseSignUp]);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    getFingerPrintID();
  }, [getFingerPrintID]);

  return (
    <div className="container mx-auto flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-semibold">Logging you in...</h1>
      </div>
    </div>
  );
};

export default LoginPage;
