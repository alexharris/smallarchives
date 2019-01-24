// 
//  This file is meant to help DRY out much of the code in the .vue files.
//	Namely, many of the calls to firebase that get repeated over and over in every view.
//  
// Archive
// - Create
// -- AdminCreateArchive
// - Read
// -- AdminShowArchive
// - Update
// -- AdminEditArchive
// - Delete
// -- AdminEditArchive
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


var sa = { 
  hello (msg) {
    return msg
  }
}

export default sa