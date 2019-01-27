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
	* CLOUD
	*,------.,--.                      ,--.                       
	*|  .---'`--',--.--. ,---.  ,---.,-'  '-. ,---. ,--.--. ,---. 
	*|  `--, ,--.|  .--'| .-. :(  .-''-.  .-'| .-. ||  .--'| .-. :
	*|  |`   |  ||  |   \   --..-'  `) |  |  ' '-' '|  |   \   --.
	*`--'    `--'`--'    `----'`----'  `--'   `---' `--'    `----'                                                           
	*/                                          
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
	* Notes:
	* Usually, this is called from "created()" in a view and params are retrieved from URL
	*/
	assetDocumentDbRef(uid, archiveId, assetId) {
		return firebase.firestore().collection('archives').doc(uid).collection('userarchives').doc(archiveId).collection('assets').doc(assetId);
	}, 
	/**
	* ,---.   ,--.                                      
	*'   .-',-'  '-. ,---. ,--.--. ,--,--. ,---.  ,---. 
	*`.  `-.'-.  .-'| .-. ||  .--'' ,-.  || .-. || .-. :
	*.-'    | |  |  ' '-' '|  |   \ '-'  |' '-' '\   --.
	*`-----'  `--'   `---' `--'    `--`--'.`-  /  `----'
	*                                     `---'                                                                                                           
	*/   
	/**
	* Returns a file from storage from the path [user_id]/archive_[archive_id]/
	* @param uid - The ID of the user who created this archive
	* @param archiveId - The id of the archive
	* @param fileName - The filename of the uploaded file
	* @param prefix - Different file sizes get prefixes, for instance "thumb_" for thumbnail. Leave blank for original.
	* Prefix options: 'thumb_'
	* Notes:
	* This is currently where the main representative image for an archive is stored
	*/
	archiveStorageRef(uid, archiveId, fileName, prefix = '') {
		var filePath = uid + '/archive_' + archiveId + '/' + prefix + fileName
		return firebase.storage().ref().child(filePath)
	},  
	/**
	* Returns a file from storage from the path [user_id]/archive_[archive_id]/assets/filename
	* @param uid - The ID of the user who created this archive
	* @param archiveId - The id of the archive
	* @param assetId - The id of the asset
	* @param fileName - The filename of the uploaded file
	* @param prefix - Different file sizes get prefixes, for instance "thumb_" for thumbnail. Leave blank for original.
	* Prefix options: 'thumb_'
	*/
	assetStorageRef(uid, archiveId, assetId, fileName, prefix = '') {
		console.log(uid)
		console.log(archiveId)
		console.log(assetId)
		console.log(fileName)
		var filePath = uid + '/archive_' + archiveId + '/assets/' + prefix + fileName
		return firebase.storage().ref().child(filePath)
	},    

	/**
	*,--. ,--.  ,--.  ,--.,--.,--.  ,--.  ,--.              
	*|  | |  |,-'  '-.`--'|  |`--',-'  '-.`--' ,---.  ,---. 
	*|  | |  |'-.  .-',--.|  |,--.'-.  .-',--.| .-. :(  .-' 
	*'  '-'  '  |  |  |  ||  ||  |  |  |  |  |\   --..-'  `)
	* `-----'   `--'  `--'`--'`--'  `--'  `--' `----'`----'                                                                                                          
	*/    
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
	},
	/**
	* Returns a formatted date when given a timestamp
	* @param dateCreated - The timestamp value
	*/  
	getFormattedDate (dateCreated) {
		var day = dateCreated.getDate()
		var month = dateCreated.getMonth() + 1
		var year = dateCreated.getFullYear()
		var formattedDate = month + '-' + day + '-' + year
		return formattedDate
	},     
}

export default sa