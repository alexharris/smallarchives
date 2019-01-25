// 
//  This file is meant to help DRY out much of the code in the .vue files.
//	Namely, many of the calls to firebase that get repeated over and over in every view.
//  
//-----------------------
//
// Add the following to a .vue file to access these functions
//
// import sa from '../sa'
//
//-----------------------
// Archive
// - Create
// -- AdminCreateArchive
// - Read
// -- AdminShowArchive
// - Update
// -- AdminEditArchive
// - Delete
// -- AdminEditArchive
// - List
// -- AdminListArchives
// Asset
// - Create
// -- AdminCreateAsset
// - Read
// -- xx
// - Update
// -- AdminEditAsset
// - Delete
// -- AdminEditAsset
// User
// - Create
// -- UserSignUp
// - Read
// -- UserProfile
// - Update
// -- EditUserProfile
// - Delete
// -- DeleteUser

import firebase from 'firebase'

var sa = { 
  /**
  * Returns a message that is sent to it
  * @param msg - A message
  */
  hello(msg) {
    return msg
  },
  /**
  * Returns a reference to the "userarchives" collection
  * @param uid - The logged in user's ID
  */
  archiveCollectionDbRef(uid) {
  	return firebase.firestore().collection("archives").doc(uid).collection("userarchives")
  },
  /**
  * Returns a reference to a specific, existing archive document
  * @param uid - The logged in user's ID
  */
  archiveDocumentDbRef(uid, archiveId) {
  	return firebase.firestore().collection("archives").doc(uid).collection("userarchives").doc(archiveId)
  },  
  /**
  * Returns a reference to an "assets" folder in firebase for a specific archive
  * @param uid - The logged in user's ID
  * @param archiveId - The id of the archive that the assets belong to
  */
  assetCollectionDbRef(uid, archiveId) {
  	return firebase.firestore().collection("archives").doc(uid).collection("userarchives").doc(archiveId).collection('assets')
  },  
  /**
  * Returns a reference to a specific, existing asset document
  * @param uid - The logged in user's ID
  * @param archiveId - The id of the archive that the assets belong to
  * @param assetId - The id of the asset desired
  */
  assetDocumentDbRef(uid, archiveId, assetId) {
  	return firebase.firestore().collection('archives').doc(uid).collection('userarchives').doc(archiveId).collection('assets').doc(assetId);
  },  
  /**
  * Returns a uid when given a username
  * @param username - The username
  */
  getUidFromUsername(username) {
  	return new Promise(resolve => {
		firebase.firestore().collection('users').where("displayName", "==", username)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				resolve(doc.id)
			});
		})
  	})
  }   
}

export default sa