const express = require("express");
const soap = require("soap");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// WSDL file path
const wsdlPath = path.join(__dirname, "reservation.wsdl");

console.log(wsdlPath);

// Define the service with operations
const service = {
  ReservationService: {
    ReservationPort: {
      OTA_HotelResNotifRQ: (args, cb, headers) => {
        console.log("Received Reservation Notification:", args);

        // Check SOAP headers for authentication
        const securityHeader = headers.Security;
        if (
          securityHeader &&
          securityHeader.UsernameToken &&
          securityHeader.UsernameToken.Username === "username" &&
          securityHeader.UsernameToken.Password === "secret"
        ) {
          return {
            OTA_HotelResNotifRS: {
              status: "Success",
              message: "Reservation processed successfully",
            },
          };
        } else {
          throw new Error("Unauthorized");
        }
      },
    },
  },
};

// Read WSDL file
fs.readFile(wsdlPath, "utf8", (err, wsdl) => {
  if (err) {
    console.error("Error reading WSDL file:", err);
    return;
  }

  // Create SOAP server
  soap.listen(app, "/api/reservation", service, wsdl, () => {
    console.log(`SOAP server listening on http://localhost:${port}`);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
