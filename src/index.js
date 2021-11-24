import { initializeApp } from 'firebase/app'
import { 
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCCa2KDQiPTKJr70htjK5RbfFSGCGsMMOw",
    authDomain: "meetus-76f91.firebaseapp.com",
    databaseURL: "https://meetus-76f91.firebaseio.com",
    projectId: "meetus-76f91",
    storageBucket: "meetus-76f91.appspot.com",
    messagingSenderId: "968306798422",
    appId: "1:968306798422:web:bbf5089d2805499ba870f7"
  };

  // init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()


// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, 
  //where("author", "==", "amigo"),
  orderBy("createdAt"))

// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = []
  snapshot.docs.forEach((doc) => {
    books.push({...doc.data(), id: doc.id })
  })
  console.log(books)
})

// get collection data
/*
onSnapshot(colRef, (snapshot) => {
  let books = []
  snapshot.docs.forEach( (doc) => {
      books.push( {
          ...doc.data(), id: doc.id
      })
  })
  console.log(books)
})
*/

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc( colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  })
  .then( () => {
    addBookForm.reset()
  })

})

// Deleting document
const deleteBookForm = document.querySelector('.deleteForm')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then( () => {
      deleteBookForm.reset()
    })
})

// Get a single document
const docRef = doc(db, 'books', '17h9L3HNvQKWo7R2TpGE')

/*
getDoc(docRef)
  .then( (doc) => {
    console.log(doc.data(), doc.id)
  })
*/
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)
})

// updating a form
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then( () => {
    updateForm.reset()
  })

})


const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  const message = document.querySelector('.message')

  console.log(`creating user ${email}`)

  createUserWithEmailAndPassword(auth, email, password)
    .then( (cred) => {
      console.log('user created:', cred.user)
      message.innerHTML = `User created with id: ${cred.user.uid}`
      message.classList.remove('is-hidden')
      message.classList.remove('has-background-danger')
      message.classList.add('has-background-success')
      signupForm.reset()
    })
    .catch( (error) => {
      console.log(error.message)
      message.innerHTML = error.message
      message.classList.remove('is-hidden')
      message.classList.remove('has-background-success')
      message.classList.add('has-background-danger')
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit',  (e) => {
  e.preventDefault()
  signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value)
    .then( (cred) => {
      console.log("user logged in:  " + cred.user)
    })
    .catch( (err) => {
      console.log(err.message)
    })
})

const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out")
    })
    .catch( (err) => {
      console.log(err.message)
    })
})


// subs to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed :', user)
})

const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', (e) => {
  console.log('unsubscribing from subscriptions')

  unsubCol()
  unsubDoc()
  unsubAuth()
})