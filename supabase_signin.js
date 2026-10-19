const SUPABASE_URL = "https://snwieeljkjlkntyioonh.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Rv9RiVF1iv8IOzKQqEOrlQ_yUwocFV2";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

async function handleGoogleSignIn(response) {
  const { data, error } = await supabaseClient.auth
    .signInWithIdToken({
      provider: "google",
      token: response.credential,
    });

  if (error) {
    console.error("Sign-in failed:", error.message);
    alert("Unable to sign in. Please try again.");
    return;
  }

  console.log("Signed in successfully!");
  console.log("Supabase user ID:", data.user.id);
  console.log("Name:", data.user.user_metadata.full_name);
}