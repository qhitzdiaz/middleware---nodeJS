// App.js
// Connection to Database
// (c) qhitz 2019.11.22
const admin = require("firebase-admin");
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");
const app = express();
global.db = require("./database");
const allowedOrigins = [
"capacitor://localhost",
"ionic://localhost",
"http://localhost",
"http://localhost:8080",
"http://localhost:8100",
"http://localhost:8101"
];
const corsOptions = {
origin: (origin, callback) => {
if (allowedOrigins.includes(origin) || !origin) {
callback(null, true);
} else {
callback(new Error("Origin not allowed by CORS"));
}
}
};
const { getLocations } = require("./routes/locations/index");
const {
getServices,
createService,
getServicesByProvider,
getServicesById,
addAvailability
} = require("./routes/services/index");
const {
getServicesByLocation,
getAvailServicesByLocation
} = require("./routes/services/index");
const { getProviderServiceLoc } = require("./routes/bookings/index");
const {
getBookingsByProvider,
getBookingsByCustomer,
getAvailability,
getAcceptedStatusFromProvider,
getNotAcceptedStatusFromProvider
} = require("./routes/bookings/index");
const { getBookingsByProviderCompleted } =
require("./routes/bookings/index");
const { pay_payamaya } = require("./routes/paymaya/index");
const { authenticate } = require("./authenticate/authentication");
const firebaseConfig = require("./authenticate/firebaseConfig");
// const firebaseConfig = {
// apiKey: "xasdasdaA2ASASADXXXXX",
// authDomain: "example.firebaseapp.com",
// databaseURL: "https://example.firebaseio.com",
// projectId: "example",
// storageBucket: "example-01.appspot.com",
// messagingSenderId: "6292091222947",
// appId: "1:11111111111:web:sasdasd1231xa1"
// };
admin.initializeApp(firebaseConfig);

const port = 5000;
// configure middleware
app.options("*", cors(corsOptions));
app.get("/", cors(corsOptions), (req, res, next) => {
res.json({ message: "This route is CORS-enabled for an allowed origin." });
});
app.set("port", process.env.port || port); // set express to use this port
app.set("views", __dirname + "/views"); // set express to look in this folder
to render our view
app.set("view engine", "ejs"); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, "public"))); // configure express
to use public folder
app.use(fileUpload()); // configure fileupload
// routes for the app
app.get("/locations", authenticate, getLocations);
app.get("/services", authenticate, getServices);
app.get("/availServicesByLocation", authenticate,
getAvailServicesByLocation);
app.get("/services/:id", authenticate, getServicesById);
app.get("/getServicesByProviderId/:id", authenticate, getServicesByProvider);
app.post("/createservice", authenticate, createService);
app.post("/addAvailability", authenticate, addAvailability);
app.post("/paypaymaya", pay_payamaya);
//Customer Users
const { getCustomers } = require("./routes/customers/index");
const { getCustomerById } = require("./routes/customers/index");
const { saveCustomer } = require("./routes/customers/index");
const { updateCustomer } = require("./routes/customers/index");
app.post("/updatecustomer", authenticate, updateCustomer);
app.get("/customers", authenticate, getCustomers);
app.get("/customer/:id", authenticate, getCustomerById);
app.post("/savecustomer", authenticate, saveCustomer);
//Provider Users
const { getProviders } = require("./routes/providers/index");
const { saveProvider } = require("./routes/providers/index");
const { getProviderById } = require("./routes/providers/index");
const { updateProvider } = require("./routes/providers/index");
//-------------
//booking -test
app.get("/providers", authenticate, getProviders);
// -------------
//app.get("/providers", getProviders);
app.get("/provider/:id", authenticate, getProviderById);
app.post("/saveprovider", authenticate, saveProvider);
app.post("/updateprovider", authenticate, updateProvider);
//Bookings
const {
getBookings,
acceptBooking,
getBookingsByJobID
} = require("./routes/bookings/index");
const { bookNow, transaction } = require("./routes/bookings/index");
// ---------
//app.get("/bookings", getProviderServiceLoc);
// ---------
app.post("/acceptBooking/:id", authenticate, acceptBooking);
app.get("/ViewBookings", authenticate, getBookings);
app.post("/bookNow", authenticate, bookNow);
app.post("/transaction", authenticate, transaction);
app.get("/bookings/:id", authenticate, getBookingsByProvider);
app.get("/bookingByProviderId/:provideruid", authenticate,
getBookingsByJobID);
app.get(
"/getNotAcceptedStatusFromProvider/:id",
authenticate,
getNotAcceptedStatusFromProvider
);
app.get(
"/getAcceptedStatusFromProvider/:id",
authenticate,
getAcceptedStatusFromProvider
);
//bookingsOfCustomer
app.get("/bookingsOfCustomer/:id", authenticate, getBookingsByCustomer);
//get availability of providers -> Customer
app.get("/getAvailability/:id", authenticate, getAvailability);
//app.get('/bookings/:id/:status',getBookingsByProviderCompleted);
// set the app to listen on the port
app.listen(port, () => {
console.log(`Server running on port: ${port}`);
});
