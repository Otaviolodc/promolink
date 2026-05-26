import { supabase } from "./supabase";

export async function isProUser() {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  const { data } = await supabase
    .from("profiles")
    .select("is_pro")
    .eq("id", session.user.id)
    .single();

  return data?.is_pro === true;
}