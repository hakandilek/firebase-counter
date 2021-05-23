const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const cors = require("cors")({ origin: true });

firebase.initializeApp();

// https://firebase.google.com/docs/functions/write-firebase-functions

exports.counter = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    firebase.firestore()
      .collection("counter-db")
      .doc("counter")
      .get()
      .then((counter) => {
        const orig = counter.get("count");
        const count = orig == null || isNaN(orig) ? 0 : orig + 1;
        const updated = {
          "count": count,
          "updated": Date.now(),
        };
        firebase.firestore()
          .collection("counter-db")
          .doc("counter")
          .set(updated)
          .then((_success) => {
            functions.logger
              .info(`counter: ${count} written.`, { structuredData: true });
            response.status(200).send(updated);
          }, (reject) => {
            functions.logger
              .info(`counter: ${count} failed.`, { structuredData: true });
            response.status(500).send({ "error": reject });
          });
      });
  });
});
