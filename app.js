import { 
    initializeApp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9ppt5vU-XhTu6FYaoWY60oaDAZmXF_-4",
    authDomain: "my-first-firebase-projec-a87d4.firebaseapp.com",
    projectId: "my-first-firebase-projec-a87d4",
    storageBucket: "my-first-firebase-projec-a87d4.appspot.com",
    messagingSenderId: "253620189390",
    appId: "1:253620189390:web:3b7f7e0c4bdff852e3f89f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication instance
const auth = getAuth(app);

const db = getFirestore();

//DOM references
const mainView = document.getElementById("loading");

const emailVerificationView = document.getElementById("email-verify");

const email = document.getElementById('email');
const password = document.getElementById('password');
const signUpBtn = document.getElementById('signup-btn');

const UiErrorMessage = document.getElementById('error-message');
const signUpFormView = document.getElementById("signup-form")
const userProfileView = document.getElementById("user-profile")
const UiUserEmail = document.getElementById("user-email")

const logOutBtn = document.getElementById("logout-btn");
const loginForm = document.getElementById("login-form");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password")
const loginBtn = document.getElementById("login-btn")

const loginErrorMessage = document.getElementById("login-error-message");
const needAnAccountBtn = document.getElementById("need-an-account-btn");
const haveAnAccountBtn = document.getElementById("havve-an-account-btn");

const resendEmailBtn = document.getElementById("resend-email-btn");

const resetPasswordForm = document.getElementById("reset-password-form");

const forgotPasswordBtn = document.getElementById("forgot-password-btn");

const resetPasswordBtn = document.getElementById("reset-password-btn");

const resetPasswordEmail = document.getElementById("reset-password-email");

const resetPasswordMessage = document.getElementById("rp-message");

const loginWithGoogleBtm = document.getElementById("login-with-google-btn");

const name = document.getElementById("name");

const phone = document.getElementById("phone");

const updateName = document.getElementById("update-name");

const updateEmail = document.getElementById("update-email");

const updatePhone = document.getElementById("update-phone");

const updateBtn = document.getElementById("update-btn");

onAuthStateChanged(auth, async(user) => {
    console.log(user);
    if(user){

        if(!user.emailVerified) {
            userProfileView.style.display = "block";
            emailVerificationView.display = "block";
            console.log("A");

        } else{
            userProfileView.style.display = "block";
            UiUserEmail.innerHTML=user.email;
            emailVerificationView.style.display = "block";

            try {
                
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data());
                updateName.value = docSnap.data().name;
                updatePhone.value = docSnap.data().phone;
                updateEmail.value = docSnap.data().email;
                
            } catch (error) {
                
                console.log(error.code)
                
            }

            console.log("B");
        }
        loginForm.style.display = "none";
        signUpFormView.style.display= "none";
        console.log("C");

    } else {
        loginForm.style.display = "block";
        userProfileView.style.display = "none";
        console.log("D");
    }
    mainView.style.display = "none";
    console.log("E");
});

const signUpButtonPressed = async (e) => {
    e.preventDefault();
    try {
        const userCredentials = await createUserWithEmailAndPassword(
            auth, 
            email.value,
            password.value
        );

        await sendEmailVerification(userCredentials.user);

        const docRef = doc(db, "users", userCredentials.user.uid);

        await setDoc(docRef, {
            name : name.value, 
            phone : phone.value,
            email : email.value
        });

        console.log(userCredentials);
    } catch (error) {
        console.log(error.code);
        UiErrorMessage.innerHTML = formateErrorMessage(error.code, "signup");
        UiErrorMessage.classList.add('visible');
    }
};

const logOutButtonPressed = async () => {
    try {
        await signOut(auth);
        email.value = "";
        password.value = "";
    } catch (error) {
        console.log(error)
    }
}

const logInButtonPressed = async(e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(
            auth,
            loginEmail.value,
            loginPassword.value
        );        
        // Redirect to mainPage.html upon successful login
        window.location.href = 'mainPage.html';
    } catch (error) {
        console.log(error.code);
        console.log(formateErrorMessage(error.code, "login"));
        loginErrorMessage.innerHTML = formateErrorMessage(error.code, "login");
        loginErrorMessage.classList.add("visible");
    }
}

const needAnAccountBuutonPressed = () => {
    loginForm.style.display = "none";
    signUpFormView.style.display = "block";
}
const haveAnAccountButtonPressed = () => {
    loginForm.style.display = "block";
    signUpFormView.style.display = "none";
}
const resendButtonPressed = async() => {
    await sendEmailVerification(auth.currentUser);
}

const forgotPasswordButtonPressed = () => {
    //hide login show reset pass form
    resetPasswordForm.style.display = "block";
    loginForm.style.display = "none";
}

const loginWithGoogleButtonPressed = async (e) => {
    e.preventDefault();
    const googleProvider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.log(error.code)
    }
}

const resetPasswordBtnPressed = async (e) => {
    e.preventDefault();
    try {
        await sendPasswordResetEmail(auth, resetPasswordEmail.value);
        resetPasswordMessage.innerHTML = `we've sent a link to reset your password to ${resetPasswordEmail.value}`;
        resetPasswordMessage.classList.add("success");
    } catch (error) {
        console.log(error.code);
        resetPasswordMessage.innerHTML = "Please provide a valid registration email."
        resetPasswordMessage.classList.add("error");
    }
    resetPasswordMessage.classList.remove("hidden");
    console.log(resetPasswordEmail.value);
}

const updateUserProfileButtonPressed = async(e) => {
    e.preventDefault();

    // console.log(updateName.value);
    // console.log(updateEmail.value);
    // console.log(updatePhone.value);

    try {

        const docRef = doc(db, "users", auth.currentUser.uid);

        await setDoc(docRef, {
            name : updateName.value,
            phone : updatePhone.value,
            email : updateEmail.value,
        });
    } catch (error) {
        console.log(error.code)
    }
    


}

signUpBtn.addEventListener('click', signUpButtonPressed);
logOutBtn.addEventListener('click', logOutButtonPressed);
loginBtn.addEventListener('click', logInButtonPressed);
needAnAccountBtn.addEventListener('click', needAnAccountBuutonPressed);
haveAnAccountBtn.addEventListener("click", haveAnAccountButtonPressed)
resendEmailBtn.addEventListener("click", resendButtonPressed);

forgotPasswordBtn.addEventListener("click", forgotPasswordButtonPressed);

resetPasswordBtn.addEventListener("click", resetPasswordBtnPressed);

loginWithGoogleBtm.addEventListener("click", loginWithGoogleButtonPressed);

updateBtn.addEventListener("click", updateUserProfileButtonPressed)

//handles sign up erros
const formateErrorMessage = (errorCode, action) => {
    let message = ""

    if(action == "signup") {
        if(errorCode === "auth/invalid-email" || errorCode === "auth/missing-email"){
            message = "Please enter a valid email"
        } else if(
            errorCode === "auth/missing-password"  || 
            errorCode === "auth/weak-password"      
        ){
            message= "password must be 6 characters long"
        } else if(
            errorCode === "auth/already-in-use"
        ){
            message= "email is already in use"
        }
    } else if( action == "login"){
        if(errorCode == "auth/invalid-email" || 
            errorCode == "auth/missing-password"
        ){
            message ="Email or password is incorrect"
        } else if(errorCode == "auth/user-not-found"){
            message ="Our system was unable to verify your email or password"
        }
    }
    
    return message;
}