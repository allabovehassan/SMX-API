const soap = require("soap");

const url =
  "http://localhost:3000/api/reservation?wsdl";
const args = {
  OTA_HotelResNotifRQ: {
    HotelReservations: {
      HotelReservation: {
        ResStatus: "Reserved",
        UniqueID: { ID: "12345" },
        RoomStay: {
          RoomTypes: {
            RoomType: { RoomTypeCode: "Double" }
          }
        },
        ResGuests: {
          ResGuest: {
            GuestCounts: { GuestCount: { Count: 2 } }
          }
        },
        TimeSpan: {
          Start: "2024-07-20",
          End: "2024-07-25"
        }
      }
    }
  }
};

const wsSecurity = new soap.WSSecurity(
  "username",
  "secret",
  {
    passwordType: "PasswordText"
  }
);

soap.createClient(url, (err, client) => {
  if (err) {
    console.error("Error creating SOAP client:", err);
    return;
  }
  console.log("SOAP Client created successfully.");

  client.setSecurity(wsSecurity);

  client.OTA_HotelResNotifRQ(args, (err, result) => {
    if (err) {
      console.error(
        "Error invoking SOAP method:",
        err
      );
      return;
    }
    console.log(
      "Request Args:",
      JSON.stringify(args, null, 2)
    );
    console.log(
      "Response:",
      JSON.stringify(result, null, 2)
    );
  });
});
