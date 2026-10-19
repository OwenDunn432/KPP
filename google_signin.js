let currentUser = null;
let hasSubmitted = false;

// Handle Google authentication
function handleCredentialResponse(response) {

    console.log("Encoded JWT ID token: " + response.credential);

    // For sending to back end
    currentUser = {
        credential: response.credential
    };

    const profile = decodeJWT(response.credential);

    console.log("Decoded JWT ID token fields:");
    console.log("Signed in: ", profile.name);
    console.log("Email: ", profile.email);
    console.log("Google user ID: ", profile.sub);

    // Handle sign in with supabase here
    handleGoogleSignIn(response);

    // Update site
    //onGoogleSignIn(profile);
}

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

// Handle site data on sign in
function onGoogleSignIn() {
    console.log("Updating site for new Google sign in");

    document.getElementById("signed_out_state").hidden = true;
    document.getElementById("signed_in_state").hidden = false;
}

// Events
document.getElementById("submit_vote_button").addEventListener("click", async () => {
    if (!currentUser || hasSubmitted) return;

    // Later, send currentUser.credential to your backend
    // for verification before accepting the vote.

    console.log("Vote button clicked");

    // This is only a temporary UI demonstration.
    // Remove this assignment when implementing real submission.
    
    hasSubmitted = true;
    document.getElementById("submit_vote_button").disabled = true;
});