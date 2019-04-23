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

import firebase from "firebase";

var sa = {
  /**
   * Returns a message that is sent to it
   * @param msg - A message
   */
  hello(msg) {
    return msg;
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
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid)
      .collection("userarchives");
  },
  /**
   * Returns a reference to a specific, existing archive document
   * @param uid - The logged in user's ID
   */
  archiveDocumentDbRef(uid, archiveId) {
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid)
      .collection("userarchives")
      .doc(archiveId);
  },
  /**
   * Returns a reference to an "item" folder in firebase for a specific archive
   * @param uid - The logged in user's ID
   * @param archiveId - The id of the archive that the items belong to
   */
  itemCollectionDbRef(uid, archiveId) {
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid)
      .collection("userarchives")
      .doc(archiveId)
      .collection("items");
  },
  /**
   * Returns a reference to a specific, existing item document
   * @param uid - The logged in user's ID
   * @param archiveId - The id of the archive that the items belong to
   * @param itemId - The id of the item desired
   * Notes:
   * Usually, this is called from "created()" in a view and params are retrieved from URL
   */
  itemDocumentDbRef(uid, archiveId, itemId) {
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid)
      .collection("userarchives")
      .doc(archiveId)
      .collection("items")
      .doc(itemId);
  },
  /**
   * Returns a reference to a specific, existing user archive record
   * @param uid - The logged in user's ID
   */
  userArchivesDocumentDbRef(uid) {
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid);
  },
  /**
   * Returns a reference to the "tags" collection of a userarchives
   * @param uid - The logged in user's ID
   */
  tagCollectionDbRef(uid, archiveId) {
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid)
      .collection("userarchives")
      .doc(archiveId)
      .collection("tags");
  },
  /**
   * Returns a reference to a specific, existing tag document that exists on an archive record, not on an item
   * @param uid - The logged in user's ID
   * @param archiveId - The id of the archive that the tag belongs to
   * @param tagId - The id of the tag desired
   * Notes:
   * Usually, this is called from "created()" in a view and params are retrieved from URL
   */
  tagDocumentDbRef(uid, archiveId, tagId) {
    return firebase
      .firestore()
      .collection("archives")
      .doc(uid)
      .collection("userarchives")
      .doc(archiveId)
      .collection("tags")
      .doc(tagId);
  },
  /**
   * Returns a reference to the "users" collection
   */
  userCollectionDbRef(uid, archiveId) {
    return firebase.firestore().collection("users");
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
  archiveStorageRef(uid, archiveId, fileName, prefix = "") {
    var filePath = uid + "/archive_" + archiveId + "/" + prefix + fileName;
    return firebase
      .storage()
      .ref()
      .child(filePath);
  },
  /**
   * Returns a file from storage from the path [user_id]/archive_[archive_id]/items/filename
   * @param uid - The ID of the user who created this archive
   * @param archiveId - The id of the archive
   * @param itemId - The id of the item (this might not be necessary?)
   * @param fileName - The filename of the uploaded file
   * @param prefix - Different file sizes get prefixes, for instance "thumb_" for thumbnail. Leave blank for original.
   * Prefix options: 'thumb_'
   */
  itemStorageRef(uid, archiveId, itemId, fileName, prefix = "") {
    // console.log(uid)
    // console.log(archiveId)
    // console.log(itemId)
    // console.log(fileName)
    var filePath =
      uid + "/archive_" + archiveId + "/items/" + prefix + fileName;
    return firebase
      .storage()
      .ref()
      .child(filePath);
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
      firebase
        .firestore()
        .collection("users")
        .where("displayName", "==", username)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
              resolve(doc.id);
            });
          } else {
            resolve(false);
          }
        });
    });
  },
  /**
   * Returns a formatted date when given a timestamp
   * @param dateCreated - The timestamp value
   */

  getFormattedDate(dateCreated) {
    dateCreated = dateCreated.toDate();

    var day = dateCreated.getDate();
    var month = dateCreated.getMonth() + 1;
    var year = dateCreated.getFullYear();
    var formattedDate = month + "-" + day + "-" + year;
    return formattedDate;
  },
  /**
   * Returns a truncated string
   * @param string - The string to be truncated
   * @param integer - The length the string is to be truncated to
   */

  truncateString(string, length) {
    if (string.length > length) {
      return string.substring(0, length) + "...";
    } else {
      return string;
    }
  },
  /**
   * Add header image to an archive
   * @param uid - The ID of the user who created this archive
   * @param archiveId - The archive ID
   * @param file - the file to be uploaded
   */

  addArchiveHeaderImage(uid, archiveId, file) {
    sa.archiveDocumentDbRef(uid, archiveId).update({
      headerImage: file.name
    });

    sa.archiveStorageRef(uid, archiveId, file.name)
      .put(file)
      .then(() => {
        console.log("Uploaded a blob or file!");
      });
  },
  /**
   * Delete header image from an archive
   * @param uid - The ID of the user who created this archive
   * @param archiveId - The archive ID
   * @param fileName - the name of the file to be deleted
   */

  deleteArchiveHeaderImage(uid, archiveId, fileName) {
    // set the header image refernce in db to blank
    sa.archiveDocumentDbRef(uid, archiveId).update({
      headerImage: ""
    });

    // Delete the header image thumb from storage
    sa.archiveStorageRef(uid, archiveId, fileName, "thumb_")
      .delete()
      .then(function() {
        console.log("Header image thumb successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing header image thumb: ", error);
      });

    // Delete the header image from storage
    sa.archiveStorageRef(uid, archiveId, fileName)
      .delete()
      .then(function() {
        console.log("Header image successfully deleted!");
      })
      .catch(function(error) {
        console.error("Error removing main image from storage: ", error);
      });
  },
  /**
   * Check ownership when determining whether to show admin stuff
   * @param currentArchiveId - The ID of the archive currently being viewed
   */
  confirmOwner(currentArchiveId) {
    
    var currentUserArchives = [];

    return new Promise(resolve => {
      sa.archiveCollectionDbRef(firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            currentUserArchives.push(doc.id);
          });
        })
        .then(() => {
          if (currentUserArchives.includes(currentArchiveId)) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }
};

export default sa;
