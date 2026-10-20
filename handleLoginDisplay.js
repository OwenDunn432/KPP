const public_content = document.getElementById("public_content");
const private_content = document.getElementById("private_content");

console.log("Running handle login display");

// Update the display based on the current session
async function assessSignInState() {
  console.log("Assessing the current sign in state.");

  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Error checking session:", error);
    return;
  }

  const isSignedIn = !!data.session;

  updatePageDisplay(isSignedIn);
}

// Show the appropriate content
function updatePageDisplay(isSignedIn) {
  public_content.hidden = isSignedIn;
  private_content.hidden = !isSignedIn;
}

// Check the session on page load
assessSignInState();

// React to sign-in, sign-out, and other auth state changes
const { data: { subscription } } =
  supabaseClient.auth.onAuthStateChange((event, session) => {
    updatePageDisplay(!!session);
  });