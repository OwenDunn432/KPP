let isSignedIn = false;

console.log("Running handle login display");
assessSignInState();

function assessSignInState() {
    // Assess the sign in state on loading the web page.
    console.log("Assessing the current sign in state.");

    // Check if signed in and authenticated via supabase
    if (isSignedIn) {
      console.log("Signed in");
    }

    else {
      console.log("Signed out");
    }
}

// Handle site data on sign in
function onSignIn() {
  console.log("Updating site for new Google sign in");

  document.getElementById("signed_out_state").hidden = true;
  document.getElementById("signed_in_state").hidden = false;
}