// ***********************************
// VARS
// ***********************************

// Supabase Keys
const SUPABASE_URL = "https://snwieeljkjlkntyioonh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Rv9RiVF1iv8IOzKQqEOrlQ_yUwocFV2";
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Voting nomination selection
let selectedNomination = null;

// ***********************************
// HANDLE LOGIN
// ***********************************

// Handles Google authentication upon signing in
function handleCredentialResponse(response) {
  handleSupabaseSignIn(response);
}

async function handleSupabaseSignIn(response) {
  // Attempt sign in to supabase
  const { data, error } = await supabaseClient.auth
    .signInWithIdToken({
      provider: "google",
      token: response.credential,
    });
  
  // On login error
  if (error) {
    alert("Sign in unsucessful. Please try again.");
    return;
  }

  // On login success
  console.log("Succesfully authenticated through Google and signed into Supabase.");
}

// ***********************************
// HANDLE LOG OUT
// ***********************************
async function handleLogout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    return;
  }

  alert("You have been successfully logged out.");
}

// ***********************************
// HANDLE VOTE SUBMISSION
// ***********************************
async function handleVoteSubmission() {
  // Check whether the user has a valid Supabase session
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data.user) {
    console.log("User is not signed in.");
    return;
  }

  // If no nominee is selected
  if (selectedNomination === null) {
    alert("Please choose a nomination to vote.");
    return;
  }

  const vote = prepareVote(data);

  // Insert the vote into Supabase
  const { error: insertError } = await supabaseClient
    .from("Voting Table")
    .upsert(vote, {
      onConflict: "voter_id",
    });

  // On failed submission
  if (insertError) {
    console.error("Vote submission failed:", insertError);
    alert("Unable to submit your vote. Please try again.");
    return;
  }
  
  // On successful submission
  alert("Your submission was successful!");
}

function prepareVote(data) {
  const user = data.user;
  const metadata = user.user_metadata;

  const vote = {
    voter_id: user.id,
    voter_name: metadata.full_name || metadata.name || "Unknown",
    voter_email: metadata.email || "Unknown",
    voter_nomination: selectedNomination,
  };

  return vote;
}

// ***********************************
// EVENTS
// ***********************************

// On click submit vote
document.getElementById("submit_vote_button").addEventListener("click", async () => {
  await handleVoteSubmission();
  document.getElementById("submit_vote_button").disabled = true;
});

// On click log out
document.getElementById("logout_button").addEventListener("click", async () => {
  await handleLogout();
})

// On select a vote
document.querySelectorAll(".nominee").forEach(input => {
  input.addEventListener("change", (event) => {
    selectedNomination = event.target.value;
    console.log(selectedNomination);
  });
});

// ***********************************
// DEBUGGING
// ***********************************

// Displays information about the signed in Google account in the console 
function consoleLogProfileInfo(response) {
  const profile = decodeJWT(response.credential);

  console.log("Decoded JWT ID token fields:");
  console.log("Signed in: ", profile.name);
  console.log("Email: ", profile.email);
}

// Decodes the Google token for signing in with supabase
function decodeJWT(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
      atob(base64)
      .split("")
      .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}